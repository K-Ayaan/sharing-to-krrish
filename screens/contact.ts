import { Linking } from 'react-native';

// Every call or message leaves the app for its native handler — no in-app calls (CLAUDE.md).

export const CALL_UNAVAILABLE = "Calling isn't available on this device.";
export const MAPS_UNAVAILABLE = "Maps isn't available on this device.";
export const WHATSAPP_UNAVAILABLE = "WhatsApp isn't installed on this device.";

async function openExternal(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

/** Resolves false when the device can't place calls (e.g. the iOS simulator). */
export const openPhone = (phone: string) => openExternal(`tel:${phone}`);

/** Resolves false when WhatsApp isn't installed. `phone` may include "+" and spaces. */
export const openWhatsApp = (phone: string, message: string) =>
  openExternal(`whatsapp://send?phone=${phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`);

/** Opens a WhatsApp group invite link in WhatsApp (Safari shows the invite page if it isn't installed). */
export const openWhatsAppGroup = (inviteUrl: string) => openExternal(inviteUrl);

/** Hands off to Apple Maps — there is no in-app map screen. Resolves false if Maps can't open. */
export const openMaps = (query: string) =>
  openExternal(`https://maps.apple.com/?q=${encodeURIComponent(query)}`);

const INDIAN_MOBILE = /^\+91(\d{5})(\d{5})$/;

/** "+919876543210" → "+91 98765 43210" */
export function formatPhoneDisplay(phone: string) {
  const match = INDIAN_MOBILE.exec(phone);
  return match ? `+91 ${match[1]} ${match[2]}` : phone;
}
