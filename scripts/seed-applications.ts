// scripts/seed-applications.ts
import { PrismaClient, Role, ApplicationStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FIRST_NAMES = ['Ahmed', 'Sarah', 'Mohammed', 'Fatima', 'Ali', 'Layla', 'Omar', 'Noor', 'Hassan', 'Aisha', 'Yusuf', 'Zara', 'Khalid', 'Mariam', 'Tariq', 'Hana'];
const LAST_NAMES = ['Al-Rashid', 'Khan', 'Smith', 'Johnson', 'Patel', 'Hussain', 'Williams', 'Ahmed', 'Brown', 'Ali', 'Garcia', 'Chen', 'Kumar', 'Silva'];

const SKILL_POOL = [
  'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker',
  'Figma', 'Product Management', 'Agile', 'SEO', 'Copywriting',
  'Kubernetes', 'GraphQL', 'Next.js', 'Tailwind', 'MongoDB',
  'Data Analysis', 'Machine Learning', 'Swift', 'Kotlin',
];

const COUNTRIES = [
  { country: 'United Arab Emirates', city: 'Dubai' },
  { country: 'United Arab Emirates', city: 'Abu Dhabi' },
  { country: 'Saudi Arabia', city: 'Riyadh' },
  { country: 'Qatar', city: 'Doha' },
  { country: 'United States', city: 'San Francisco' },
  { country: 'United Kingdom', city: 'London' },
  { country: 'India', city: 'Bangalore' },
  { country: 'Pakistan', city: 'Karachi' },
];

const COVER_NOTES = [
  `I am very excited about this opportunity. With my background in this field, I believe I can contribute meaningfully from day one.`,
  `Your company's mission resonates deeply with my career goals. I would love to bring my experience to your team.`,
  `I've been following your work for a while and I'm impressed by your recent projects. I'd be thrilled to join the team.`,
  `This role aligns perfectly with my skills and career trajectory. I am confident I can add value quickly.`,
  `I bring a strong track record of delivering results and would love to contribute to your continued success.`,
];

async function main() {
  console.log('🌱 Seeding seekers and applications...\n');

  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

  // 1. Fetch all jobs
  const jobs = await prisma.job.findMany({
    select: { id: true, employerId: true },
  });

  if (jobs.length === 0) {
    console.error('❌ No jobs found. Run seed-jobs.ts first.');
    process.exit(1);
  }

  // 2. Create 20 demo seekers
  const createdSeekers: string[] = [];

  for (let i = 0; i < 20; i++) {
    const firstName = faker.helpers.arrayElement(FIRST_NAMES);
    const lastName = faker.helpers.arrayElement(LAST_NAMES);
    const loc = faker.helpers.arrayElement(COUNTRIES);
    const email = `demo+seeker${i + 1}@orspexjobs.com`;

    const seeker = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: `${firstName} ${lastName}`,
        passwordHash,
        role: Role.SEEKER,
        country: loc.country,
        city: loc.city,
        phone: faker.phone.number(),
        bio: faker.lorem.sentences(2),
        skills: faker.helpers.arrayElements(SKILL_POOL, { min: 3, max: 7 }),
        experience: faker.number.int({ min: 1, max: 15 }),
        education: faker.helpers.arrayElement([
          'BSc Computer Science',
          'MSc Software Engineering',
          'BBA Business Administration',
          'MBA',
          'BSc Information Technology',
        ]),
      },
    });

    createdSeekers.push(seeker.id);
  }

  console.log(`✅ Created ${createdSeekers.length} seeker accounts.\n`);

  // 3. Create applications (each seeker applies to 2-6 random jobs)
  let totalApplications = 0;
  const statuses: ApplicationStatus[] = [
    ApplicationStatus.APPLIED,
    ApplicationStatus.APPLIED,
    ApplicationStatus.APPLIED,
    ApplicationStatus.REVIEWING,
    ApplicationStatus.REVIEWING,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.HIRED,
    ApplicationStatus.REJECTED,
  ];

  for (const seekerId of createdSeekers) {
    const numApps = faker.number.int({ min: 2, max: 6 });
    const selectedJobs = faker.helpers.arrayElements(jobs, numApps);

    for (const job of selectedJobs) {
      try {
        await prisma.application.create({
          data: {
            jobId: job.id,
            seekerId,
            status: faker.helpers.arrayElement(statuses),
            coverNote: faker.helpers.arrayElement(COVER_NOTES),
            createdAt: faker.date.recent({ days: 30 }),
          },
        });
        totalApplications++;
      } catch {
        // Skip duplicate (jobId, seekerId) unique constraint violations
      }
    }
  }

  console.log(`🎉 Created ${totalApplications} applications!\n`);
  console.log('━'.repeat(60));
  console.log('🔑 Demo accounts (password: DemoPassword123!)');
  console.log('━'.repeat(60));
  console.log('👔 Employer: demo+stripe@orspexjobs.com');
  console.log('👤 Seeker:   demo+seeker1@orspexjobs.com');
  console.log('━'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });