// Display formatting shared by services and screens. Hand-rolled rather than Intl so output is
// identical on every Android version ("12 Sep 2026", "₹ 6,500", "+91 98765 43210").

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (value: number) => String(value).padStart(2, '0');

export function formatDate(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getDate())} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDayMonth(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

export function formatTime(iso: string) {
  const date = new Date(iso);
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${pad(h12)}:${pad(date.getMinutes())} ${suffix}`;
}

export function formatDateTime(iso: string) {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

export function formatMonthYear(iso: string) {
  const date = new Date(iso);
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

export function daysBetween(fromIso: string, to: Date = new Date()) {
  const start = new Date(fromIso);
  start.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}

export function updatedLabel(iso: string) {
  const days = daysBetween(iso);
  if (days <= 0) return 'Updated today';
  if (days === 1) return 'Updated yesterday';
  return `Updated ${days} days ago`;
}

// Indian digit grouping: 1,00,000.
export function groupIndian(value: number) {
  const [whole, fraction] = String(Math.round(value * 100) / 100).split('.');
  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}` : lastThree;
  return fraction ? `${grouped}.${fraction}` : grouped;
}

export function formatINR(value: number) {
  return `₹ ${groupIndian(value)}`;
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `+91 ${digits.slice(0, 5)} •••${digits.slice(7)}`;
}

export function maskNumber(value: string) {
  return `XXXX ${value.slice(-4)}`;
}

export function maskAadhaar(last4: string) {
  return `XXXX XXXX ${last4}`;
}

export function formatQuantity(value: number, unit: string) {
  return `${groupIndian(value)} ${unit}`;
}

export function formatWeightRange(min: number, max: number) {
  return min === max ? `${groupIndian(min)} kg` : `${groupIndian(min)} – ${groupIndian(max)} kg`;
}
