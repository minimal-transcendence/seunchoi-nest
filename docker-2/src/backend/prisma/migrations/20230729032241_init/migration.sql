-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "nickname" TEXT,
    "email" TEXT,
    "avatar" TEXT NOT NULL DEFAULT 'path',
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3) NOT NULL,
    "friends" TEXT[],
    "refreshToken" TEXT,
    "tokenExp" INTEGER,
    "otpSecret" TEXT,
    "is2faEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
