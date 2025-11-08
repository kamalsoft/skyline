// src/components/WeatherMapModal.js
import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Box,
    HStack,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function WeatherMapModal({ isOpen, onClose, latitude, longitude, locationName }) {
    const [timestamps, setTimestamps] = useState([]);
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetch('https://api.rainviewer.com/public/weather-maps.json')
                .then(res => res.json())
                .then(data => {
                    const radarTimestamps = data.radar.nowcast.map(item => item.time);
                    setTimestamps(radarTimestamps);
                    setSelectedTimeIndex(radarTimestamps.length - 1); // Start with the latest
                })
                .catch(console.error);
        }
    }, [isOpen]);

    const selectedTimestamp = timestamps[selectedTimeIndex];
    const radarUrl = `https://tile.rainviewer.com/v2/radar/${selectedTimestamp}/512/{z}/{x}/{y}/2/1_1.png`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent className="glass">
                <ModalHeader>Live Weather Radar - {locationName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box h="60vh" w="100%" borderRadius="md" overflow="hidden">
                        <MapContainer center={[latitude, longitude]} zoom={7} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {selectedTimestamp && <TileLayer url={radarUrl} opacity={0.7} />}
                            <Marker position={[latitude, longitude]}>
                                <Popup>{locationName}</Popup>
                            </Marker>
                        </MapContainer>
                    </Box>
                    <HStack mt={4} spacing={4}>
                        <Text>Past</Text>
                        <Slider aria-label="time-slider" value={selectedTimeIndex} min={0} max={timestamps.length - 1} onChange={(val) => setSelectedTimeIndex(val)}>
                            <SliderTrack><SliderFilledTrack /></SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Text>Now</Text>
                    </HStack>
                    <Text textAlign="center" mt={2}>Time: {selectedTimestamp ? new Date(selectedTimestamp * 1000).toLocaleTimeString() : 'Loading...'}</Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default WeatherMapModal;