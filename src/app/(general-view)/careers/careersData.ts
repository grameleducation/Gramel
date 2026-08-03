export interface CareerRole {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  compensation: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

export const careerRoles: Record<string, CareerRole> = {
  "sales-executive": {
    slug: "sales-executive",
    title: "Sales Executive",
    department: "Sales & Business Development",
    location: "Abuja, Nigeria",
    employmentType: "Full-time",
    compensation: "Salary + Commission",
    summary:
      "Gramel Education is looking for a driven Sales Executive to grow our base of students pursuing international education. You'll be the face of Gramel to prospective students and partners, presenting our services, running informational webinars, and converting interest into enrolled applicants.",
    responsibilities: [
      "Attend webinars and represent Gramel Education to prospective students and partner institutions",
      "Make presentations on our study abroad services, scholarships, and visa support offerings",
      "Identify and pursue new student leads through outreach, referrals, and events",
      "Guide prospective students through Gramel's service offerings and answer initial questions",
      "Follow up with leads and maintain an accurate record of the sales pipeline",
      "Meet and exceed monthly enrollment and revenue targets",
      "Collaborate with the advisory team to ensure a smooth handoff of converted students",
    ],
    requirements: [
      "1-3 years of experience in sales, business development, or a client-facing role",
      "Strong verbal and written communication skills",
      "Comfortable presenting to groups, both in person and over webinars/video calls",
      "Self-motivated with a track record of meeting targets",
      "Familiarity with the study abroad or education sector is an advantage, not required",
      "Based in or able to work from Abuja, Nigeria",
    ],
    benefits: [
      "Competitive base salary plus uncapped commission",
      "Hands-on training on Gramel's services and study abroad process",
      "Clear path for growth within a fast-growing team",
      "Collaborative, supportive team environment",
    ],
  },
};

export function getAllCareerRoles(): CareerRole[] {
  return Object.values(careerRoles);
}

export function getCareerRole(slug: string): CareerRole | undefined {
  return careerRoles[slug];
}
