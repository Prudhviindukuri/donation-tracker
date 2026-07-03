/**
 * One-time backfill: generate Telugu names for donations saved before transliteration.
 * Run: npx tsx scripts/backfill-telugu-names.ts
 */
import { PrismaClient } from "@prisma/client";
import { withTeluguNames } from "../lib/transliterate";

const prisma = new PrismaClient();

async function main() {
  const donations = await prisma.donation.findMany({
    where: {
      OR: [{ nameTe: "" }, { aliasNameTe: "" }, { fatherNameTe: "" }],
    },
  });

  for (const donation of donations) {
    const telugu = withTeluguNames({
      name: donation.name,
      aliasName: donation.aliasName,
      fatherName: donation.fatherName,
    });

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        nameTe: telugu.nameTe,
        aliasNameTe: telugu.aliasNameTe,
        fatherNameTe: telugu.fatherNameTe,
      },
    });
  }

  console.log(`Backfilled ${donations.length} donation(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
