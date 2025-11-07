import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface GrantApplicationData {
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
  submittedAt?: Date;
}

const GRANTS_FILE = join(process.cwd(), 'grant-applications.txt');

export function saveGrantApplicationToFile(data: GrantApplicationData): boolean {
  try {
    const timestamp = new Date().toISOString();
    const applicationText = `
=====================================
NEW GRANT APPLICATION - ${timestamp}
=====================================

APPLICANT INFORMATION:
Name: ${data.applicantName}
Email: ${data.email}
Organization: ${data.organization || 'Individual'}

PROJECT DETAILS:
Grant Category: ${data.grantCategory}
Project Title: ${data.projectTitle}
Funding Amount: ${data.fundingAmount}

PROJECT DESCRIPTION:
${data.projectDescription}

TECHNICAL DETAILS:
${data.technicalDetails}

TIMELINE:
${data.timeline}

TEAM EXPERIENCE:
${data.teamExperience}

GITHUB REPOSITORY:
${data.githubRepo || 'Not provided'}

ADDITIONAL INFO:
${data.additionalInfo || 'None provided'}

=====================================

`;

    // Append to file
    if (existsSync(GRANTS_FILE)) {
      const existingContent = readFileSync(GRANTS_FILE, 'utf8');
      writeFileSync(GRANTS_FILE, existingContent + applicationText);
    } else {
      writeFileSync(GRANTS_FILE, `BITCOIN LIBERTY GRANT APPLICATIONS LOG\n${applicationText}`);
    }

    console.log(`✅ Grant application saved to ${GRANTS_FILE}`);
    return true;
  } catch (error) {
    console.error('Error saving grant application to file:', error);
    return false;
  }
}