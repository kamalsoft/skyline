// src/components/effects/CanvasRenderer.js
import React, { useEffect, useRef, useCallback } from 'react';

const cloudPaths = {
    cloud: new Path2D("M17.5,6H15V5a3,3,0,0,0-3-3H11A5,5,0,0,0,6,7V9H5a5,5,0,0,0,0,10H17.5a4.5,4.5,0,0,0,0-9Z"),
    dayCloudy: new Path2D("M17.5,6H15V5a3,3,0,0,0-3-3H11A5,5,0,0,0,6,7V9H5a5,5,0,0,0,0,10H17.5a4.5,4.5,0,0,0,0-9Zm-9-3a3,3,0,0,1,3-3,1,1,0,0,1,1,1V5H11a3,3,0,0,1-3,3H5.5a3,3,0,0,1,0-6Z"),
    cloudy: new Path2D("M15.5,6.5A4.5,4.5,0,0,0,11,2,5,5,0,0,0,6,7v.5H5a5,5,0,0,0,0,10h9a4.5,4.5,0,0,0,1.5-8.83A4.49,4.49,0,0,0,15.5,6.5Z"),
};

const partlyCloudyLayers = [
    { id: 1, left: 0.1, top: 0.15, velocity: 0.3, size: 250, opacity: 0.6, path: cloudPaths.dayCloudy },
    { id: 2, left: 0.8, top: 0.1, velocity: 0.2, size: 220, opacity: 0.5, path: cloudPaths.cloud },
];

const overcastLayers = [
    { id: 1, left: 0.2, top: 0.1, velocity: 0.25, size: 220, opacity: 0.7, path: cloudPaths.cloudy },
    { id: 2, left: 0.7, top: 0.12, velocity: 0.18, size: 200, opacity: 0.6, path: cloudPaths.cloudy },
    { id: 3, left: -0.1, top: 0.15, velocity: 0.4, size: 280, opacity: 0.8, path: cloudPaths.cloud },
    { id: 4, left: 0.6, top: 0.2, velocity: 0.35, size: 260, opacity: 0.7, path: cloudPaths.cloudy },
    { id: 5, left: 0.3, top: 0.25, velocity: 0.5, size: 320, opacity: 0.9, path: cloudPaths.cloud },
    { id: 6, left: 0, top: 0.05, velocity: 0.3, size: 240, opacity: 0.65, path: cloudPaths.cloudy },
    { id: 7, left: 0.85, top: 0.18, velocity: 0.32, size: 230, opacity: 0.75, path: cloudPaths.cloud },
];

const CanvasRenderer = React.memo(({
    isAnimationPaused,
    isNight,
    isPartlyCloudy,
    isOvercast,
    isSnowy,
    cloudColor,
}) => {
    const canvasRef = useRef(null);
    const starsRef = useRef([]);
    const shootingStarsRef = useRef([]);
    const cloudsRef = useRef([]);
    const snowflakesRef = useRef([]);
    const animationFrameId = useRef(null);

    // Initialize stars, clouds, and snow
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { width, height } = canvas.getBoundingClientRect();

        // Init stars
        if (isNight) {
            starsRef.current = Array.from({ length: 150 }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.2,
                opacity: Math.random(),
                fade: Math.random() * 0.05 - 0.025,
            }));
        } else {
            starsRef.current = [];
        }

        // Init clouds
        let cloudLayers = [];
        if (isPartlyCloudy) cloudLayers = partlyCloudyLayers;
        else if (isOvercast) cloudLayers = overcastLayers;
        cloudsRef.current = cloudLayers.map(cloud => ({
            ...cloud,
            x: cloud.left * width,
            y: cloud.top * (width * 0.5),
        }));

        // Init snow
        if (isSnowy) {
            snowflakesRef.current = Array.from({ length: 100 }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 1, // Slightly larger flakes
                speed: Math.random() * 1 + 0.8, // Slightly faster
                drift: Math.random() * 2 - 1,
            }));
        } else {
            snowflakesRef.current = [];
        }
    }, [isNight, isPartlyCloudy, isOvercast, isSnowy]);

    // Effect to spawn shooting stars periodically
    useEffect(() => {
        if (isAnimationPaused || !isNight) {
            shootingStarsRef.current = [];
            return;
        }

        const spawnShootingStar = () => {
            const canvas = canvasRef.current;
            if (!canvas || shootingStarsRef.current.length > 3) return;
            const { width, height } = canvas.getBoundingClientRect();
            shootingStarsRef.current.push({
                id: Date.now(),
                x: Math.random() * width,
                y: Math.random() * height * 0.2,
                len: Math.random() * 80 + 50,
                speed: Math.random() * 3 + 2,
                opacity: 1,
            });
        };

        const intervalId = setInterval(spawnShootingStar, 2000 + Math.random() * 3000);
        return () => clearInterval(intervalId);
    }, [isAnimationPaused, isNight]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        ctx.clearRect(0, 0, width, height);

        // Draw Clouds
        if (cloudsRef.current.length > 0) {
            ctx.fillStyle = cloudColor;
            ctx.filter = 'blur(2px)';
            cloudsRef.current.forEach(cloud => {
                cloud.x += cloud.velocity;
                if (cloud.x > width + cloud.size) cloud.x = -cloud.size;
                ctx.save();
                ctx.globalAlpha = cloud.opacity;
                ctx.translate(cloud.x, cloud.y);
                const scale = cloud.size / 24;
                ctx.scale(scale, scale);
                ctx.fill(cloud.path);
                ctx.restore();
            });
        }

        // Draw Stars
        starsRef.current.forEach(star => {
            star.opacity += star.fade;
            if (star.opacity <= 0 || star.opacity >= 1) star.fade *= -1;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });

        // Draw Shooting Stars
        shootingStarsRef.current = shootingStarsRef.current.filter(star => {
            star.x += star.speed;
            star.y += star.speed * 0.5;
            star.opacity -= 0.015;
            if (star.x > width || star.y > height || star.opacity <= 0) return false;
            const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.len, star.y - star.len * 0.5);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.len, star.y - star.len * 0.5);
            ctx.stroke();
            return true;
        });

        // Draw Snow
        snowflakesRef.current.forEach(flake => {
            flake.y += flake.speed;
            flake.x += flake.drift;
            if (flake.y > height) {
                flake.y = -5;
                flake.x = Math.random() * width;
            }
            if (flake.x > width || flake.x < 0) {
                flake.drift *= -1;
            }
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // Slightly more opaque
            ctx.fill();
        });

    }, [cloudColor]);

    useEffect(() => {
        const animate = () => {
            draw();
            animationFrameId.current = requestAnimationFrame(animate);
        };

        if (!isAnimationPaused) {
            animate();
        } else {
            cancelAnimationFrame(animationFrameId.current);
        }

        return () => cancelAnimationFrame(animationFrameId.current);
    }, [isAnimationPaused, draw]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }} />;
});

export default CanvasRenderer;