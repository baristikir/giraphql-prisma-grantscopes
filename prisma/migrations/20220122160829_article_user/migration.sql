-- CreateTable
CREATE TABLE "Article" (
    "pk" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicText" TEXT NOT NULL,
    "privateText" TEXT NOT NULL,
    "authorPk" INTEGER NOT NULL,
    CONSTRAINT "Article_authorPk_fkey" FOREIGN KEY ("authorPk") REFERENCES "User" ("pk") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "pk" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
