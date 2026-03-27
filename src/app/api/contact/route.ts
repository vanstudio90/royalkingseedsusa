import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Royal King Seeds <orders@royalkingseeds.us>',
      to: 'support@royalkingseeds.us',
      replyTo: email,
      subject: `[Contact Form] ${subject || 'General Inquiry'} — ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #275C53; padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0; font-size: 18px;">New Contact Form Message</h2>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 13px; width: 80px;">Name:</td>
                <td style="padding: 8px 0; color: #192026; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 13px;">Email:</td>
                <td style="padding: 8px 0; color: #275C53; font-size: 14px;"><a href="mailto:${email}" style="color: #275C53;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 13px;">Subject:</td>
                <td style="padding: 8px 0; color: #192026; font-size: 14px;">${subject || 'General Inquiry'}</td>
              </tr>
            </table>
            <div style="background: #F5F0EA; padding: 16px; border-radius: 8px; margin-top: 8px;">
              <p style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Message</p>
              <p style="color: #192026; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            <p style="color: #999; font-size: 11px; margin-top: 16px;">Reply directly to this email to respond to the customer.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
