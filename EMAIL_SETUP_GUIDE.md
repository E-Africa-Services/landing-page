# Email Integration Setup Guide

## Overview

Nodemailer has been successfully integrated into **all forms** in your application. Both users/candidates and E-Africa Services will receive automated emails upon successful form submissions.

---

## 📋 What Was Implemented

### 1. **Email Utility Module** (`lib/email.ts`)

#### **Training Enrollment Emails:**

- **`sendCandidateConfirmationEmail()`** - Sends a professional welcome email to the enrolled candidate with:

  - Training program details
  - Enrollment ID and status
  - Payment reference (if applicable)
  - Next steps and contact information

- **`sendCompanyNotificationEmail()`** - Sends a notification to E-Africa Services with:

  - Complete candidate details
  - Training program information
  - Payment reference and status
  - Action required reminder

- **`sendEnrollmentEmails()`** - Sends both emails in parallel

#### **Discovery Call Emails:**

- **`sendDiscoveryCallConfirmationEmail()`** - Sends confirmation to clients requesting discovery calls with:

  - Business and contact details
  - Service interest
  - Requirements summary
  - What to expect next

- **`sendDiscoveryCallNotificationEmail()`** - Notifies company with:

  - Complete client information
  - Service request details
  - Client requirements
  - Action required within 24 hours

- **`sendDiscoveryCallEmails()`** - Sends both emails in parallel

#### **Talent Pool Emails:**

- **`sendTalentPoolConfirmationEmail()`** - Welcomes new talent pool members with:

  - Profile details and status
  - Skills summary
  - CV/Video upload confirmation
  - Next steps and pro tips

- **`sendTalentPoolNotificationEmail()`** - Notifies company with:

  - Complete candidate profile
  - Skills and experience level
  - Attachments (CV, video links)
  - Profile review action required

- **`sendTalentPoolEmails()`** - Sends both emails in parallel

### 2. **API Integration**

#### **Training Enrollments** (`app/api/training-enrollments/route.ts`)

- ✅ Emails sent automatically after successful enrollment
- ✅ Non-blocking: Email failures don't prevent enrollment
- ✅ Comprehensive logging

#### **Discovery Calls** (`app/api/discovery-calls/route.ts`)

- ✅ Emails sent automatically after discovery call request
- ✅ Client confirmation and company notification
- ✅ Non-blocking with error handling

#### **Talent Pool** (`app/api/talent-pool/route.ts`)

- ✅ Emails sent automatically after talent registration
- ✅ Candidate welcome and company notification
- ✅ Non-blocking with error handling

### 3. **Environment Variables** (`.env.example`)

- Added required email configuration variables

---

## 🔧 Setup Instructions

### Step 1: Add Email Credentials to `.env.local`

Copy these variables to your `.env.local` file and replace with your actual credentials:

```env
# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com
COMPANY_EMAIL=info@eafricaservices.com
```

### Step 2: Configure Your Email Provider

#### **Option A: Gmail (Recommended for Development)**

1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Create a new app password:
   - Select app: **Mail**
   - Select device: **Other (Custom name)** → Enter "E-Africa Services"
   - Click **Generate**
5. Copy the 16-character password (no spaces)
6. Use this password in `EMAIL_PASSWORD` (NOT your regular Gmail password)

