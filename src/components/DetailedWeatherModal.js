// src/components/DetailedWeatherModal.js
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { getWeatherDescription } from '../utils/weatherUtils';

function DetailedWeatherModal({ isOpen, onClose, data, displayTemp, timeFormat }) {
  if (!data) return null;

  const { type, details } = data;

  const renderHourlyDetails = () => (
    <VStack spacing={3} align="stretch">
      <Text>
        <strong>Condition:</strong> {getWeatherDescription(details.weather_code)}
      </Text>
      <Text>
        <strong>Feels Like:</strong> {displayTemp(details.apparent_temperature, true)}
      </Text>
      <Text>
        <strong>Precipitation:</strong> {details.precipitation} mm
      </Text>
      <Text>
        <strong>Humidity:</strong> {details.relative_humidity_2m}%
      </Text>
      <Text>
        <strong>UV Index:</strong> {details.uv_index}
      </Text>
      <Text>
        <strong>Wind:</strong> {details.wind_speed_10m} km/h from {details.wind_direction_10m}°
      </Text>
    </VStack>
  );

  const renderDailyDetails = () => (
    <VStack spacing={3} align="stretch">
      <Text>
        <strong>Condition:</strong> {getWeatherDescription(details.weather_code)}
      </Text>
      <Text>
        <strong>Sunrise:</strong>{' '}
        {new Date(details.sunrise).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: timeFormat === '12h',
        })}
      </Text>
      <Text>
        <strong>Sunset:</strong>{' '}
        {new Date(details.sunset).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: timeFormat === '12h',
        })}
      </Text>
      <Text>
        <strong>Max UV Index:</strong> {details.uv_index_max}
      </Text>
      <Text>
        <strong>Total Precipitation:</strong> {details.precipitation_sum} mm
      </Text>
      <Text>
        <strong>Dominant Wind Direction:</strong> {details.wind_direction_10m_dominant}°
      </Text>
    </VStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="glass">
        <ModalHeader>Detailed Forecast for {details.time}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-around">
              <Text fontSize="2xl" fontWeight="bold">
                {details.temperature}
              </Text>
            </HStack>
            <Divider />
            {type === 'hourly' ? renderHourlyDetails() : renderDailyDetails()}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Text fontSize="xs" color="gray.500">
            Weather data from Open-Meteo
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DetailedWeatherModal;
