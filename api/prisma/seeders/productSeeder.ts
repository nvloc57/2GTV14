import { PrismaClient, OriginZone, ProductStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedProducts(
  prisma: PrismaClient,
  users: { id: string }[],
  howMany = 10
) {
  const products = [] as { id: number }[];

  const zones: OriginZone[] = ["NORTH", "CENTRAL", "SOUTH", "MEKONG"];
  const statuses: ProductStatus[] = [
    "ACTIVE",
    "ONLEAVE",
    "PENDING",
    "DELETED",
    "BANNED",
    "EXPIRED",
  ];

  for (let i = 0; i < howMany; i++) {
    const name = faker.commerce.productName();
    const slug = faker.helpers.slugify(name.toLowerCase()) + "-" + i;
    const user = users[i % users.length];

    const product = await prisma.product.create({
      data: {
        name,
        cverUrl: faker.internet.url(),
        cliUrl: faker.internet.url(),
        slug,
        currentContact: faker.person.fullName(),
        oldContact: faker.person.fullName(),
        dId: faker.string.alphanumeric(8),
        cId: faker.string.alphanumeric(8),
        addr: faker.location.streetAddress(),
        oldAddr: faker.location.streetAddress(),
        originZone: faker.helpers.arrayElement(zones),
        openForBooking: faker.datatype.boolean() ? "yes" : "no",
        ver123: "v" + faker.number.int({ min: 1, max: 3 }),
        ver1: faker.number.int({ min: 0, max: 9 }),
        ver2: faker.number.int({ min: 0, max: 9 }),
        ver3: faker.number.int({ min: 0, max: 9 }),
        tagsText: faker.lorem.words(3),
        price: faker.commerce.price({ min: 10, max: 500, dec: 0 }),
        reputationScore: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
        status: faker.helpers.arrayElement(statuses),
        userId: user?.id,
      },
      select: { id: true },
    });
    products.push(product);
  }
  return products;
}
