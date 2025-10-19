import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

export async function seedUsers(prisma: PrismaClient) {
  const count = 8;
  const users = [] as { id: string }[];

  for (let i = 0; i < count; i++) {
    const fullName = faker.person.fullName();
    const userName = faker.internet.username().slice(0, 50);
    const email = faker.internet.email({ firstName: fullName.split(" ")[0] }).toLowerCase();
    const passwordHash = await bcrypt.hash("123456", 10);
    const normalizedUserName = userName.toUpperCase();
    const normalizedEmail = email.toUpperCase();

    const user = await prisma.user.create({
      data: {
        userName,
        normalizedUserName,
        email,
        normalizedEmail,
        emailConfirmed: true,
        passwordHash,
        securityStamp: faker.string.uuid(),
        concurrencyStamp: faker.string.uuid(),
        phoneNumber: faker.phone.number(),
        phoneNumberConfirmed: faker.datatype.boolean(),
        twoFactorEnabled: false,
        lockoutEnabled: false,
        accessFailedCount: 0,
        fullName,
        avatarUrl: faker.image.avatar(),
        reputation: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
        status: "ACTIVE",
        isActive: true,
        lastLogin: faker.date.recent({ days: 10 }),
      },
      select: { id: true },
    });
    users.push(user);
  }

  return users;
}
