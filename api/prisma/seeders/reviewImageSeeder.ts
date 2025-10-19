import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedReviewImages(prisma: PrismaClient, reviews: { id: number }[]) {
  for (const r of reviews) {
    const count = r.id % 2; // 0 or 1 image
    for (let i = 0; i < count; i++) {
      await prisma.reviewImage.create({
        data: {
          reviewId: r.id,
          imageUrl: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
        },
      });
    }
  }
}

