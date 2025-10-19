import { PrismaClient } from "@prisma/client";

export async function seedUserRoles(
  prisma: PrismaClient,
  users: { id: string }[],
  roles: { id: string; name: string }[]
) {
  if (!users.length || !roles.length) return;

  // Assign first user as Admin, then others as Buyer/Seller randomly
  const adminRole = roles.find((r) => r.name.toLowerCase() === "admin") || roles[0];
  await prisma.userRole.create({ data: { userId: users[0].id, roleId: adminRole.id } });

  for (let i = 1; i < users.length; i++) {
    const role = roles[1 + (i % (roles.length - 1))];
    await prisma.userRole.create({ data: { userId: users[i].id, roleId: role.id } });
  }
}