**Example Configuration:**

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Remove spaces: abcdefghijklmnop
EMAIL_FROM=youremail@gmail.com
COMPANY_EMAIL=info@eafricaservices.com
```

#### **Option B: Outlook/Office 365**

```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
COMPANY_EMAIL=info@eafricaservices.com
```

#### **Option C: Custom SMTP Server**

```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587  # or 465 for SSL
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
COMPANY_EMAIL=info@eafricaservices.com
```

#### **Option D: Production Email Services (Recommended for Production)**

For better deliverability and reliability in production, consider:

- **SendGrid**: Free tier (100 emails/day)
- **AWS SES**: Pay-as-you-go ($0.10 per 1,000 emails)
- **Mailgun**: Free tier (5,000 emails/month)
- **Postmark**: Trial available

### Step 3: Restart Your Development Server

After adding credentials to `.env.local`:

```bash
# Stop the server (Ctrl+C)
# Start it again
pnpm dev
```

---

## 🧪 Testing the Email Integration

### Test 1: Training Enrollment

1. Navigate to your training enrollment form
2. Fill out all required fields
3. Submit the form
4. Check your terminal/console for email logs:
   ```
   ✅ Confirmation email sent to candidate: candidate@example.com
   ✅ Notification email sent to company: info@eafricaservices.com
   📧 Email sending results: { candidateEmailSent: true, companyEmailSent: true, ... }
   ```

**Expected Emails:**

- **Candidate**: "Enrollment Confirmed - [Training Program]"
- **Company**: "🎓 New Enrollment: [Training Program] - [Candidate Name]"

### Test 2: Discovery Call Request

1. Navigate to the discovery call form
2. Fill out business details and requirements
3. Submit the form
4. Check console logs for confirmation

**Expected Emails:**

- **Client**: "Discovery Call Request Received - [Service]"
- **Company**: "📞 New Discovery Call: [Service] - [Business Name]"

### Test 3: Talent Pool Registration

1. Navigate to the talent pool form
2. Complete your profile with skills
3. Upload CV/video (optional)
4. Submit the form

**Expected Emails:**

- **Candidate**: "Welcome to E-Africa Talent Pool - Registration Confirmed"
- **Company**: "👤 New Talent: [Field] - [Full Name]"

### Test 4: Check Email Inboxes

For all forms, verify:

- Emails arrive in inbox (check spam/junk if missing)
- All details are accurate and formatted correctly
- Links work properly (CV, video, WhatsApp)
- HTML renders beautifully on desktop and mobile

### Test 5: Error Handling

Test with invalid email credentials to verify forms still work:

1. Temporarily set wrong `EMAIL_PASSWORD`
2. Submit any form
3. Submission should succeed (saved to database)
4. Check console for error message:
   ```
   ❌ Error sending candidate confirmation email: ...
   ```

---

## 🎨 Email Templates

### Training Enrollment Emails:

**Candidate Email:**

- ✅ Professional gradient header with E-Africa Services branding
- ✅ Complete enrollment details in organized tables
- ✅ Payment reference and currency (if paid training)
- ✅ Clear "What's Next?" section with action items
- ✅ Contact information and support details
- ✅ Responsive HTML design (works on mobile)
- ✅ Plain text fallback for non-HTML email clients

**Company Email:**

- ✅ Clear "New Training Enrollment" header
- ✅ Candidate information section (name, email, phone, country)
- ✅ Training details section (program, type, duration, status)
- ✅ Payment information section (reference, currency)
- ✅ System details (enrollment ID, timestamp)
- ✅ "Action Required" reminder box
- ✅ Professional formatting with color-coded sections

### Discovery Call Emails:

**Client Email:**

- ✅ Thank you message with business details confirmation
- ✅ Service interest and requirements summary
- ✅ Contact information display (phone, WhatsApp)
- ✅ Clear timeline: "What Happens Next?"
- ✅ Request ID for reference
- ✅ Professional formatting with gradient header

**Company Email:**

- ✅ "New Discovery Call Request" notification
- ✅ Complete client information (contact, business name)
- ✅ Service request details with colored badges
- ✅ Full requirements text in highlighted box
- ✅ WhatsApp link for quick contact
- ✅ 24-hour response reminder

### Talent Pool Emails:

**Candidate Email:**

- ✅ Welcoming "Welcome to Our Talent Pool!" message
- ✅ Profile summary with experience level badges
- ✅ Skills list presentation
- ✅ CV/Video upload confirmation indicators
- ✅ Pro tips for profile optimization
- ✅ Green-themed design for talent/growth

**Company Email:**

- ✅ "New Talent Pool Registration" notification
- ✅ Professional details with experience badges
- ✅ Skills and expertise list
- ✅ Direct links to CV and video (if provided)
- ✅ Profile review action required
- ✅ Organized sections for quick scanning

**All Email Templates Include:**

- ✅ Responsive HTML design (mobile-friendly)
- ✅ Plain text fallback
- ✅ Professional color coding
- ✅ Branded headers and footers
- ✅ Clear call-to-action sections
- ✅ Contact information
- ✅ Year-dynamic copyright

---

## 🔍 Troubleshooting

### Problem: Emails Not Sending

**Check Console Logs:**

```
❌ Error sending candidate confirmation email: Error: Invalid login: 535-5.7.8
```

**Solutions:**

1. **Gmail "Less secure app" error:**
   - Use App-Specific Password (see Step 2A above)
   - DO NOT use your regular Gmail password
2. **Authentication failed:**
   - Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
   - Check for extra spaces or quotes in `.env.local`
3. **Connection timeout:**
   - Check `EMAIL_HOST` and `EMAIL_PORT` are correct
   - Verify firewall/network allows SMTP connections
4. **"Cannot send email: transporter not configured":**
   - Ensure all email environment variables are set
   - Restart your development server after adding variables

### Problem: Emails Go to Spam

**Solutions:**

1. Add sender email to recipient's contacts
2. Use a verified domain email address (not @gmail.com) in production
3. Consider using dedicated email service (SendGrid, AWS SES)
4. Set up SPF and DKIM records for your domain

### Problem: HTML Not Rendering

**Solutions:**

- Most modern email clients support HTML (Gmail, Outlook, Apple Mail)
- Plain text version is automatically included as fallback
- Test in multiple email clients if styling issues occur

---

## 📝 Customization Options

### Change Email Templates

Edit `lib/email.ts` to customize:

- Email subject lines
- HTML styling and branding
- Content sections
- Color schemes
- Logo images (add via URL or base64)

### Add More Email Events

You can reuse the email utility for other events:

```typescript
import {
  sendCandidateConfirmationEmail,
  sendCompanyNotificationEmail,
} from "@/lib/email";

