import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// NOTE: Before using this API route, you need to:
// 1. Sign up for a free Resend account at https://resend.com
// 2. Get your API key from the Resend dashboard
// 3. Add RESEND_API_KEY=re_xxxxx to your .env.local file
// 4. Configure a verified sender email in Resend
// 5. Add EMAIL_FROM=noreply@yourdomain.com to your .env.local (must be verified in Resend)
// 6. Add EMAIL_TO=intake@crossroads.com to your .env.local (where intake forms should be sent)

const resend = new Resend(process.env.RESEND_API_KEY);

interface IntakeFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;

  // Recovery History
  soberDate: string;
  substanceHistory: string;
  treatmentPrograms: string;
  treatmentDetails: string;

  // MAT Information
  onMAT: string;
  matMedication?: string;
  matProvider?: string;
  matDosage?: string;

  // Medical & Mental Health
  medicalConditions: string;
  currentMedications: string;
  mentalHealthDiagnosis: string;
  mentalHealthDetails: string;
  suicidalThoughts: string;

  // Legal & Employment
  legalMatters: string;
  legalDetails: string;
  employmentStatus: string;
  employmentGoals: string;

  // Financial Information
  incomeSource: string;
  canPayFees: string;
  housingGoals: string;

  // Goals & Motivation
  whyCrossroads: string;
  recoveryGoals: string;
  anticipatedChallenges: string;
  supportNeeded: string;

  // References
  howHeardAbout: string;
  reference1Name: string;
  reference1Phone: string;
  reference1Relationship: string;

  // Agreement
  certifyTruth: boolean;
  understandGuidelines: boolean;
  authorizeBackgroundCheck: boolean;
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

