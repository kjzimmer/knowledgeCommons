-- CreateTable
CREATE TABLE "JobRun" (
    "id" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "ok" BOOLEAN,
    "detail" TEXT,

    CONSTRAINT "JobRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitorRun" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trigger" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL,
    "results" JSONB NOT NULL,
    "failing" TEXT[],
    "alertSent" BOOLEAN NOT NULL DEFAULT false,
    "alertError" TEXT,

    CONSTRAINT "MonitorRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobRun_job_startedAt_idx" ON "JobRun"("job", "startedAt");

-- CreateIndex
CREATE INDEX "MonitorRun_startedAt_idx" ON "MonitorRun"("startedAt");

