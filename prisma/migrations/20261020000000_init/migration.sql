-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "HolonSession" (
    "id" TEXT NOT NULL,
    "askerKind" TEXT NOT NULL,
    "askerName" TEXT,
    "askerEmail" TEXT,
    "site" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HolonSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HolonMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "entriesCited" TEXT[],
    "provider" TEXT,
    "model" TEXT,
    "instructionVersion" TEXT,
    "costUsd" DOUBLE PRECISION,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HolonMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelCall" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "instructionVersion" TEXT,
    "inputTokens" INTEGER NOT NULL,
    "cacheReadTokens" INTEGER NOT NULL DEFAULT 0,
    "cacheWriteTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL,
    "costUsd" DOUBLE PRECISION NOT NULL,
    "servedFor" TEXT NOT NULL,
    "askerEmail" TEXT,
    "sessionId" TEXT,
    "stopReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GapNote" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sharedQuestion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GapNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HolonSession_createdAt_idx" ON "HolonSession"("createdAt");

-- CreateIndex
CREATE INDEX "HolonMessage_sessionId_createdAt_idx" ON "HolonMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "ModelCall_createdAt_idx" ON "ModelCall"("createdAt");

-- CreateIndex
CREATE INDEX "ModelCall_askerEmail_createdAt_idx" ON "ModelCall"("askerEmail", "createdAt");

-- AddForeignKey
ALTER TABLE "HolonMessage" ADD CONSTRAINT "HolonMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "HolonSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

