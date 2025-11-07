import sgMail from '@sendgrid/mail';

// Optional: Only initialize SendGrid if API key is available
const SENDGRID_ENABLED = !!process.env.SENDGRID_API_KEY;

if (SENDGRID_ENABLED && process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('⚠️  SENDGRID_API_KEY not set - email notifications will be disabled');
}

interface GrantApplicationEmailData {
  applicantName: string;
  email: string;
  organization?: string | null;
  grantCategory: string;
  projectTitle: string;
  fundingAmount: string;
  projectDescription: string;
  technicalDetails: string;
  timeline: string;
  teamExperience: string;
  githubRepo?: string | null;
  additionalInfo?: string | null;
}

// Admin notification email (existing function)
export async function sendGrantApplicationEmail(data: GrantApplicationEmailData): Promise<boolean> {
  if (!SENDGRID_ENABLED) {
    console.log('📧 [DEV] Would send grant application email to admin for:', data.projectTitle);
    return false;
  }
  
  try {
    const emailContent = `
New Grant Application Received

Applicant Information:
- Name: ${data.applicantName}
- Email: ${data.email}
- Organization: ${data.organization || 'Individual'}

Project Details:
- Grant Category: ${data.grantCategory}
- Project Title: ${data.projectTitle}
- Funding Amount Requested: ${data.fundingAmount}

Project Description:
${data.projectDescription}

Technical Details:
${data.technicalDetails}

Development Timeline:
${data.timeline}

Team Experience:
${data.teamExperience}

GitHub Repository: ${data.githubRepo || 'Not provided'}

Additional Information:
${data.additionalInfo || 'None provided'}

---
This application was submitted through the Bitcoin Liberty Grant Application Form.
`;

    const msg = {
      to: 'mail@libertychain.org',
      from: 'mail@libertychain.org', // Using verified sender email for both sender and recipient
      subject: `New Grant Application: ${data.projectTitle} - ${data.grantCategory}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Applicant confirmation email when application is submitted
export async function sendApplicantConfirmationEmail(
  applicantEmail: string, 
  projectTitle: string, 
  publicChatToken: string
): Promise<boolean> {
  if (!SENDGRID_ENABLED) {
    console.log('📧 [DEV] Would send confirmation email to:', applicantEmail);
    return false;
  }
  
  try {
    const chatUrl = `${process.env.REPLIT_DOMAINS || 'http://localhost:5000'}/chat/${publicChatToken}`;
    
    const emailContent = `
Thank you for submitting your grant application!

Project: ${projectTitle}

Your application has been received and is being reviewed by our team. We'll get back to you within 2 weeks.

📧 STAY IN TOUCH
You can communicate directly with our grant review team using your personal chat link:
${chatUrl}

Bookmark this link to:
• Check your application status
• Ask questions about the review process  
• Receive updates from our team
• Provide additional information if needed

We're excited about your project and look forward to reviewing your application!

Best regards,
The Bitcoin Liberty Grant Team

---
If you have any immediate questions, please use your chat link above or reply to this email.
`;

    const htmlContent = `
<h2>Thank you for submitting your grant application!</h2>

<p><strong>Project:</strong> ${projectTitle}</p>

<p>Your application has been received and is being reviewed by our team. We'll get back to you within 2 weeks.</p>

<h3>📧 STAY IN TOUCH</h3>
<p>You can communicate directly with our grant review team using your personal chat link:</p>
<p><strong><a href="${chatUrl}" style="color: #f7931a; text-decoration: none;">${chatUrl}</a></strong></p>

<p>Bookmark this link to:</p>
<ul>
  <li>Check your application status</li>
  <li>Ask questions about the review process</li>
  <li>Receive updates from our team</li>
  <li>Provide additional information if needed</li>
</ul>

<p>We're excited about your project and look forward to reviewing your application!</p>

<p>Best regards,<br>
The Bitcoin Liberty Grant Team</p>

<hr>
<p><small>If you have any immediate questions, please use your chat link above or reply to this email.</small></p>
`;

    const msg = {
      to: applicantEmail,
      from: 'mail@libertychain.org',
      subject: `✅ Grant Application Received - ${projectTitle}`,
      text: emailContent,
      html: htmlContent,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid applicant confirmation email error:', error);
    return false;
  }
}

// Applicant notification email when admin sends them a message
export async function sendApplicantMessageNotificationEmail(
  applicantEmail: string,
  projectTitle: string,
  adminMessage: string,
  publicChatToken: string
): Promise<boolean> {
  if (!SENDGRID_ENABLED) {
    console.log('📧 [DEV] Would send message notification to:', applicantEmail);
    return false;
  }
  
  try {
    const chatUrl = `${process.env.REPLIT_DOMAINS || 'http://localhost:5000'}/chat/${publicChatToken}`;
    
    const truncatedMessage = adminMessage.length > 200 
      ? adminMessage.substring(0, 200) + '...'
      : adminMessage;

    const emailContent = `
New message about your grant application!

Project: ${projectTitle}

Message from Bitcoin Liberty Grant Team:
"${truncatedMessage}"

💬 REPLY NOW
Click your personal chat link to view the full message and reply:
${chatUrl}

This is your secure communication channel with our grant review team. Please check it regularly for updates about your application.

Best regards,
The Bitcoin Liberty Grant Team

---
If you cannot access the chat link, please reply to this email.
`;

    const htmlContent = `
<h2>New message about your grant application!</h2>

<p><strong>Project:</strong> ${projectTitle}</p>

<h3>Message from Bitcoin Liberty Grant Team:</h3>
<blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #f7931a; margin: 20px 0;">
"${truncatedMessage}"
</blockquote>

<h3>💬 REPLY NOW</h3>
<p>Click your personal chat link to view the full message and reply:</p>
<p><strong><a href="${chatUrl}" style="color: #f7931a; text-decoration: none; font-size: 16px;">${chatUrl}</a></strong></p>

<p>This is your secure communication channel with our grant review team. Please check it regularly for updates about your application.</p>

<p>Best regards,<br>
The Bitcoin Liberty Grant Team</p>

<hr>
<p><small>If you cannot access the chat link, please reply to this email.</small></p>
`;

    const msg = {
      to: applicantEmail,
      from: 'mail@libertychain.org',
      subject: `💬 New message about your grant application - ${projectTitle}`,
      text: emailContent,
      html: htmlContent,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid applicant message notification email error:', error);
    return false;
  }
}