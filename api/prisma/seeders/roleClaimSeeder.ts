import { PrismaClient } from "@prisma/client";

export async function seedRoleClaims(
  prisma: PrismaClient,
  roles: { id: string; name: string }[]
) {
  for (const role of roles) {
    await prisma.roleClaim.create({
      data: {
        roleId: role.id,
        claimType: "permission",
        claimValue: `can_${role.name.toLowerCase()}`,
      },
    });
  }
}

