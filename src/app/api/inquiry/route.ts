import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const INQUIRY_RECIPIENT = process.env.CONTACT_INQUIRY_TO ?? 'heshanchamuditha05@gmail.com';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'Tuwin Nilakshana Portfolio <onboarding@resend.dev>',
    to: INQUIRY_RECIPIENT,
    replyTo: email,
    subject: `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send inquiry.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
