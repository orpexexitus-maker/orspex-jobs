// scripts/seed-jobs.ts
import { PrismaClient, Role, Currency, JobPriority } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Realistic Data Pools ────────────────────────────────────────────────
const COMPANIES = [
  { name: 'Stripe', industry: 'Fintech', size: '1000-5000', domain: 'stripe.com' },
  { name: 'Vercel', industry: 'Cloud Infrastructure', size: '200-500', domain: 'vercel.com' },
  { name: 'Linear', industry: 'Software', size: '50-200', domain: 'linear.app' },
  { name: 'Notion', industry: 'Productivity', size: '500-1000', domain: 'notion.so' },
  { name: 'Figma', industry: 'Design Tools', size: '1000-5000', domain: 'figma.com' },
  { name: 'Supabase', industry: 'Developer Tools', size: '50-200', domain: 'supabase.com' },
  { name: 'OpenAI', industry: 'Artificial Intelligence', size: '500-1000', domain: 'openai.com' },
  { name: 'Shopify', industry: 'E-commerce', size: '5000+', domain: 'shopify.com' },
  { name: 'Spotify', industry: 'Music Streaming', size: '5000+', domain: 'spotify.com' },
  { name: 'Airbnb', industry: 'Travel', size: '5000+', domain: 'airbnb.com' },
  { name: 'Anthropic', industry: 'Artificial Intelligence', size: '200-500', domain: 'anthropic.com' },
  { name: 'GitHub', industry: 'Developer Tools', size: '1000-5000', domain: 'github.com' },
];