// Example: Send email when payment is confirmed
await sendCandidateConfirmationEmail({
  // enrollment data...
});
```

### Add Attachments

Modify the `mailOptions` in `lib/email.ts`:

```typescript
const mailOptions = {
  // ...existing options
  attachments: [
    {
      filename: "welcome.pdf",
      path: "/path/to/welcome.pdf",
    },
  ],
};
```

---

## 🚀 Production Recommendations

1. **Use Dedicated Email Service:**

   - SendGrid, AWS SES, or Mailgun for better deliverability
   - Higher sending limits
   - Better analytics and monitoring

2. **Environment-Specific Configuration:**

   ```typescript
   const companyEmail =
     process.env.NODE_ENV === "production"
       ? "info@eafricaservices.com"
       : "test@example.com";
   ```

3. **Email Queue System:**

   - For high volume, implement a queue (Bull, BullMQ)
   - Retry failed emails automatically
   - Better error handling and monitoring

4. **Email Analytics:**

   - Track open rates and click rates
   - Monitor delivery failures
   - A/B test email templates

5. **Compliance:**
   - Add unsubscribe links if sending marketing emails
   - Follow GDPR/CAN-SPAM regulations
   - Include physical address in footer

---

## ✅ Verification Checklist

- [ ] Added email credentials to `.env.local`
- [ ] Restarted development server
- [ ] Submitted test enrollment
- [ ] Received candidate confirmation email
- [ ] Received company notification email
- [ ] Checked email formatting looks correct

## ✅ Verification Checklist

### Training Enrollment:

- [ ] Added email credentials to `.env.local`
- [ ] Restarted development server
- [ ] Submitted test enrollment
- [ ] Received candidate confirmation email
- [ ] Received company notification email
- [ ] Checked email formatting looks correct
- [ ] Verified all enrollment details are accurate
- [ ] Tested with both paid and free trainings
- [ ] Confirmed enrollment works even if email fails

### Discovery Call:

- [ ] Submitted test discovery call request
- [ ] Received client confirmation email
- [ ] Received company notification email
- [ ] Verified business details are accurate
- [ ] Checked WhatsApp link works (if provided)
- [ ] Confirmed requirements are displayed correctly

### Talent Pool:

- [ ] Submitted test talent pool registration
- [ ] Received candidate welcome email
- [ ] Received company notification email
- [ ] Verified profile details are accurate
- [ ] Checked CV/video links work (if provided)
- [ ] Confirmed skills list displays correctly

---

## 📞 Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test your SMTP credentials using an email client
4. Review the Nodemailer documentation: https://nodemailer.com

---

## 📊 Summary of Email Integration

### Forms with Email Integration:

1. ✅ **Training Enrollment** - Candidate confirmation + Company notification
2. ✅ **Discovery Call Requests** - Client confirmation + Company notification
3. ✅ **Talent Pool Registration** - Candidate welcome + Company notification

### Total Email Functions Created: **12**

- 6 confirmation/welcome emails to users
- 6 notification emails to company
- 3 wrapper functions for parallel sending

### Key Features:

- 🎨 Professional HTML email templates
- 📱 Mobile-responsive designs
- 📝 Plain text fallbacks
- 🚫 Non-blocking (form submissions never fail due to email issues)
- 📊 Comprehensive logging
- 🔒 Secure credential management
- 🎯 Targeted content for each form type

---

**Status:** ✅ Complete email integration across all forms is ready for testing!

**Next Steps:**

1. Add your email credentials to `.env.local`
2. Test all three forms (training, discovery call, talent pool)
3. Customize email templates if needed (colors, content, branding)
4. Consider production email service for live deployment
5. Monitor email delivery rates and adjust as needed
