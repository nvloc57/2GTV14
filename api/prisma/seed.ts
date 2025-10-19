import { PrismaClient } from "@prisma/client";
import { clearData } from "./seeders/clearData";
import { seedRoles } from "./seeders/roleSeeder";
import { seedUsers } from "./seeders/userSeeder";
import { seedUserRoles } from "./seeders/userRoleSeeder";
import { seedRoleClaims } from "./seeders/roleClaimSeeder";
import { seedUserClaims } from "./seeders/userClaimSeeder";
import { seedUserLogins } from "./seeders/userLoginSeeder";
import { seedUserTokens } from "./seeders/userTokenSeeder";
import { seedTags } from "./seeders/tagSeeder";
import { seedProducts } from "./seeders/productSeeder";
import { seedProductTags } from "./seeders/productTagSeeder";
import { seedProductImages } from "./seeders/productImageSeeder";
import { seedReviews } from "./seeders/reviewSeeder";
import { seedReviewImages } from "./seeders/reviewImageSeeder";
import { seedComments } from "./seeders/commentSeeder";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for current schema...");
  await clearData(prisma);

  // Identity
  const roles = await seedRoles(prisma);
  const users = await seedUsers(prisma);
  await seedUserRoles(prisma, users, roles);
  await seedRoleClaims(prisma, roles);
  await seedUserClaims(prisma, users);
  await seedUserLogins(prisma, users);
  await seedUserTokens(prisma, users);

  // Product domain
  const tags = await seedTags(prisma, 8);
  const products = await seedProducts(prisma, users, 12);
  await seedProductTags(prisma, products, tags);
  await seedProductImages(prisma, products);
  const reviews = await seedReviews(prisma, products, users, 30);
  await seedReviewImages(prisma, reviews);
  await seedComments(prisma, products, users, 40);

  console.log("Seeding completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });

