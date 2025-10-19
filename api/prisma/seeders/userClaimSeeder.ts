import { PrismaClient } from "@prisma/client";

export async function seedUserClaims(prisma: PrismaClient, users: { id: string }[]) {
  for (const u of users) {
    await prisma.userClaim.create({
      data: {
        userId: u.id,
        claimType: "feature",
        claimValue: "beta_access",
      },
    });
  }
}

