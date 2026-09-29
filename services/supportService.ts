import { mockFaqs, SUPPORT_HOURS, SUPPORT_PHONE, SUPPORT_WHATSAPP, VOICE_LINE } from '../data/mock/mockSupport';
import { request } from './client';
import { db } from './db';

export function getSupport() {
  return request(() => ({
    phone: SUPPORT_PHONE,
    whatsapp: SUPPORT_WHATSAPP,
    voiceLine: VOICE_LINE,
    hours: SUPPORT_HOURS,
    kendra: db.profile.kendra,
    faqs: mockFaqs,
  }));
}
