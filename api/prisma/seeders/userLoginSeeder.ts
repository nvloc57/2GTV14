import { PrismaClient } from "@prisma/client";

export async function seedUserLogins(prisma: PrismaClient, users: { id: string }[]) {
  if (!users.length) return;
  const u = users[0];
  await prisma.userLogin.create({
    data: {
      loginProvider: "github",
      providerKey: `github_${u.id}`,
      providerDisplayName: "GitHub",
      userId: u.id,
    },
  });
}

