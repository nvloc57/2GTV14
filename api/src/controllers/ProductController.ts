import { prisma } from "../utils/prisma";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import type { Request as ExRequest } from "express";
import type { OriginZone, ProductStatus } from "@prisma/client";

type ProductListItem = {
  id: number;
  name: string;
  slug: string | null;
  price: string | null;
  status: ProductStatus;
  originZone: OriginZone | null;
  reputationScore: number;
  createdAt: Date;
  userId: string | null;
};

type ProductDetail = ProductListItem & {
  cverUrl: string;
  cliUrl: string;
  currentContact: string | null;
  oldContact: string | null;
  dId: string | null;
  cId: string | null;
  addr: string | null;
  oldAddr: string | null;
  ver123: string | null;
  ver1: number | null;
  ver2: number | null;
  ver3: number | null;
  tagsText: string | null;
  images: Array<{ id: number; url: string; isPrimary: boolean }>;
  tags: Array<{ id: number; name: string }>;
};

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

@Route("products")
@Tags("Product")
export class ProductController extends Controller {
  @Get("/")
  @Response<null>(400, "Bad Request")
  public async listProducts(
    @Query() search?: string,
    @Query() status?: ProductStatus,
    @Query() originZone?: OriginZone,
    @Query() userId?: string,
    @Query() tagId?: number,
    @Query() page: number = 1,
    @Query() pageSize: number = 20
  ): Promise<ProductListItem[]> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 20));
    const skip = Math.max(0, ((Number(page) || 1) - 1) * take);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (originZone) where.originZone = originZone;
    if (userId) where.userId = userId;
    if (typeof tagId === "number") {
      where.tags = { some: { tagId } };
    }

    return prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        status: true,
        originZone: true,
        reputationScore: true,
        createdAt: true,
        userId: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  @Get("{id}")
  @Response<null>(404, "Product not found")
  public async getProduct(@Path() id: number): Promise<ProductDetail | null> {
    const p = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        status: true,
        originZone: true,
        reputationScore: true,
        createdAt: true,
        userId: true,
        cverUrl: true,
        cliUrl: true,
        currentContact: true,
        oldContact: true,
        dId: true,
        cId: true,
        addr: true,
        oldAddr: true,
        ver123: true,
        ver1: true,
        ver2: true,
        ver3: true,
        tagsText: true,
        ProductImage: { select: { id: true, url: true, isPrimary: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
    });
    if (!p) {
      this.setStatus(404);
      return null;
    }
    const detail: ProductDetail = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      status: p.status,
      originZone: p.originZone,
      reputationScore: p.reputationScore,
      createdAt: p.createdAt,
      userId: p.userId ?? null,
      cverUrl: p.cverUrl,
      cliUrl: p.cliUrl,
      currentContact: p.currentContact ?? null,
      oldContact: p.oldContact ?? null,
      dId: p.dId ?? null,
      cId: p.cId ?? null,
      addr: p.addr ?? null,
      oldAddr: p.oldAddr ?? null,
      ver123: p.ver123 ?? null,
      ver1: p.ver1 ?? null,
      ver2: p.ver2 ?? null,
      ver3: p.ver3 ?? null,
      tagsText: p.tagsText ?? null,
      images: p.ProductImage.map((i) => ({ id: i.id, url: i.url, isPrimary: i.isPrimary })),
      tags: p.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
    };
    return detail;
  }

  @Post("/")
  @Response<null>(400, "Bad Request")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Security("bearerAuth", ["ADMIN", "SELLER"])
  public async createProduct(
    @Body()
    body: {
      name: string;
      cverUrl: string;
      cliUrl: string;
      slug?: string | null;
      price?: string | null;
      status?: ProductStatus;
      originZone?: OriginZone | null;
      userId?: string | null;
      tagsText?: string | null;
      currentContact?: string | null;
      oldContact?: string | null;
      dId?: string | null;
      cId?: string | null;
      addr?: string | null;
      oldAddr?: string | null;
      ver123?: string | null;
      ver1?: number | null;
      ver2?: number | null;
      ver3?: number | null;
    }
  ): Promise<ProductListItem> {
    if (!body?.name || !body?.cverUrl || !body?.cliUrl) {
      this.setStatus(400);
      throw new Error("name, cverUrl, cliUrl are required");
    }
    const slugCandidate = body.slug && body.slug.trim().length > 0 ? body.slug : toSlug(body.name);

    // ensure unique slug if provided/computed
    let slug = slugCandidate;
    if (slug) {
      const exists = await prisma.product.findUnique({ where: { slug } });
      if (exists) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    const created = await prisma.product.create({
      data: {
        name: body.name,
        cverUrl: body.cverUrl,
        cliUrl: body.cliUrl,
        slug,
        price: body.price ?? null,
        status: body.status ?? "ACTIVE",
        originZone: body.originZone ?? null,
        userId: body.userId ?? null,
        tagsText: body.tagsText ?? null,
        currentContact: body.currentContact ?? null,
        oldContact: body.oldContact ?? null,
        dId: body.dId ?? null,
        cId: body.cId ?? null,
        addr: body.addr ?? null,
        oldAddr: body.oldAddr ?? null,
        ver123: body.ver123 ?? null,
        ver1: body.ver1 ?? null,
        ver2: body.ver2 ?? null,
        ver3: body.ver3 ?? null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        status: true,
        originZone: true,
        reputationScore: true,
        createdAt: true,
        userId: true,
      },
    });
    return created as ProductListItem;
  }

  @Put("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Product not found")
  @Security("bearerAuth", ["ADMIN", "SELLER"])
  public async updateProduct(
    @Path() id: number,
    @Body()
    body: Partial<{
      name: string;
      cverUrl: string;
      cliUrl: string;
      slug: string | null;
      price: string | null;
      status: ProductStatus;
      originZone: OriginZone | null;
      userId: string | null;
      tagsText: string | null;
      currentContact: string | null;
      oldContact: string | null;
      dId: string | null;
      cId: string | null;
      addr: string | null;
      oldAddr: string | null;
      ver123: string | null;
      ver1: number | null;
      ver2: number | null;
      ver3: number | null;
    }>
  ): Promise<ProductListItem | null> {
    const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      this.setStatus(404);
      return null;
    }

    const data: any = {};
    for (const k of [
      "name",
      "cverUrl",
      "cliUrl",
      "slug",
      "price",
      "status",
      "originZone",
      "userId",
      "tagsText",
      "currentContact",
      "oldContact",
      "dId",
      "cId",
      "addr",
      "oldAddr",
      "ver123",
      "ver1",
      "ver2",
      "ver3",
    ] as const) {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        (data as any)[k] = (body as any)[k];
      }
    }

    if (typeof data.slug === "string" && data.slug.length === 0) data.slug = null;

    const updated = await prisma.product.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        status: true,
        originZone: true,
        reputationScore: true,
        createdAt: true,
        userId: true,
      },
    });
    return updated as ProductListItem;
  }

  @Delete("{id}")
  @Response<null>(401, "Unauthorized")
  @Response<null>(403, "Forbidden")
  @Response<null>(404, "Product not found")
  @Security("bearerAuth", ["ADMIN"]) // restrict delete to admin
  public async deleteProduct(@Path() id: number): Promise<{ message: string; id: number } | null> {
    const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      this.setStatus(404);
      return null;
    }
    await prisma.product.delete({ where: { id } });
    return { message: "Product deleted", id };
  }
}

