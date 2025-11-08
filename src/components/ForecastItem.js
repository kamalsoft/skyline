// src/components/ForecastItem.js
import React from 'react';
import { VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

function ForecastItem({ label, dateLabel, weatherCode, description, temp, index, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <VStack
                className="glass"
                spacing={1} p={3}
                borderRadius="md"
                minW="110px" h="100%"
                justify="space-between"
                onClick={onClick}
                _hover={{ cursor: 'pointer', transform: 'scale(1.05)', transition: 'transform 0.2s', bg: useColorModeValue('rgba(123, 97, 255, 0.1)', 'rgba(255, 255, 255, 0.1)') }}
            >
                <Text fontWeight="bold">{label}</Text>
                {dateLabel && <Text fontSize="xs" color="gray.500">{dateLabel}</Text>}
                <AnimatedWeatherIcon weatherCode={weatherCode} w={8} h={8} title={description} />
                <Text fontSize="sm" whiteSpace="nowrap" textAlign="center">{temp}</Text>
            </VStack>
        </motion.div>
    );
}

export default ForecastItem;