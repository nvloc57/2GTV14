import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedUserTokens(prisma: PrismaClient, users: { id: string }[]) {
  for (const u of users.slice(0, 3)) {
    await prisma.userToken.create({
      data: {
        userId: u.id,
        loginProvider: "local",
        name: "api_token",
        value: faker.string.alphanumeric(40),
      },
    });
  }
}

