import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { forwardToCrm } from '@/lib/crm-forward';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

// Helper function to escape HTML to prevent XSS attacks
function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

function generateEmailHTML(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #1e40af;
      border-bottom: 3px solid #10b981;
      padding-bottom: 10px;
    }
    .field {
      margin-bottom: 15px;
    }
    .label {
      font-weight: bold;
      color: #1f2937;
    }
    .value {
      margin-top: 5px;
      padding: 8px;
      background-color: #f9fafb;
      border-left: 3px solid #10b981;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>New Website Contact Message</h1>
  <p><strong>Submitted:</strong> ${escapeHtml(new Date().toLocaleString())}</p>

  <div class="field">
    <div class="label">Name:</div>
    <div class="value">${escapeHtml(data.name)}</div>
  </div>
  <div class="field">
    <div class="label">Email:</div>
    <div class="value">${escapeHtml(data.email) || 'Not provided'}</div>
  </div>
  <div class="field">
    <div class="label">Phone:</div>
    <div class="value">${escapeHtml(data.phone) || 'Not provided'}</div>
  </div>
  <div class="field">
    <div class="label">Message:</div>
    <div class="value">${escapeHtml(data.message)}</div>
  </div>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data: ContactFormData = {
      name: typeof body.name === 'string' ? body.name.trim() : '',
      email: typeof body.email === 'string' ? body.email.trim() : undefined,
      phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
      message: typeof body.message === 'string' ? body.message.trim() : '',
    };

    // Validate: name and message required, plus at least one of email/phone
    if (!data.name || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name and message are required' },
        { status: 400 }
      );
    }
    if (!data.email && !data.phone) {
      return NextResponse.json(
        { error: 'Please provide an email address or phone number so we can reach you' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
      console.error('EMAIL_FROM or EMAIL_TO is not configured');
      return NextResponse.json(
        { error: 'Email configuration is incomplete. Please contact support.' },
        { status: 500 }
      );
    }

    // Send the notification email using Resend
    const sanitizedName = escapeHtml(data.name).substring(0, 100);
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Website contact from ${sanitizedName}`,
      html: generateEmailHTML(data),
    });

    if (error) {
      console.error('Resend error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to send message: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Forward to the CRM (best-effort; the email above is the fallback record,
    // so a CRM failure must not fail the submission).
    let crm: 'ok' | 'failed' = 'failed';
    const crmResult = await forwardToCrm('/api/public/contact', {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      message: data.message,
    });
    if (crmResult.ok) {
      crm = 'ok';
    } else {
      console.error(`[crm-forward] contact forwarding failed: ${crmResult.error}`);
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully', emailId: emailData?.id, crm },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
