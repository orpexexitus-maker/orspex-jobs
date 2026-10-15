import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── CONFIG ─────────────────────────────────────────────────────────
const JOBS_PER_COMBO = 3;          // postings per (country × role)
const SEEKERS_COUNT = 60;          // job seekers to create
const APPLICATIONS_PER_SEEKER = 3; // average
const SAVED_PER_SEEKER = 2;        // average

// ─── TARGET MARKETS ─────────────────────────────────────────────────
type Locale = { country: string; cities: string[]; currency: 'USD' | 'AED' | 'GBP' };

const LOCALES: Locale[] = [
  { country: 'Philippines',          cities: ['Manila', 'Cebu', 'Davao'],            currency: 'USD' },
  { country: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],      currency: 'AED' },
  { country: 'United States',        cities: ['New York', 'Los Angeles', 'Houston'], currency: 'USD' },
  { country: 'Singapore',            cities: ['Singapore'],                          currency: 'USD' },
  { country: 'Hong Kong',            cities: ['Hong Kong'],                          currency: 'USD' },
  { country: 'United Kingdom',       cities: ['London', 'Manchester', 'Birmingham'], currency: 'GBP' },
];

// ─── ROLES ──────────────────────────────────────────────────────────
type RoleDef = {
  title: string;
  category: string;
  skills: string[];
  jobTypes: ('FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY')[];
  experience: 'ENTRY' | 'MID' | 'SENIOR';
  description: (city: string, country: string) => string;
};

const ROLES: RoleDef[] = [
  {
    title: 'Teacher',
    category: 'Education',
    skills: ['Curriculum Design', 'Classroom Management', 'Lesson Planning', 'Assessment', 'ESL'],
    jobTypes: ['FULL_TIME', 'CONTRACT'],
    experience: 'MID',
    description: (city, country) =>
      `We are seeking a passionate and qualified Teacher to join our school in ${city}, ${country}. ` +
      `You will plan and deliver engaging lessons, assess student progress, and collaborate with colleagues ` +
      `to create a positive learning environment. Experience with international curricula (IB, British, ` +
      `American) is highly desirable.`,
  },
  {
    title: 'Physical Therapist',
    category: 'Healthcare',
    skills: ['Manual Therapy', 'Rehabilitation', 'Patient Assessment', 'Orthopedics', 'Sports Injury'],
    jobTypes: ['FULL_TIME'],
    experience: 'MID',
    description: (city, country) =>
      `We are hiring a licensed Physical Therapist in ${city}, ${country} to assess, plan, and deliver ` +
      `rehabilitation programs for patients recovering from injury, surgery, or chronic conditions. You will ` +
      `work alongside physicians, nurses, and occupational therapists in a multidisciplinary team.`,
  },
  {
    title: 'Registered Nurse',
    category: 'Healthcare',
    skills: ['Patient Care', 'IV Therapy', 'Medication Administration', 'Triage', 'EMR'],
    jobTypes: ['FULL_TIME', 'PART_TIME'],
    experience: 'MID',
    description: (city, country) =>
      `We are looking for compassionate Registered Nurses to join our hospital team in ${city}, ${country}. ` +
      `Responsibilities include monitoring patients, administering medication, coordinating with physicians, ` +
      `and maintaining accurate medical records. Valid nursing license and BLS/ACLS certification required.`,
  },
  {
    title: 'Caregiver',
    category: 'Healthcare',
    skills: ['Elderly Care', 'Personal Care', 'Companionship', 'Medication Reminders', 'First Aid'],
    jobTypes: ['FULL_TIME', 'PART_TIME', 'TEMPORARY'],
    experience: 'ENTRY',
    description: (city, country) =>
      `We are seeking reliable, empathetic Caregivers in ${city}, ${country} to provide daily support to ` +
      `elderly or disabled clients in their homes or in residential facilities. Duties include personal care, ` +
      `meal preparation, light housekeeping, and companionship. Experience with dementia or palliative care ` +
      `is a plus.`,
  },
];

// Rough monthly salary ranges by country (in that country's currency)
const SALARY_BY_COUNTRY: Record<string, { min: number; max: number }> = {
  'Philippines':          { min: 20000, max: 60000 },
  'United Arab Emirates': { min: 5000,  max: 18000 },
  'United States':        { min: 4000,  max: 9000 },
  'Singapore':            { min: 3000,  max: 7000 },
  'Hong Kong':            { min: 18000, max: 45000 },
  'United Kingdom':       { min: 2200,  max: 4000 },
};

// ─── HELPERS ────────────────────────────────────────────────────────
const passwordHashCache = { value: '' as string };
async function getPasswordHash() {
  if (!passwordHashCache.value) {
    passwordHashCache.value = await bcrypt.hash('Password123!', 10);
  }
  return passwordHashCache.value;
}

