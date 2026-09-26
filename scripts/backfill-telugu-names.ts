/**
 * Re-generate Telugu names for ALL donations using Google Cloud transliteration.
 * Run: npx tsx scripts/backfill-telugu-names.ts
 */
import "./load-env";
import { PrismaClient } from "@prisma/client";
import { buildDonationData } from "../lib/transliterate";

const prisma = new PrismaClient();

async function main() {
  const donations = await prisma.donation.findMany();

  for (const donation of donations) {
    const data = await buildDonationData({
      name: donation.name,
      aliasName: donation.aliasName,
      fatherName: donation.fatherName,
      nameTe: donation.nameTe,
      aliasNameTe: donation.aliasNameTe,
      fatherNameTe: donation.fatherNameTe,
      notes: donation.notes,
      amount: donation.amount,
      donationDate: donation.donationDate,
      paymentMode: donation.paymentMode,
    });

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        nameTe: data.nameTe,
        aliasNameTe: data.aliasNameTe,
        fatherNameTe: data.fatherNameTe,
      },
    });

    console.log(`${donation.name} -> ${data.nameTe}`);
  }

  console.log(`Backfilled ${donations.length} donation(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
