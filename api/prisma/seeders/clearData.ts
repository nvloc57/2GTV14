import { PrismaClient } from "@prisma/client";

// Clear data respecting FK constraints (children -> parents)
export async function clearData(prisma: PrismaClient): Promise<void> {
  // Product domain (children first)
  await prisma.reviewImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.product.deleteMany();

  // Identity tables (children first)
  await prisma.userToken.deleteMany();
  await prisma.userLogin.deleteMany();
  await prisma.userClaim.deleteMany();
  await prisma.roleClaim.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
}
