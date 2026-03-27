import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Customer Support',
  description: 'Get in touch with the Royal King Seeds team. We help American growers with seed selection, order inquiries, growing advice, and account support. Email us or use our contact form.',
  alternates: { canonical: 'https://royalkingseeds.us/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
