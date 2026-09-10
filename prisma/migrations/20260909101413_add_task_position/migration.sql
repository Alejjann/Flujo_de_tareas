-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Task_userId_status_position_idx" ON "Task"("userId", "status", "position");

-- CreateIndex
CREATE INDEX "User_resetTokenExpiry_idx" ON "User"("resetTokenExpiry");