function slug(s: string) {
  return faker.helpers.slugify(s).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── MAIN ───────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding targeted jobs + employers + seekers + applications...');
  const passwordHash = await getPasswordHash();

  // ── 1. EMPLOYERS + COMPANIES + JOBS ──────────────────────────────
  const createdJobs: { id: string; country: string; title: string }[] = [];

  for (const loc of LOCALES) {
    const salary = SALARY_BY_COUNTRY[loc.country] ?? { min: 1000, max: 3000 };

    for (const role of ROLES) {
      const employer = await prisma.user.create({
        data: {
          email: `emp-${slug(role.title)}-${slug(loc.country)}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`,
          name: faker.person.fullName(),
          passwordHash,
          role: 'EMPLOYER',
          languages: ['en'],
          certifications: [],
          preferredCountries: [],
          country: loc.country,
          city: loc.cities[0],
        },
      });

      const companyName = `${role.title.replace(/\s+/g, '')} ${loc.country} Group ${faker.string.alphanumeric(4).toUpperCase()}`;

      const company = await prisma.company.create({
        data: {
          name: companyName,
          slug: slug(companyName) + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          country: loc.country,
          city: loc.cities[0],
          ownerId: employer.id,
          industry: role.category,
          size: pick(['11-50', '51-200', '201-500', '500+']),
          website: faker.internet.url(),
          about: faker.company.catchPhrase(),
          verified: true,
          emailVerified: true,
          visaSponsor: true,
          relocationAssist: true,
          remoteFriendly: false,
          fastResponder: faker.datatype.boolean(),
        },
      });

      for (let j = 0; j < JOBS_PER_COMBO; j++) {
        const city = pick(loc.cities);
        const salaryMin = faker.number.int({ min: salary.min, max: Math.floor((salary.min + salary.max) / 2) });
        const salaryMax = faker.number.int({
          min: salaryMin + Math.floor((salary.max - salaryMin) / 4),
          max: salary.max,
        });
        const jobType = pick(role.jobTypes);
        const isHealthcare = role.category === 'Healthcare';

        const job = await prisma.job.create({
          data: {
            title: role.title,
            slug: slug(`${role.title}-${city}-${loc.country}-${j}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`),
            description: role.description(city, loc.country),
            country: loc.country,
            city,
            location: `${city}, ${loc.country}`,
            salaryMin,
            salaryMax,
            salaryCurrency: loc.currency,
            priority: pick(['ROUTINE', 'IMPORTANT', 'URGENT']),
            isActive: true,
            employerId: employer.id,
            companyId: company.id,
            visaSponsorship: isHealthcare || loc.country === 'United Arab Emirates',
            relocationAssist: loc.country !== 'Philippines',
            freeVisa: false,
            accommodation: role.title === 'Caregiver' || role.title === 'Registered Nurse',
            remote: false,
            hybrid: role.title === 'Teacher',
            jobType,
            experienceLevel: role.experience,
            category: role.category,
            skills: role.skills,
            languages: ['en'],
          },
        });

        createdJobs.push({ id: job.id, country: loc.country, title: role.title });
      }

      console.log(`  ✓ ${role.title} — ${loc.country} (${JOBS_PER_COMBO} jobs)`);
    }
  }

  console.log(`\n📦 Created ${createdJobs.length} jobs.`);

  // ── 2. SEEKERS ───────────────────────────────────────────────────
  const seekers: { id: string; country: string }[] = [];

  for (let i = 0; i < SEEKERS_COUNT; i++) {
    const loc = pick(LOCALES);
    const seeker = await prisma.user.create({
      data: {
        email: `seeker${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`,
        name: faker.person.fullName(),
        passwordHash,
        role: 'SEEKER',
        languages: ['en'],
        certifications: [],
        preferredCountries: [loc.country],
        country: loc.country,
        city: pick(loc.cities),
        phone: faker.phone.number(),
        bio: faker.lorem.sentence(),
        skills: faker.helpers.arrayElements(
          ['Patient Care', 'Teaching', 'Rehabilitation', 'First Aid', 'Communication', 'Teamwork', 'English'],
          { min: 2, max: 5 }
        ),
        experience: faker.number.int({ min: 0, max: 15 }),
        openToWork: true,
      },
    });
    seekers.push({ id: seeker.id, country: loc.country });
  }
  console.log(`👥 Created ${seekers.length} seekers.`);

  // ── 3. APPLICATIONS ──────────────────────────────────────────────
  let appsCreated = 0;
  for (const seeker of seekers) {
    const pool = createdJobs.filter((j) => j.country === seeker.country);
    const targets = faker.helpers.arrayElements(pool.length ? pool : createdJobs, {
      min: 1,
      max: APPLICATIONS_PER_SEEKER,
    });
    for (const job of targets) {
      try {
        await prisma.application.create({
          data: {
            jobId: job.id,
            seekerId: seeker.id,
            status: pick(['APPLIED', 'REVIEWING', 'INTERVIEW', 'OFFER']),
            coverNote: faker.lorem.sentences(2),
            matchScore: faker.number.int({ min: 40, max: 98 }),
          },
        });
        appsCreated++;
      } catch {
        /* skip duplicate (jobId, seekerId) */
      }
    }
  }
  console.log(`📨 Created ${appsCreated} applications.`);

  // ── 4. SAVED JOBS ────────────────────────────────────────────────
  let savedCreated = 0;
  for (const seeker of seekers) {
    const targets = faker.helpers.arrayElements(createdJobs, { min: 0, max: SAVED_PER_SEEKER });
    for (const job of targets) {
      try {
        await prisma.savedJob.create({
          data: { userId: seeker.id, jobId: job.id },
        });
        savedCreated++;
      } catch {
        /* skip duplicate */
      }
    }
  }
  console.log(`💾 Created ${savedCreated} saved jobs.`);

  const totalJobs = await prisma.job.count();
  const totalUsers = await prisma.user.count();
  console.log(`\n✅ Done.`);
  console.log(`   Jobs: ${totalJobs}`);
  console.log(`   Users: ${totalUsers}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());