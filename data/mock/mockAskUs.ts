// Mock number and hours only — replace with the real MARCOFED support line before release.
const SUPPORT_PHONE = '+919876543210';

export type Faq = {
  id: string;
  question: string;
  /** One line under the question saying what the answer covers (AskUs.png). */
  summary: string;
  answer: string;
};

export type AskUsResponse = {
  supportPhone: string;
  supportHours: string;
  faqs: Faq[];
};

// Answers describe only what the app actually does (flow.md). Fees and approval times aren't
// covered: there's no source for them yet, so they aren't invented here.
export const mockAskUs: AskUsResponse = {
  supportPhone: SUPPORT_PHONE,
  supportHours: 'Mon – Sat, 9:00 AM – 6:00 PM',
  faqs: [
    {
      id: 'register',
      question: 'How do I register for a service?',
      summary: 'Step by step guide to register.',
      answer:
        'Open the Services tab and choose Van Dhan or LPG, then fill in the short form. Livestock needs no registration — you can browse stock straight away.',
    },
    {
      id: 'aadhaar',
      question: 'Why do I need an Aadhaar number?',
      summary: 'Know why Aadhaar is required.',
      answer:
        'Your Aadhaar number links you to your MARCOFED account, so you have one account across all services. It is not verified with an OTP, and only a masked number is kept.',
    },
    {
      id: 'multiple',
      question: 'Can I use more than one service?',
      summary: 'Use multiple services with one account.',
      answer: 'Yes. Register for each service you want to use; they all sit under the same account.',
    },
    {
      id: 'new-phone',
      question: 'How do I sign in on a new phone?',
      summary: 'Steps to access your account.',
      answer:
        'Verify your contact number, then enter the same Aadhaar number you registered with. You will be signed back into your existing account.',
    },
    {
      id: 'profile',
      question: 'How do I change my name, email or phone number?',
      summary: 'Update your personal details.',
      answer: 'On Home, tap your UID at the top to open Settings, edit the details and save.',
    },
    {
      id: 'updates',
      question: 'Where do I find price changes and announcements?',
      summary: 'Get updates on rates, schemes and more.',
      answer: 'All updates are in the Notices tab. The bell shows how many you haven’t read yet.',
    },
  ],
};
