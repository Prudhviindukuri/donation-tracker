-- CreateTable
CREATE TABLE "ProgressImage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "titleTe" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressImage_pkey" PRIMARY KEY ("id")
);
