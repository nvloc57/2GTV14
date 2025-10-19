import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedComments(
  prisma: PrismaClient,
  products: { id: number }[],
  users: { id: string }[],
  howMany = 20
) {
  if (!products.length) return;
  for (let i = 0; i < howMany; i++) {
    const product = products[i % products.length];
    const maybeUser = faker.datatype.boolean() ? users[i % users.length] : undefined;
    await prisma.comment.create({
      data: {
        productId: product.id,
        userId: maybeUser?.id ?? null,
        content: faker.lorem.sentence(),
      },
    });
  }
}

