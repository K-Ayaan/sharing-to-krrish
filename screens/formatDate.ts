const DATE: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
const SHORT_DATE: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
const WEEKDAY_DATE: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
const TIME: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

/** "12 Aug 2025" */
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', DATE);

/** "12 Aug" */
export const formatShortDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', SHORT_DATE);

/** "Thu, 14 Aug" */
export const formatWeekdayDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', WEEKDAY_DATE);

/** "10:30 AM" */
export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', TIME);

/** "12 Aug 2025, 10:30 AM" */
export const formatDateTime = (iso: string) => `${formatDate(iso)}, ${formatTime(iso)}`;

export const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();
