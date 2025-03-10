-- CreateTable
CREATE TABLE "TeamInvitations" (
    "userId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamInvitations_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateIndex
CREATE INDEX "TeamInvitations_teamId_idx" ON "TeamInvitations"("teamId");

-- CreateIndex
CREATE INDEX "TeamInvitations_userId_idx" ON "TeamInvitations"("userId");
