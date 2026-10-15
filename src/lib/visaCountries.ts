// src/lib/visaCountries.ts
export type VisaCountry = {
  slug: string;          // matches Job.country exactly
  name: string;
  flag: string;
  tagline: string;
  description: string;
  visaTypes: string[];
  avgSalary: string;
  tips: string[];
};

export const VISA_COUNTRIES: VisaCountry[] = [
  {
    slug: "UAE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    tagline: "Tax-free salaries, fast hiring, and easy work visas.",
    description:
      "The UAE offers tax-free income, a booming job market, and one of the fastest work visa processes in the world. Employers routinely sponsor visas and often include accommodation and relocation support.",
    visaTypes: [
      "Employment Visa (employer-sponsored)",
      "Golden Visa (10-year, for skilled professionals)",
      "Green Visa (5-year, self-sponsored)",
      "Freelance / Remote Work Visa",
    ],
    avgSalary: "AED 15,000 – 35,000 / month",
    tips: [
      "Ask about visa sponsorship in the first interview",
      "Most packages include accommodation or housing allowance",
      "Attested degree certificates are usually required",
      "Health insurance is mandatory and usually employer-paid",
    ],
  },
  {
    slug: "Canada",
    name: "Canada",
    flag: "🇨🇦",
    tagline: "LMIA-backed jobs, PR pathways, and high quality of life.",
    description:
      "Canada actively recruits skilled foreign workers through Express Entry, Provincial Nominee Programs, and LMIA-backed job offers. Employers with LMIA approval can hire you directly and support your permanent residency.",
    visaTypes: [
      "LMIA-backed Work Permit",
      "Express Entry (Federal Skilled Worker)",
      "Provincial Nominee Program (PNP)",
      "Global Talent Stream (fast-track, 2 weeks)",
    ],
    avgSalary: "CAD 60,000 – 110,000 / year",
    tips: [
      "Look for 'LMIA approved' in the job listing",
      "IELTS or CELPIP language test boosts your score",
      "Global Talent Stream = fastest visa (2–4 weeks)",
      "PR is possible after 1 year of skilled work",
    ],
  },
  {
    slug: "Germany",
    name: "Germany",
    flag: "🇩🇪",
    tagline: "EU Blue Card, engineering demand, and free language classes.",
    description:
      "Germany's EU Blue Card is one of Europe's best work visas — fast processing, family reunification, and a direct path to permanent residency. Engineering, IT, and healthcare are in highest demand.",
    visaTypes: [
      "EU Blue Card (for degree-holders, salary threshold)",
      "Skilled Worker Visa (§18b AufenthG)",
      "Opportunity Card (job-seeker visa, 1 year)",
      "IT Specialist Visa (no degree required)",
    ],
    avgSalary: "€50,000 – €85,000 / year",
    tips: [
      "EU Blue Card requires a university degree + job offer",
      "Salary threshold for 2025: ~€48,300 (general), ~€43,760 (shortage)",
      "German language (B1+) is a big plus but not required for IT",
      "PR after 21–33 months on Blue Card",
    ],
  },
  {
    slug: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    tagline: "Skilled Worker visa, tech hubs, and English-speaking.",
    description:
      "The UK Skilled Worker visa is the main route for foreign professionals. If the employer is a licensed sponsor, they can issue a Certificate of Sponsorship and you can bring your family.",
    visaTypes: [
      "Skilled Worker Visa (sponsored)",
      "Global Talent Visa (tech, arts, academia)",
      "Health and Care Worker Visa",
      "Graduate Visa (post-study work)",
    ],
    avgSalary: "£35,000 – £90,000 / year",
    tips: [
      "Only work for a licensed sponsor — check the register",
      "Minimum salary £38,700 (2025, varies by role)",
      "Health & Care Worker visa = lower fees",
      "Can bring spouse and children",
    ],
  },
  {
    slug: "Saudi Arabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    tagline: "Vision 2030 megaprojects, tax-free pay, and relocation.",
    description:
      "Saudi Arabia's Vision 2030 has created massive demand for skilled workers across construction, engineering, healthcare, IT, and hospitality. Salaries are tax-free and packages often include housing.",
    visaTypes: [
      "Employment Visa (employer-sponsored)",
      "Premium Residency (self-sponsored)",
      "Business Visa",
    ],
    avgSalary: "SAR 12,000 – 35,000 / month",
    tips: [
      "Packages typically include housing + transport",
      "Attested degree + experience letters are mandatory",
      "Muslim candidates have a shorter visa process",
      "Big projects: NEOM, Qiddiya, Red Sea, Diriyah",
    ],
  },
  {
    slug: "Qatar",
    name: "Qatar",
    flag: "🇶🇦",
    tagline: "Tax-free, stable contracts, and high savings potential.",
    description:
      "Qatar offers tax-free income, excellent infrastructure, and demand for engineers, healthcare workers, and teachers. Contracts usually include housing, transport, and annual flights home.",
    visaTypes: [
      "Work Residence Permit (employer-sponsored)",
      "Business Visa",
    ],
    avgSalary: "QAR 12,000 – 30,000 / month",
    tips: [
      "Contracts usually include housing + transport",
      "Employers pay for health insurance",
      "Good savings potential — no income tax",
      "English widely spoken at work",
    ],
  },
];

export function getVisaCountry(slug: string): VisaCountry | undefined {
  return VISA_COUNTRIES.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase() ||
           c.name.toLowerCase() === slug.toLowerCase()
  );
}