function generateEmailHTML(data: IntakeFormData): string {
  // Helper to safely render optional fields
  const renderValue = (value: string | undefined | null, defaultText = 'Not provided') => {
    return escapeHtml(value) || defaultText;
  };

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
    h2 {
      color: #1e40af;
      border-bottom: 2px solid #10b981;
      padding-bottom: 5px;
      margin-top: 30px;
    }
    .section {
      margin-bottom: 20px;
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
    }
    .alert {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 12px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>New Intake Form Submission</h1>
  <p><strong>Submitted:</strong> ${escapeHtml(new Date().toLocaleString())}</p>

  <div class="section">
    <h2>Personal Information</h2>
    <div class="field">
      <div class="label">Name:</div>
      <div class="value">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div>
    </div>
    <div class="field">
      <div class="label">Date of Birth:</div>
      <div class="value">${escapeHtml(data.dateOfBirth)}</div>
    </div>
    <div class="field">
      <div class="label">Phone Number:</div>
      <div class="value">${escapeHtml(data.phoneNumber)}</div>
    </div>
    <div class="field">
      <div class="label">Email Address:</div>
      <div class="value">${escapeHtml(data.email)}</div>
    </div>
    <div class="field">
      <div class="label">Current Address:</div>
      <div class="value">${renderValue(data.address)}</div>
    </div>
    <div class="field">
      <div class="label">Emergency Contact:</div>
      <div class="value">${escapeHtml(data.emergencyContactName)} - ${escapeHtml(data.emergencyContactPhone)}</div>
    </div>
  </div>

  <div class="section">
    <h2>Recovery History</h2>
    <div class="field">
      <div class="label">Clean/Sober Date:</div>
      <div class="value">${renderValue(data.soberDate)}</div>
    </div>
    <div class="field">
      <div class="label">Substance Use History:</div>
      <div class="value">${escapeHtml(data.substanceHistory)}</div>
    </div>
    <div class="field">
      <div class="label">Treatment Programs Completed:</div>
      <div class="value">${escapeHtml(data.treatmentPrograms)}</div>
    </div>
    <div class="field">
      <div class="label">Treatment History Details:</div>
      <div class="value">${renderValue(data.treatmentDetails)}</div>
    </div>
  </div>

  <div class="section">
    <h2>Medication Assisted Treatment (MAT)</h2>
    <div class="field">
      <div class="label">Currently on MAT:</div>
      <div class="value">${escapeHtml(data.onMAT)}</div>
    </div>
    ${data.matMedication ? `
    <div class="field">
      <div class="label">MAT Medication:</div>
      <div class="value">${escapeHtml(data.matMedication)}</div>
    </div>
    ` : ''}
    ${data.matProvider ? `
    <div class="field">
      <div class="label">MAT Provider/Clinic:</div>
      <div class="value">${escapeHtml(data.matProvider)}</div>
    </div>
    ` : ''}
    ${data.matDosage ? `
    <div class="field">
      <div class="label">Current Dosage:</div>
      <div class="value">${escapeHtml(data.matDosage)}</div>
    </div>
    ` : ''}
  </div>

  <div class="section">
    <h2>Medical & Mental Health</h2>
    <div class="field">
      <div class="label">Medical Conditions:</div>
      <div class="value">${renderValue(data.medicalConditions, 'None reported')}</div>
    </div>
    <div class="field">
      <div class="label">Current Medications (other than MAT):</div>
      <div class="value">${renderValue(data.currentMedications, 'None reported')}</div>
    </div>
    <div class="field">
      <div class="label">Mental Health Diagnosis:</div>
      <div class="value">${escapeHtml(data.mentalHealthDiagnosis)}</div>
    </div>
    <div class="field">
      <div class="label">Mental Health Details:</div>
      <div class="value">${renderValue(data.mentalHealthDetails)}</div>
    </div>
    <div class="field">
      <div class="label">Suicidal Thoughts:</div>
      <div class="value">${escapeHtml(data.suicidalThoughts)}</div>
    </div>
    ${data.suicidalThoughts === 'Yes' || data.suicidalThoughts === 'Sometimes' ? `
    <div class="alert">
      <strong>⚠️ ALERT:</strong> Applicant indicated experiencing suicidal thoughts. Immediate follow-up recommended.
    </div>
    ` : ''}
  </div>

  <div class="section">
    <h2>Legal & Employment</h2>
    <div class="field">
      <div class="label">Legal Matters:</div>
      <div class="value">${escapeHtml(data.legalMatters)}</div>
    </div>
    <div class="field">
      <div class="label">Legal Details:</div>
      <div class="value">${renderValue(data.legalDetails)}</div>
    </div>
    <div class="field">
      <div class="label">Employment Status:</div>
      <div class="value">${escapeHtml(data.employmentStatus)}</div>
    </div>
    <div class="field">
      <div class="label">Employment Goals:</div>
      <div class="value">${renderValue(data.employmentGoals)}</div>
    </div>
  </div>

  <div class="section">
    <h2>Financial Information</h2>
    <div class="field">
      <div class="label">Current Income Source:</div>
      <div class="value">${escapeHtml(data.incomeSource)}</div>
    </div>
    <div class="field">
      <div class="label">Can Pay Monthly Fees:</div>
      <div class="value">${escapeHtml(data.canPayFees)}</div>
    </div>
    <div class="field">
      <div class="label">Long-term Housing Goals:</div>
      <div class="value">${escapeHtml(data.housingGoals)}</div>
    </div>
  </div>

  <div class="section">
    <h2>Goals & Motivation</h2>
    <div class="field">
      <div class="label">Why Crossroads:</div>
      <div class="value">${escapeHtml(data.whyCrossroads)}</div>
    </div>
    <div class="field">
      <div class="label">Primary Recovery Goals:</div>
      <div class="value">${escapeHtml(data.recoveryGoals)}</div>
    </div>
    <div class="field">
      <div class="label">Anticipated Challenges:</div>
      <div class="value">${renderValue(data.anticipatedChallenges)}</div>
    </div>
    <div class="field">
      <div class="label">Support Needed:</div>
      <div class="value">${renderValue(data.supportNeeded)}</div>
    </div>
  </div>

  <div class="section">
    <h2>References</h2>
    <div class="field">
      <div class="label">How They Heard About Crossroads:</div>
      <div class="value">${escapeHtml(data.howHeardAbout)}</div>
    </div>
    <div class="field">
      <div class="label">Professional Reference:</div>
      <div class="value">
        ${renderValue(data.reference1Name)}
        ${data.reference1Phone ? `<br>Phone: ${escapeHtml(data.reference1Phone)}` : ''}
        ${data.reference1Relationship ? `<br>Relationship: ${escapeHtml(data.reference1Relationship)}` : ''}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Acknowledgments</h2>
    <div class="field">
      <div class="label">Certified information is true and complete:</div>
      <div class="value">${data.certifyTruth ? '✓ Yes' : '✗ No'}</div>
    </div>
    <div class="field">
      <div class="label">Understands guidelines and contract:</div>
      <div class="value">${data.understandGuidelines ? '✓ Yes' : '✗ No'}</div>
    </div>
    <div class="field">
      <div class="label">Authorizes background check:</div>
      <div class="value">${data.authorizeBackgroundCheck ? '✓ Yes' : '✗ No'}</div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData: IntakeFormData = await request.json();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, or email' },
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

    // Generate the email HTML
    const emailHTML = generateEmailHTML(formData);

    // Sanitize the name fields for the subject line
    const sanitizedFirstName = escapeHtml(formData.firstName).substring(0, 50);
    const sanitizedLastName = escapeHtml(formData.lastName).substring(0, 50);

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Intake Form Submission - ${sanitizedFirstName} ${sanitizedLastName}`,
      html: emailHTML,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again or contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Intake form submitted successfully', emailId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing intake form:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
