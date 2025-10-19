import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedProductImages(prisma: PrismaClient, products: { id: number }[]) {
  for (const p of products) {
    const imageCount = 1 + (p.id % 3);
    for (let i = 0; i < imageCount; i++) {
      await prisma.productImage.create({
        data: {
          productId: p.id,
          url: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
          isPrimary: i === 0,
        },
      });
    }
  }
}