const JOBS_BY_ROLE: Record<string, { title: string; skills: string[] }[]> = {
  engineering: [
    { title: 'Senior Frontend Engineer', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'] },
    { title: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'Redis', 'AWS'] },
    { title: 'Full Stack Developer', skills: ['React', 'Node.js', 'MongoDB', 'Docker'] },
    { title: 'DevOps Engineer', skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'] },
    { title: 'Mobile Developer', skills: ['React Native', 'Swift', 'Kotlin', 'Firebase'] },
    { title: 'Machine Learning Engineer', skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps'] },
    { title: 'QA Engineer', skills: ['Playwright', 'Jest', 'Cypress', 'Selenium'] },
  ],
  product: [
    { title: 'Product Manager', skills: ['Roadmapping', 'Analytics', 'User Research', 'Agile'] },
    { title: 'Technical Product Manager', skills: ['API Design', 'SQL', 'System Design', 'Jira'] },
    { title: 'Product Designer', skills: ['Figma', 'Prototyping', 'User Testing', 'Design Systems'] },
  ],
  business: [
    { title: 'Marketing Manager', skills: ['SEO', 'Content Strategy', 'Paid Ads', 'Analytics'] },
    { title: 'Sales Executive', skills: ['B2B Sales', 'CRM', 'Negotiation', 'Cold Outreach'] },
    { title: 'Customer Success Manager', skills: ['Onboarding', 'Retention', 'Support', 'CRM'] },
    { title: 'Technical Writer', skills: ['Documentation', 'Markdown', 'API Docs', 'Editing'] },
  ],
};

const LOCATIONS = [
  { country: 'United States', city: 'San Francisco', location: 'San Francisco, CA' },
  { country: 'United States', city: 'New York', location: 'New York, NY' },
  { country: 'United States', city: 'Austin', location: 'Austin, TX' },
  { country: 'United States', city: 'Seattle', location: 'Seattle, WA' },
  { country: 'United Kingdom', city: 'London', location: 'London, UK' },
  { country: 'Germany', city: 'Berlin', location: 'Berlin, Germany' },
  { country: 'Canada', city: 'Toronto', location: 'Toronto, Canada' },
  { country: 'United Arab Emirates', city: 'Dubai', location: 'Dubai, UAE' },
  { country: 'Singapore', city: 'Singapore', location: 'Singapore' },
  { country: 'Remote', city: 'Remote', location: 'Remote' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────
function generateDescription(title: string, company: string) {
  return `About ${company}
We are a fast-growing company looking for a talented ${title} to join our team. We value innovation, collaboration, and delivering high-quality work.

Role Overview
As a ${title}, you will be responsible for building and maintaining critical features, collaborating with cross-functional teams, and helping shape the future of our product.

Responsibilities
- Design, develop, and deploy high-quality work.
- Collaborate with product managers and designers.
- Participate in reviews and mentor junior team members.
- Troubleshoot and debug issues in production.

Requirements
- 3+ years of experience in a similar role.
- Strong communication skills and a team-player mindset.
- Experience with modern tools and frameworks.
- Bachelor's degree or equivalent experience.

Benefits
- Competitive salary and equity.
- Health, dental, and vision insurance.
- Flexible work hours and remote work options.
- Unlimited paid time off.`;
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Main Seed Function ──────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...\n');

  // 1. Shared password for all demo accounts
  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

  // 2. Create demo Employer users + their Companies
  const createdCompanies: { id: string; name: string }[] = [];

  for (const companyData of COMPANIES) {
    const slug = slugify(companyData.name);
    const email = `demo+${slug}@orspexjobs.com`;

    // Create employer user
    const employer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: `${companyData.name} Recruiter`,
        passwordHash,
        role: Role.EMPLOYER,
        country: 'United States',
        city: 'San Francisco',
      },
    });

    // Create company linked to employer
    const company = await prisma.company.upsert({
      where: { ownerId: employer.id },
      update: {},
      create: {
        name: companyData.name,
        country: 'United States',
        city: 'San Francisco',
        website: `https://${companyData.domain}`,
        industry: companyData.industry,
        size: companyData.size,
        emailDomain: companyData.domain,
        emailVerified: true,
        docVerified: true,
        verified: true,
        ownerId: employer.id,
      },
    });

    createdCompanies.push({ id: company.id, name: company.name });
    console.log(`✅ Company created: ${company.name}`);
  }

  console.log(`\n📦 Created ${createdCompanies.length} companies.\n`);

  // 3. Flatten all job templates
  const allJobTemplates = Object.values(JOBS_BY_ROLE).flat();

  // 4. Create jobs (3-5 jobs per company)
  let totalJobs = 0;

  for (const company of createdCompanies) {
    const numJobs = faker.number.int({ min: 3, max: 5 });
    const selectedTemplates = faker.helpers.arrayElements(allJobTemplates, numJobs);

    // Find the employer user for this company
    const companyRecord = await prisma.company.findUnique({
      where: { id: company.id },
      select: { ownerId: true },
    });

    if (!companyRecord) continue;

    for (const template of selectedTemplates) {
      const loc = faker.helpers.arrayElement(LOCATIONS);
      const salaryMin = faker.number.int({ min: 60000, max: 130000 });
      const salaryMax = salaryMin + faker.number.int({ min: 20000, max: 70000 });
      const priority = faker.helpers.arrayElement([
        JobPriority.ROUTINE,
        JobPriority.ROUTINE,
        JobPriority.ROUTINE,
        JobPriority.IMPORTANT,
        JobPriority.URGENT,
      ]);

      await prisma.job.create({
        data: {
          title: template.title,
          description: generateDescription(template.title, company.name),
          country: loc.country,
          city: loc.city,
          location: loc.location,
          salaryMin,
          salaryMax,
          salaryCurrency: Currency.USD,
          priority,
          isActive: true,
          employerId: companyRecord.ownerId,
          companyId: company.id,
          createdAt: faker.date.recent({ days: 45 }),
        },
      });

      totalJobs++;
    }
  }

  console.log(`🎉 Successfully seeded ${totalJobs} jobs across ${createdCompanies.length} companies!`);
  console.log(`\n🔑 Demo employer login: demo+stripe@orspexjobs.com / DemoPassword123!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });