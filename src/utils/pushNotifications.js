// src/utils/pushNotifications.js

const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // Replace with your actual VAPID public key from your backend

/**
 * Converts a URL-safe base64 string to a Uint8Array.
 * This is necessary for the VAPID key.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Asks the user for permission to send notifications.
 * @returns {Promise<string>} The permission status ('granted', 'denied', 'default').
 */
export async function askForNotificationPermission() {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notification');
    return 'unsupported';
  }
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Subscribes the user to push notifications.
 */
export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Worker not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('User is already subscribed.');
      return subscription;
    }

    // In a real app, you would get this key from your server.
    // For this example, we'll generate a placeholder.
    // You can generate real keys using `npx web-push generate-vapid-keys`
    const applicationServerKey = urlBase64ToUint8Array(
      'BNo5_jIuL3Cqf6wZ-j8F9g-tX6Ew8c7a8s9d0fG1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0'
    );

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log('User is subscribed:', subscription);

    // TODO: Send the subscription object to your backend server to store it.
    // await fetch('/api/subscribe', {
    //   method: 'POST',
    //   body: JSON.stringify(subscription),
    //   headers: { 'Content-Type': 'application/json' }
    // });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
  }
}
