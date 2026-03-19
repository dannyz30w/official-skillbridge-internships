import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend('re_Mewqvc6q_Cs39xCr23udLF4EpQ47tgVjC');

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend API
 * @param options Email options including recipient, subject, and HTML content
 * @returns Promise with email result
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: options.from || 'skillbridgeinternships@gmail.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (result.error) {
      console.error('Resend email error:', result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }

    console.log('Email sent successfully:', result.data?.id);
    return result.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new intern
 */
export async function sendInternWelcomeEmail(email: string, firstName: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5; font-size: 28px; margin-bottom: 16px;">Welcome to SkillBridge, ${firstName}!</h1>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        We're excited to have you on board. SkillBridge connects motivated young adults like you with real, paid internship opportunities from verified businesses.
      </p>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        <strong>What's next?</strong>
      </p>
      <ul style="color: #1C1C1E; font-size: 16px; line-height: 1.8; margin-bottom: 16px;">
        <li>Complete your profile with your skills and interests</li>
        <li>Browse available internships in your area</li>
        <li>Apply to opportunities that excite you</li>
        <li>Connect with businesses and start your career</li>
      </ul>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        If you have any questions, reach out to us at <a href="mailto:skillbridgeinternships@gmail.com" style="color: #4F46E5; text-decoration: none;">skillbridgeinternships@gmail.com</a>
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
        © 2026 SkillBridge. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to SkillBridge, ${firstName}!`,
    html,
  });
}

/**
 * Send welcome email to new business
 */
export async function sendBusinessWelcomeEmail(email: string, businessName: string) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5; font-size: 28px; margin-bottom: 16px;">Welcome to SkillBridge, ${businessName}!</h1>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Thank you for joining SkillBridge. We're thrilled to help you connect with talented young professionals ready to make an impact.
      </p>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        <strong>Get started:</strong>
      </p>
      <ul style="color: #1C1C1E; font-size: 16px; line-height: 1.8; margin-bottom: 16px;">
        <li>Post your first paid internship listing</li>
        <li>Review applications from qualified candidates</li>
        <li>Connect with interns and build your team</li>
        <li>Track applications and manage your listings</li>
      </ul>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Our team is here to support you. Contact us at <a href="mailto:skillbridgeinternships@gmail.com" style="color: #4F46E5; text-decoration: none;">skillbridgeinternships@gmail.com</a> with any questions.
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
        © 2026 SkillBridge. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to SkillBridge, ${businessName}!`,
    html,
  });
}

/**
 * Send application notification email to business
 */
export async function sendApplicationNotificationEmail(
  businessEmail: string,
  businessName: string,
  internName: string,
  listingTitle: string
) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5; font-size: 28px; margin-bottom: 16px;">New Application for ${listingTitle}</h1>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Hi ${businessName},
      </p>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        <strong>${internName}</strong> has applied for your <strong>${listingTitle}</strong> internship position.
      </p>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Log in to your SkillBridge dashboard to review their profile and application.
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
        © 2026 SkillBridge. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail({
    to: businessEmail,
    subject: `New Application: ${internName} applied for ${listingTitle}`,
    html,
  });
}

/**
 * Send application confirmation email to intern
 */
export async function sendApplicationConfirmationEmail(
  internEmail: string,
  internName: string,
  listingTitle: string,
  businessName: string
) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5; font-size: 28px; margin-bottom: 16px;">Application Submitted!</h1>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Hi ${internName},
      </p>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Your application for <strong>${listingTitle}</strong> at <strong>${businessName}</strong> has been submitted successfully!
      </p>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        The business will review your application and reach out if they'd like to move forward. You can track your applications in your SkillBridge dashboard.
      </p>
      <p style="color: #1C1C1E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Good luck! 🎉
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
        © 2026 SkillBridge. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail({
    to: internEmail,
    subject: `Application Submitted: ${listingTitle}`,
    html,
  });
}
