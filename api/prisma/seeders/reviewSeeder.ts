import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedReviews(
  prisma: PrismaClient,
  products: { id: number }[],
  users: { id: string }[],
  howMany = 20
) {
  const reviews = [] as { id: number }[];
  if (!products.length || !users.length) return reviews;

  for (let i = 0; i < howMany; i++) {
    const product = products[i % products.length];
    const user = users[i % users.length];
    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: user.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        content: faker.lorem.sentences({ min: 1, max: 2 }),
      },
      select: { id: true },
    });
    reviews.push(review);
  }
  return reviews;
}

