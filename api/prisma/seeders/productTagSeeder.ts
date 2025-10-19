import { PrismaClient } from "@prisma/client";

export async function seedProductTags(
  prisma: PrismaClient,
  products: { id: number }[],
  tags: { id: number }[]
) {
  if (!products.length || !tags.length) return;
  for (const p of products) {
    const sample = tags.sort(() => 0.5 - Math.random()).slice(0, 2 + (p.id % 3));
    for (const t of sample) {
      await prisma.productTag.create({ data: { productId: p.id, tagId: t.id } });
    }
  }
}

