import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

// Create reusable transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env.local');
    return null;
  }
  
  return nodemailer.createTransport(emailConfig);
};

// Types for enrollment data
interface EnrollmentData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  training_program: string;
  training_type: string;
  training_duration?: string;
  enrollment_status: string;
  payment_reference?: string;
  currency?: string;
  created_at: string;
}

/**
 * Send confirmation email to the candidate
 */
export async function sendCandidateConfirmationEmail(enrollment: EnrollmentData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Cannot send candidate email: transporter not configured');
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    
    // Format training duration for display
    const durationText = enrollment.training_duration 
      ? `Duration: ${enrollment.training_duration}` 
      : '';

    // Payment information (if applicable)
    const paymentInfo = enrollment.payment_reference 
      ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <strong>Payment Reference:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            ${enrollment.payment_reference}
          </td>
        </tr>
        ${enrollment.currency ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <strong>Currency:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            ${enrollment.currency}
          </td>
        </tr>
        ` : ''}
      `
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Training Enrollment Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to E-Africa Services!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Enrollment Confirmed 🎉</h2>
          
          <p>Dear ${enrollment.full_name},</p>
          
          <p>Thank you for enrolling in our training program! We're excited to have you join us on this learning journey.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Enrollment Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Training Program:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${enrollment.training_program}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Training Type:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${enrollment.training_type}
                </td>
              </tr>
              ${enrollment.training_duration ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Duration:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${enrollment.training_duration}
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Status:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                    ${enrollment.enrollment_status}
                  </span>
                </td>
              </tr>
              ${paymentInfo}
              <tr>
                <td style="padding: 10px 0;">
                  <strong>Enrollment ID:</strong>
                </td>
                <td style="padding: 10px 0;">
                  ${enrollment.id}
                </td>
              </tr>
            </table>
          </div>
          
          <h3 style="color: #1f2937; margin-top: 30px;">What's Next?</h3>
          
          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px;">You will receive further instructions via email within 24-48 hours</li>
            <li style="margin-bottom: 10px;">Our team will contact you to schedule your training sessions</li>
            <li style="margin-bottom: 10px;">Please ensure you have the necessary equipment and materials ready</li>
            ${enrollment.payment_reference ? '<li style="margin-bottom: 10px;">Your payment will be verified and you will receive a receipt shortly</li>' : ''}
          </ul>
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Need Help?</strong><br>
              If you have any questions or concerns, please don't hesitate to contact us at 
              <a href="mailto:info@eafricaservices.com" style="color: #3b82f6; text-decoration: none;">info@eafricaservices.com</a>
            </p>
          </div>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The E-Africa Services Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} E-Africa Services. All rights reserved.</p>
          <p style="margin: 5px 0;">
            <a href="https://eafricaservices.com" style="color: #3b82f6; text-decoration: none;">Visit our website</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Welcome to E-Africa Services!

Dear ${enrollment.full_name},

Thank you for enrolling in our training program! We're excited to have you join us on this learning journey.

ENROLLMENT DETAILS:
-------------------
Training Program: ${enrollment.training_program}
Training Type: ${enrollment.training_type}
${durationText}
Status: ${enrollment.enrollment_status}
${enrollment.payment_reference ? `Payment Reference: ${enrollment.payment_reference}` : ''}
${enrollment.currency ? `Currency: ${enrollment.currency}` : ''}
Enrollment ID: ${enrollment.id}

WHAT'S NEXT?
------------
- You will receive further instructions via email within 24-48 hours
- Our team will contact you to schedule your training sessions
- Please ensure you have the necessary equipment and materials ready
${enrollment.payment_reference ? '- Your payment will be verified and you will receive a receipt shortly' : ''}

Need Help?
If you have any questions or concerns, please contact us at info@eafricaservices.com

Best regards,
The E-Africa Services Team

© ${new Date().getFullYear()} E-Africa Services. All rights reserved.
Visit our website: https://eafricaservices.com
    `;

    const mailOptions = {
      from: `"E-Africa Services" <${emailFrom}>`,
      to: enrollment.email,
      subject: `Enrollment Confirmed - ${enrollment.training_program}`,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to candidate: ${enrollment.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending candidate confirmation email:', error);
    return false;
  }
}

/**
 * Send notification email to E-Africa Services team
 */
export async function sendCompanyNotificationEmail(enrollment: EnrollmentData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Cannot send company notification: transporter not configured');
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const companyEmail = process.env.COMPANY_EMAIL || 'info@eafricaservices.com';
    
    // Format enrollment date
    const enrollmentDate = new Date(enrollment.created_at).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Training Enrollment</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎓 New Training Enrollment</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #059669; font-weight: bold; font-size: 16px;">A new candidate has enrolled for training!</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Candidate Information</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Full Name:</td>
                <td style="padding: 8px 0;">${enrollment.full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${enrollment.email}" style="color: #3b82f6; text-decoration: none;">${enrollment.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${enrollment.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Country:</td>
                <td style="padding: 8px 0;">${enrollment.country}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">Training Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Program:</td>
                <td style="padding: 8px 0;">${enrollment.training_program}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Type:</td>
                <td style="padding: 8px 0;">${enrollment.training_type}</td>
              </tr>
              ${enrollment.training_duration ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                <td style="padding: 8px 0;">${enrollment.training_duration}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                    ${enrollment.enrollment_status}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          ${enrollment.payment_reference ? `
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">Payment Information</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Payment Reference:</td>
                <td style="padding: 8px 0; font-family: monospace; color: #92400e;">${enrollment.payment_reference}</td>
              </tr>
              ${enrollment.currency ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Currency:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #92400e;">${enrollment.currency}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          ` : ''}
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; width: 40%;">Enrollment ID:</td>
                <td style="padding: 5px 0; font-family: monospace; font-size: 12px;">${enrollment.id}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Date & Time:</td>
                <td style="padding: 5px 0;">${enrollmentDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>⚡ Action Required:</strong><br>
              Please review this enrollment and reach out to the candidate within 24-48 hours to schedule their training sessions.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">This is an automated notification from your E-Africa Services training enrollment system.</p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
NEW TRAINING ENROLLMENT NOTIFICATION
=====================================

A new candidate has enrolled for training!

CANDIDATE INFORMATION:
---------------------
Full Name: ${enrollment.full_name}
Email: ${enrollment.email}
Phone: ${enrollment.phone}
Country: ${enrollment.country}

TRAINING DETAILS:
----------------
Program: ${enrollment.training_program}
Type: ${enrollment.training_type}
${enrollment.training_duration ? `Duration: ${enrollment.training_duration}` : ''}
Status: ${enrollment.enrollment_status}

${enrollment.payment_reference ? `
PAYMENT INFORMATION:
-------------------
Payment Reference: ${enrollment.payment_reference}
${enrollment.currency ? `Currency: ${enrollment.currency}` : ''}
` : ''}

SYSTEM DETAILS:
--------------
Enrollment ID: ${enrollment.id}
Date & Time: ${enrollmentDate}

ACTION REQUIRED:
---------------
Please review this enrollment and reach out to the candidate within 24-48 hours to schedule their training sessions.

---
This is an automated notification from your E-Africa Services training enrollment system.
    `;

    const mailOptions = {
      from: `"E-Africa Training System" <${emailFrom}>`,
      to: companyEmail,
      subject: `🎓 New Enrollment: ${enrollment.training_program} - ${enrollment.full_name}`,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification email sent to company: ${companyEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending company notification email:', error);
    return false;
  }
}

/**
 * Send both candidate confirmation and company notification emails
 */
export async function sendEnrollmentEmails(enrollment: EnrollmentData): Promise<{
  candidateEmailSent: boolean;
  companyEmailSent: boolean;
}> {
  const [candidateEmailSent, companyEmailSent] = await Promise.all([
    sendCandidateConfirmationEmail(enrollment),
    sendCompanyNotificationEmail(enrollment),
  ]);

  return {
    candidateEmailSent,
    companyEmailSent,
  };
}

// ==================== DISCOVERY CALL EMAILS ====================

interface DiscoveryCallData {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  service: string;
  requirements: string;
  status: string;
  created_at: string;
}

/**
 * Send confirmation email to client who requested discovery call
 */
export async function sendDiscoveryCallConfirmationEmail(discoveryCall: DiscoveryCallData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Cannot send discovery call confirmation: transporter not configured');
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Discovery Call Request Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Your Interest!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Discovery Call Request Received 📞</h2>
          
          <p>Dear ${discoveryCall.name},</p>
          
          <p>Thank you for scheduling a discovery call with <strong>E-Africa Services</strong>. We're excited to learn more about your business needs and discuss how we can help you achieve your goals.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Your Request Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Business Name:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${discoveryCall.business_name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Service Interest:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${discoveryCall.service}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Contact Email:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${discoveryCall.email}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>Contact Phone:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${discoveryCall.phone}
                </td>
              </tr>
              ${discoveryCall.whatsapp ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>WhatsApp:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  ${discoveryCall.whatsapp}
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0;">
                  <strong>Request ID:</strong>
                </td>
                <td style="padding: 10px 0; font-family: monospace; font-size: 12px;">
                  ${discoveryCall.id}
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>📋 Your Requirements:</strong><br>
              ${discoveryCall.requirements}
            </p>
          </div>
          
          <h3 style="color: #1f2937; margin-top: 30px;">What Happens Next?</h3>
          
          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px;">Our team will review your requirements within 24 hours</li>
            <li style="margin-bottom: 10px;">We'll reach out to schedule a convenient time for your discovery call</li>
            <li style="margin-bottom: 10px;">During the call, we'll discuss your needs in detail and propose solutions</li>
            <li style="margin-bottom: 10px;">You'll receive a customized proposal based on our discussion</li>
          </ul>
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Need Immediate Assistance?</strong><br>
              Feel free to reach out to us directly at 
              <a href="mailto:info@eafricaservices.com" style="color: #3b82f6; text-decoration: none;">info@eafricaservices.com</a>
              ${discoveryCall.whatsapp ? ` or via WhatsApp at ${discoveryCall.whatsapp}` : ''}
            </p>
          </div>
          
          <p style="margin-top: 30px;">
            We look forward to speaking with you soon!<br><br>
            Best regards,<br>
            <strong>The E-Africa Services Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} E-Africa Services. All rights reserved.</p>
          <p style="margin: 5px 0;">
            <a href="https://eafricaservices.com" style="color: #3b82f6; text-decoration: none;">Visit our website</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Thank You for Your Interest!

Dear ${discoveryCall.name},

Thank you for scheduling a discovery call with E-Africa Services. We're excited to learn more about your business needs and discuss how we can help you achieve your goals.

YOUR REQUEST DETAILS:
--------------------
Business Name: ${discoveryCall.business_name}
Service Interest: ${discoveryCall.service}
Contact Email: ${discoveryCall.email}
Contact Phone: ${discoveryCall.phone}
${discoveryCall.whatsapp ? `WhatsApp: ${discoveryCall.whatsapp}` : ''}
Request ID: ${discoveryCall.id}

YOUR REQUIREMENTS:
${discoveryCall.requirements}

WHAT HAPPENS NEXT?
------------------
- Our team will review your requirements within 24 hours
- We'll reach out to schedule a convenient time for your discovery call
- During the call, we'll discuss your needs in detail and propose solutions
- You'll receive a customized proposal based on our discussion

Need Immediate Assistance?
Feel free to reach out to us directly at info@eafricaservices.com${discoveryCall.whatsapp ? ` or via WhatsApp at ${discoveryCall.whatsapp}` : ''}

We look forward to speaking with you soon!

Best regards,
The E-Africa Services Team

© ${new Date().getFullYear()} E-Africa Services. All rights reserved.
Visit our website: https://eafricaservices.com
    `;

    const mailOptions = {
      from: `"E-Africa Services" <${emailFrom}>`,
      to: discoveryCall.email,
      subject: `Discovery Call Request Received - ${discoveryCall.service}`,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Discovery call confirmation sent to: ${discoveryCall.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending discovery call confirmation:', error);
    return false;
  }
}

/**
 * Send notification email to company about new discovery call request
 */
export async function sendDiscoveryCallNotificationEmail(discoveryCall: DiscoveryCallData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Cannot send discovery call notification: transporter not configured');
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const companyEmail = process.env.COMPANY_EMAIL || 'info@eafricaservices.com';
    
    const requestDate = new Date(discoveryCall.created_at).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Discovery Call Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📞 New Discovery Call Request</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #059669; font-weight: bold; font-size: 16px;">A new client has requested a discovery call!</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Client Information</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Contact Name:</td>
                <td style="padding: 8px 0;">${discoveryCall.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Business Name:</td>
                <td style="padding: 8px 0;">${discoveryCall.business_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${discoveryCall.email}" style="color: #3b82f6; text-decoration: none;">${discoveryCall.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${discoveryCall.phone}</td>
              </tr>
              ${discoveryCall.whatsapp ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">WhatsApp:</td>
                <td style="padding: 8px 0;">
                  <a href="https://wa.me/${discoveryCall.whatsapp.replace(/[^0-9]/g, '')}" style="color: #25d366; text-decoration: none;">${discoveryCall.whatsapp}</a>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">Service Request</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Service Interest:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                    ${discoveryCall.service}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                    ${discoveryCall.status}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">Client Requirements</h3>
            <p style="margin: 0; color: #92400e; white-space: pre-wrap;">${discoveryCall.requirements}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; width: 40%;">Request ID:</td>
                <td style="padding: 5px 0; font-family: monospace; font-size: 12px;">${discoveryCall.id}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Date & Time:</td>
                <td style="padding: 5px 0;">${requestDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>⚡ Action Required:</strong><br>
              Please review this discovery call request and reach out to the client within 24 hours to schedule a call. Make sure to prepare based on their specific requirements.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">This is an automated notification from your E-Africa Services discovery call system.</p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
NEW DISCOVERY CALL REQUEST
==========================

A new client has requested a discovery call!

CLIENT INFORMATION:
------------------
Contact Name: ${discoveryCall.name}
Business Name: ${discoveryCall.business_name}
Email: ${discoveryCall.email}
Phone: ${discoveryCall.phone}
${discoveryCall.whatsapp ? `WhatsApp: ${discoveryCall.whatsapp}` : ''}

SERVICE REQUEST:
---------------
Service Interest: ${discoveryCall.service}
Status: ${discoveryCall.status}

CLIENT REQUIREMENTS:
-------------------
${discoveryCall.requirements}

SYSTEM DETAILS:
--------------
Request ID: ${discoveryCall.id}
Date & Time: ${requestDate}

ACTION REQUIRED:
---------------
Please review this discovery call request and reach out to the client within 24 hours to schedule a call. Make sure to prepare based on their specific requirements.

---
This is an automated notification from your E-Africa Services discovery call system.
    `;

    const mailOptions = {
      from: `"E-Africa Discovery System" <${emailFrom}>`,
      to: companyEmail,
      subject: `📞 New Discovery Call: ${discoveryCall.service} - ${discoveryCall.business_name}`,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Discovery call notification sent to company: ${companyEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending discovery call notification:', error);
    return false;
  }
}

/**
 * Send both client confirmation and company notification for discovery call
 */
export async function sendDiscoveryCallEmails(discoveryCall: DiscoveryCallData): Promise<{
  clientEmailSent: boolean;
  companyEmailSent: boolean;
}> {
  const [clientEmailSent, companyEmailSent] = await Promise.all([
    sendDiscoveryCallConfirmationEmail(discoveryCall),
    sendDiscoveryCallNotificationEmail(discoveryCall),
  ]);

  return {
    clientEmailSent,
    companyEmailSent,
  };
}

// ==================== TALENT POOL EMAILS ====================

interface TalentPoolData {
  id: string;
  full_name: string;
  email: string;
  country: string;
  field_of_experience: string;
  experience_level: string;
  skills: string[];
  cv_url?: string;
  video_url?: string;
  profile_status: string;
  created_at: string;
}

/**
 * Send confirmation email to candidate joining talent pool
 */
export async function sendTalentPoolConfirmationEmail(profile: TalentPoolData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Cannot send talent pool confirmation: transporter not configured');
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    
    const skillsList = profile.skills && profile.skills.length > 0 
      ? profile.skills.map(skill => `<li style="margin-bottom: 5px;">${skill}</li>`).join('')
      : '<li>Not specified</li>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to E-Africa Talent Pool</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Talent Pool! 🎉</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Registration Successful ✨</h2>
          
          <p>Dear ${profile.full_name},</p>
          
          <p>Thank you for joining the <strong>E-Africa Services Talent Pool</strong>! We're thrilled to have you as part of our network of talented professionals across Africa.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">Your Profile Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <strong>Full Name:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  ${profile.full_name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <strong>Country:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  ${profile.country}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <strong>Field of Experience:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  ${profile.field_of_experience}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <strong>Experience Level:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                    ${profile.experience_level}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <strong>Profile Status:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                    ${profile.profile_status}
                  </span>
                </td>
              </tr>
              ${profile.cv_url ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <strong>CV Uploaded:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  ✅ Yes
                </td>
              </tr>
              ` : ''}
              ${profile.video_url ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  <strong>Video Intro:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #d1fae5;">
                  ✅ Yes
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0;">
                  <strong>Profile ID:</strong>
                </td>
                <td style="padding: 10px 0; font-family: monospace; font-size: 12px;">
                  ${profile.id}
                </td>
              </tr>
            </table>
          </div>
          
          ${profile.skills && profile.skills.length > 0 ? `
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 10px;">Your Skills</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
              ${skillsList}
            </ul>
          </div>
          ` : ''}
          
          <h3 style="color: #1f2937; margin-top: 30px;">What Happens Next?</h3>
          
          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px;">Our team will review your profile within 48 hours</li>
            <li style="margin-bottom: 10px;">You'll be notified when matching opportunities become available</li>
            <li style="margin-bottom: 10px;">Keep your profile updated to increase your chances of being selected</li>
            <li style="margin-bottom: 10px;">We may reach out for additional information or interviews</li>
          </ul>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>💡 Pro Tip:</strong><br>
              ${profile.cv_url ? 'Great job uploading your CV!' : 'Consider uploading your CV to improve your profile visibility.'}
              ${profile.video_url ? ' Your video introduction makes your profile stand out!' : ' Adding a video introduction can help you stand out to potential clients.'}
            </p>
          </div>
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Questions?</strong><br>
              Contact us at <a href="mailto:info@eafricaservices.com" style="color: #3b82f6; text-decoration: none;">info@eafricaservices.com</a>
            </p>
          </div>
          
          <p style="margin-top: 30px;">
            We're excited to connect you with amazing opportunities!<br><br>
            Best regards,<br>
            <strong>The E-Africa Services Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} E-Africa Services. All rights reserved.</p>
          <p style="margin: 5px 0;">
            <a href="https://eafricaservices.com" style="color: #3b82f6; text-decoration: none;">Visit our website</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Welcome to Our Talent Pool!

Dear ${profile.full_name},

Thank you for joining the E-Africa Services Talent Pool! We're thrilled to have you as part of our network of talented professionals across Africa.

YOUR PROFILE DETAILS:
--------------------
Full Name: ${profile.full_name}
Country: ${profile.country}
Field of Experience: ${profile.field_of_experience}
Experience Level: ${profile.experience_level}
Profile Status: ${profile.profile_status}
${profile.cv_url ? 'CV Uploaded: ✅ Yes' : ''}
${profile.video_url ? 'Video Intro: ✅ Yes' : ''}
Profile ID: ${profile.id}

${profile.skills && profile.skills.length > 0 ? `YOUR SKILLS:
${profile.skills.map(skill => `- ${skill}`).join('\n')}
` : ''}

WHAT HAPPENS NEXT?
------------------
- Our team will review your profile within 48 hours
- You'll be notified when matching opportunities become available
- Keep your profile updated to increase your chances of being selected
- We may reach out for additional information or interviews

PRO TIP:
${profile.cv_url ? 'Great job uploading your CV!' : 'Consider uploading your CV to improve your profile visibility.'}
${profile.video_url ? 'Your video introduction makes your profile stand out!' : 'Adding a video introduction can help you stand out to potential clients.'}

Questions?
Contact us at info@eafricaservices.com

We're excited to connect you with amazing opportunities!

Best regards,
The E-Africa Services Team

© ${new Date().getFullYear()} E-Africa Services. All rights reserved.
Visit our website: https://eafricaservices.com
    `;

    const mailOptions = {
      from: `"E-Africa Talent Pool" <${emailFrom}>`,
      to: profile.email,
      subject: 'Welcome to E-Africa Talent Pool - Registration Confirmed',
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Talent pool confirmation sent to: ${profile.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending talent pool confirmation:', error);
    return false;
  }
}

/**
 * Send notification email to company about new talent pool registration
 */
export async function sendTalentPoolNotificationEmail(profile: TalentPoolData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('Cannot send talent pool notification: transporter not configured');
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const companyEmail = process.env.COMPANY_EMAIL || 'info@eafricaservices.com';
    
    const registrationDate = new Date(profile.created_at).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const skillsList = profile.skills && profile.skills.length > 0 
      ? profile.skills.map(skill => `<li style="margin-bottom: 5px;">${skill}</li>`).join('')
      : '<li>No skills specified</li>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Talent Pool Registration</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">👤 New Talent Pool Registration</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #059669; font-weight: bold; font-size: 16px;">A new professional has joined the talent pool!</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">Candidate Information</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Full Name:</td>
                <td style="padding: 8px 0;">${profile.full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${profile.email}" style="color: #10b981; text-decoration: none;">${profile.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Country:</td>
                <td style="padding: 8px 0;">${profile.country}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Professional Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Field of Experience:</td>
                <td style="padding: 8px 0;">${profile.field_of_experience}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Experience Level:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                    ${profile.experience_level}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Profile Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
                    ${profile.profile_status}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">Skills & Expertise</h3>
            <ul style="margin: 0; padding-left: 20px; color: #92400e;">
              ${skillsList}
            </ul>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Attachments & Links</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">CV/Resume:</td>
                <td style="padding: 8px 0;">
                  ${profile.cv_url ? `<a href="${profile.cv_url}" style="color: #3b82f6; text-decoration: none;">View CV ↗</a>` : '❌ Not provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Video Introduction:</td>
                <td style="padding: 8px 0;">
                  ${profile.video_url ? `<a href="${profile.video_url}" style="color: #3b82f6; text-decoration: none;">Watch Video ↗</a>` : '❌ Not provided'}
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e5e7eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-weight: bold; width: 40%;">Profile ID:</td>
                <td style="padding: 5px 0; font-family: monospace; font-size: 12px;">${profile.id}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: bold;">Registration Date:</td>
                <td style="padding: 5px 0;">${registrationDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>⚡ Action Required:</strong><br>
              Please review this profile and update the status accordingly. Consider reaching out for verification or to discuss potential opportunities.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">This is an automated notification from your E-Africa Services talent pool system.</p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
NEW TALENT POOL REGISTRATION
============================

A new professional has joined the talent pool!

CANDIDATE INFORMATION:
---------------------
Full Name: ${profile.full_name}
Email: ${profile.email}
Country: ${profile.country}

PROFESSIONAL DETAILS:
--------------------
Field of Experience: ${profile.field_of_experience}
Experience Level: ${profile.experience_level}
Profile Status: ${profile.profile_status}

SKILLS & EXPERTISE:
------------------
${profile.skills && profile.skills.length > 0 ? profile.skills.map(skill => `- ${skill}`).join('\n') : '- No skills specified'}

ATTACHMENTS & LINKS:
-------------------
CV/Resume: ${profile.cv_url || '❌ Not provided'}
Video Introduction: ${profile.video_url || '❌ Not provided'}

SYSTEM DETAILS:
--------------
Profile ID: ${profile.id}
Registration Date: ${registrationDate}

ACTION REQUIRED:
---------------
Please review this profile and update the status accordingly. Consider reaching out for verification or to discuss potential opportunities.

---
This is an automated notification from your E-Africa Services talent pool system.
    `;

    const mailOptions = {
      from: `"E-Africa Talent System" <${emailFrom}>`,
      to: companyEmail,
      subject: `👤 New Talent: ${profile.field_of_experience} - ${profile.full_name}`,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Talent pool notification sent to company: ${companyEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending talent pool notification:', error);
    return false;
  }
}

/**
 * Send both candidate confirmation and company notification for talent pool
 */
export async function sendTalentPoolEmails(profile: TalentPoolData): Promise<{
  candidateEmailSent: boolean;
  companyEmailSent: boolean;
}> {
  const [candidateEmailSent, companyEmailSent] = await Promise.all([
    sendTalentPoolConfirmationEmail(profile),
    sendTalentPoolNotificationEmail(profile),
  ]);

  return {
    candidateEmailSent,
    companyEmailSent,
  };
}
