# Intake Form Email Submission Setup

The intake form now sends submissions via email using [Resend](https://resend.com), a reliable email API service.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com) and sign up for a free account
2. Verify your email address

### 2. Configure Your Domain (Recommended for Production)

For production use, you should verify your own domain:

1. In the Resend dashboard, go to "Domains"
2. Add your domain and follow the DNS verification steps
3. Once verified, you can send emails from any address at your domain (e.g., `noreply@yourdomain.com`)

**For Development/Testing:**
- Resend provides a test domain (`onboarding@resend.dev`) you can use immediately
- Test emails can only be sent to your registered Resend account email

### 3. Get Your API Key

1. In the Resend dashboard, go to "API Keys"
2. Create a new API key
3. Copy the key (it starts with `re_`)

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your configuration:
   ```bash
   # Your Resend API key
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   
   # From email (must be verified in Resend)
   EMAIL_FROM=noreply@yourdomain.com
   
   # Where intake forms should be sent
   EMAIL_TO=intake@crossroads.com
   ```

### 5. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/intake` in your browser

3. Fill out and submit the form

4. Check the inbox of the `EMAIL_TO` address for the submission

## Email Format

Intake form submissions are sent as well-formatted HTML emails containing:

- **Personal Information**: Name, DOB, contact details, emergency contact
- **Recovery History**: Sobriety date, substance use history, treatment programs
- **MAT Information**: Current medications and dosage (if applicable)
- **Medical & Mental Health**: Conditions, medications, diagnoses
- **Legal & Employment**: Legal status, employment information
- **Financial Information**: Income source, fee payment ability, housing goals
- **Goals & Motivation**: Reasons for joining, recovery goals, support needs
- **References**: How they heard about Crossroads, professional references
- **Acknowledgments**: Certification and authorization checkboxes

## Error Handling

The form includes comprehensive error handling:

- **Missing API Key**: Returns a 500 error with a user-friendly message
- **Missing Email Configuration**: Returns a 500 error asking user to contact support
- **Invalid Form Data**: Returns a 400 error specifying which fields are missing
- **Email Send Failure**: Returns a 500 error with retry suggestion
- **Network Errors**: Displays error message at the top of the form

## Security Features

- All form data is validated before sending
- API key is stored securely in environment variables (never in code)
- Form submissions use POST requests with JSON payloads
- HTTPS encryption in production (via Next.js/Vercel)

## Resend Free Tier Limits

The free tier includes:
- 3,000 emails per month
- 100 emails per day
- No credit card required

This should be more than sufficient for intake form submissions.

## Troubleshooting

### "Email service is not configured" Error
- Verify `RESEND_API_KEY` is set in `.env.local`
- Restart your dev server after adding environment variables

### "Email configuration is incomplete" Error
- Verify both `EMAIL_FROM` and `EMAIL_TO` are set in `.env.local`
- Ensure `EMAIL_FROM` is verified in your Resend dashboard

### Emails Not Being Received
- Check spam/junk folders
- Verify the `EMAIL_TO` address is correct
- For test domain, ensure the recipient is your Resend account email
- Check Resend dashboard logs for delivery status

### Domain Verification Issues
- Allow up to 48 hours for DNS propagation
- Use Resend's DNS checker tool
- Try using the test domain for development first

## Support

For Resend-specific issues:
- Documentation: [https://resend.com/docs](https://resend.com/docs)
- Support: [https://resend.com/support](https://resend.com/support)
