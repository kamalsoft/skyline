// src/utils/pushNotifications.js

/**
 * Converts a VAPID public key from a URL-safe base64 string to a Uint8Array.
 * @param {string} base64String The VAPID public key.
 * @returns {Uint8Array} The VAPID public key as a Uint8Array.
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
 * Requests permission for notifications and subscribes the user.
 * @returns {Promise<PushSubscription>} A promise that resolves with the push subscription object.
 * @throws {Error} If notifications are not supported or permission is denied.
 */
export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported by this browser.');
  }

  const registration = await navigator.serviceWorker.ready;
  const permission = await window.Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  // IMPORTANT: Replace this with your own VAPID public key.
  // You can generate VAPID keys using web-push or other libraries.
  const vapidPublicKey = 'YOUR_PUBLIC_VAPID_KEY'; // <-- PASTE YOUR PUBLIC KEY HERE
  if (vapidPublicKey === 'YOUR_VAPID_PUBLIC_KEY') {
    console.error('VAPID public key is not set. Please generate one and update it in src/utils/pushNotifications.js');
    throw new Error('VAPID public key is not configured.');
  }

  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  console.log('User is subscribed:', subscription);

  // Send the subscription object to your backend server.
  await fetch('http://localhost:4000/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' },
  });

  return subscription;
}