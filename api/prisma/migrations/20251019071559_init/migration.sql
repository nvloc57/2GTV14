/*
  Warnings:

  - You are about to drop the column `citId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `disId` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `citId`,
    DROP COLUMN `disId`,
    ADD COLUMN `cId` VARCHAR(191) NULL,
    ADD COLUMN `dId` VARCHAR(191) NULL;
