import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedTags(prisma: PrismaClient, howMany = 6) {
  const tags = [] as { id: number }[];
  for (let i = 0; i < howMany; i++) {
    const tag = await prisma.tag.create({
      data: { name: faker.commerce.productAdjective().toLowerCase() + "-" + i },
      select: { id: true },
    });
    tags.push(tag);
  }
  return tags;
}

