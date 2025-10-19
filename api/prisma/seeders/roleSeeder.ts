import { PrismaClient } from "@prisma/client";

export async function seedRoles(prisma: PrismaClient) {
  const rolesData = [
    { name: "Admin" },
    { name: "Moderator" },
    { name: "Seller" },
    { name: "Buyer" },
  ];

  const roles = [] as { id: string; name: string; normalizedName: string }[];
  for (const r of rolesData) {
    const name = r.name;
    const normalizedName = name.toUpperCase();
    const role = await prisma.role.create({
      data: { name, normalizedName },
      select: { id: true },
    });
    roles.push({ id: role.id, name, normalizedName });
  }
  return roles;
}
