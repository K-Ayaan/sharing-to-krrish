export type FaqTopic = 'register' | 'aadhaar' | 'multiple' | 'approval' | 'fee' | 'village';

export type Faq = { id: string; topic: FaqTopic; question: string; answer: string };

// Placeholder numbers — replace with the Federation's own helpline, WhatsApp Business number and
// voice line (all procured in MARCOFED's name, per the data-sovereignty note) before release.
export const SUPPORT_PHONE = '18000000000';
export const SUPPORT_WHATSAPP = '919000000100';
export const VOICE_LINE = '18000000001';
export const SUPPORT_HOURS = 'Available Mon – Sat, 9:00 AM – 6:00 PM';

export const mockFaqs: Faq[] = [
  {
    id: 'faq-register',
    topic: 'register',
    question: 'How do I register for a service?',
    answer:
      'You can register for most services through the Services section in the app. Select the service, fill in the required details and submit.',
  },
  {
    id: 'faq-aadhaar',
    topic: 'aadhaar',
    question: 'Why do you need my mobile number?',
    answer:
      'It is how MARCOFED knows the account is yours: the OTP confirms the number, and records made by phone call or WhatsApp from that number reach the same account. You only enter it once.',
  },
  {
    id: 'faq-multiple',
    topic: 'multiple',
    question: 'Can I apply for multiple services at once?',
    answer:
      'Yes. Your MARCOFED ID works across Van Dhan, Livestock, LPG, the Communication Grid and Micro-Finance. Register for each one from Services whenever you need it.',
  },
  {
    id: 'faq-approval',
    topic: 'approval',
    question: 'How long does it take to get approval?',
    answer:
      'It depends on the service. Van Dhan collections are usually verified at the Kendra within 2–3 days. You can follow every request, step by step, under Records.',
  },
  {
    id: 'faq-fee',
    topic: 'fee',
    question: 'Is there any fee for these services?',
    answer:
      'Registering and using the app is free. Normal charges for the service itself still apply — for example, the price of an LPG refill, paid on delivery.',
  },
  {
    id: 'faq-village',
    topic: 'village',
    question: 'Where can I get help in my village?',
    answer:
      'Visit your nearest Kendra or cooperative society, or call the MARCOFED helpline. You can also use MARCOFED by phone call or WhatsApp without the app.',
  },
];
