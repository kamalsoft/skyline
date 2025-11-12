// src/components/settings/NotificationSettings.js
import React, { useState, useEffect } from 'react';
import {
    VStack,
    Heading,
    Alert,
    AlertIcon,
    FormControl,
    FormLabel,
    Switch,
    HStack,
    useToast
} from '@chakra-ui/react';
import { useSettings } from '../../contexts/SettingsContext';
import { subscribeUserToPush } from '../../utils/pushNotifications';
import CustomToast from '../CustomToast';

function NotificationSettings() {
    const { settings, dispatch } = useSettings();
    const [permissionStatus, setPermissionStatus] = useState(window.Notification?.permission || 'default');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setPermissionStatus(window.Notification?.permission || 'default');
    }, []);

    const handleSettingChange = async (settingName, value) => {
        if (settingName === 'enablePushNotifications' && value === true) {
            setIsSubscribing(true);
            try {
                await subscribeUserToPush();
                dispatch({ type: 'SET_NOTIFICATION_SETTING', payload: { settingName, value: true } });
                setPermissionStatus('granted');
                toast({
                    render: () => <CustomToast title="Notifications Enabled" description="You will now receive weather alerts." status="success" />,
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Failed to subscribe to push notifications:', error);
                setPermissionStatus(window.Notification?.permission); // Re-check permission status
                toast({
                    render: () => <CustomToast title="Subscription Failed" description={error.message} status="error" />,
                    duration: 7000,
                    isClosable: true,
                });
            } finally {
                setIsSubscribing(false);
            }
        } else {
            // TODO: Implement unsubscription logic here
            dispatch({ type: 'SET_NOTIFICATION_SETTING', payload: { settingName, value: false } });
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            <Heading size="md">Weather Alerts</Heading>
            <FormControl as={HStack} justify="space-between" p={3} borderWidth="1px" borderRadius="md" isDisabled={permissionStatus === 'denied'}>
                <FormLabel htmlFor="enable-push-notifications" mb="0">
                    Enable Push Notifications
                </FormLabel>
                <Switch id="enable-push-notifications" isChecked={settings.notificationSettings.enablePushNotifications} onChange={(e) => handleSettingChange('enablePushNotifications', e.target.checked)} isLoading={isSubscribing} />
            </FormControl>
            <Alert status="info" borderRadius="md">
                <AlertIcon />
                This feature is currently in development. Push notifications for weather alerts are coming soon!
            </Alert>
        </VStack>
    );
}

export default NotificationSettings;