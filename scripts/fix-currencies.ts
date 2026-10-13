// scripts/fix-currencies.ts
import { PrismaClient, Currency } from '@prisma/client';

const prisma = new PrismaClient();

// Map each country to its natural currency + realistic salary range
const COUNTRY_CURRENCY: Record<string, { currency: Currency; min: number; max: number }> = {
  'United Arab Emirates': { currency: Currency.AED, min: 180000, max: 450000 },
  'Saudi Arabia':         { currency: Currency.SAR, min: 180000, max: 480000 },
  'Qatar':                { currency: Currency.QAR, min: 180000, max: 450000 },
  'Kuwait':               { currency: Currency.KWD, min: 15000,  max: 40000  },
  'Bahrain':              { currency: Currency.BHD, min: 15000,  max: 40000  },
  'Oman':                 { currency: Currency.OMR, min: 15000,  max: 40000  },
  'Jordan':               { currency: Currency.JOD, min: 15000,  max: 40000  },
  'India':                { currency: Currency.INR, min: 1500000, max: 4000000 },
  'Pakistan':             { currency: Currency.PKR, min: 2500000, max: 7000000 },
  'Nigeria':              { currency: Currency.NGN, min: 8000000, max: 25000000 },
  'South Africa':         { currency: Currency.ZAR, min: 500000, max: 1200000 },
  'Egypt':                { currency: Currency.EGP, min: 500000, max: 1500000 },
  'Kenya':                { currency: Currency.KES, min: 2000000, max: 6000000 },
  'Ghana':                { currency: Currency.GHS, min: 200000, max: 600000 },
  'Japan':                { currency: Currency.JPY, min: 6000000, max: 14000000 },
  'China':                { currency: Currency.CNY, min: 300000, max: 800000 },
  'Australia':            { currency: Currency.AUD, min: 90000, max: 200000 },
  'Canada':               { currency: Currency.CAD, min: 80000, max: 180000 },
  'Brazil':               { currency: Currency.BRL, min: 150000, max: 400000 },
  'Mexico':               { currency: Currency.MXN, min: 400000, max: 1200000 },
  'Germany':              { currency: Currency.EUR, min: 60000, max: 140000 },
  'France':               { currency: Currency.EUR, min: 50000, max: 120000 },
  'Spain':                { currency: Currency.EUR, min: 40000, max: 100000 },
  'Netherlands':          { currency: Currency.EUR, min: 60000, max: 140000 },
  'United Kingdom':       { currency: Currency.GBP, min: 50000, max: 130000 },
  'United States':        { currency: Currency.USD, min: 80000, max: 200000 },
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('💱 Updating job currencies based on country...\n');

  const jobs = await prisma.job.findMany();

  let updated = 0;
  let skipped = 0;

  for (const job of jobs) {
    const config = COUNTRY_CURRENCY[job.country];

    if (!config) {
      // Remote or unknown — keep USD
      skipped++;
      continue;
    }

    const salaryMin = randomInt(config.min, config.max);
    const salaryMax = salaryMin + randomInt(
      Math.floor((config.max - config.min) * 0.15),
      Math.floor((config.max - config.min) * 0.35)
    );

    await prisma.job.update({
      where: { id: job.id },
      data: {
        salaryCurrency: config.currency,
        salaryMin,
        salaryMax,
      },
    });
    updated++;
  }

  console.log(`✅ Updated ${updated} jobs with local currencies.`);
  console.log(`⏭️  Skipped ${skipped} jobs (Remote/unknown location).\n`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });