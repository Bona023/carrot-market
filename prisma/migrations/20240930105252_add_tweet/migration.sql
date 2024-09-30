-- AlterTable
ALTER TABLE "User" ADD COLUMN "bio" TEXT;

-- CreateTable
CREATE TABLE "Tweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tweet" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "authorName" TEXT DEFAULT '익명',
    CONSTRAINT "Tweet_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User" ("username") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT
);
