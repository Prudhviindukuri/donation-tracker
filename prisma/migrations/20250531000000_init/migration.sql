-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);
