import { Body, Injectable } from "@nestjs/common";
import { Item, ItemDocument } from "./schemas/item.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

interface PriceFilter {
  $gte?: number;
  $lte?: number;
}

interface DateFilter {
  $gte?: Date;
  $lte?: Date;
}

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) protected itemModel: Model<ItemDocument>,
  ) {}

  async findItems(filters: {
    search?: string;
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    createdAfter?: string;
    createdBefore?: string;
    page?: number;
    limit?: number;
    sort?: "asc" | "desc";
  }) {
    const query = {
      ...this.buildSearchFilter(filters.search),
      ...this.buildCategoryFilter(filters.category),
      ...this.buildStatusFilter(filters.status),
      ...this.buildPriceFilter(filters.minPrice, filters.maxPrice),
      ...this.buildDateFilter(filters.createdAfter, filters.createdBefore),
    };

    const skip = (filters.page! - 1) * filters.limit!;
    const sortOrder = filters.sort === "asc" ? 1 : -1;

    return this.itemModel
      .find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(filters.limit!)
      .exec();
  }
  private buildSearchFilter(search?: string) {
    return search ? { name: { $regex: search, $options: "i" } } : {};
  }

  private buildCategoryFilter(category?: string) {
    return category ? { category } : {};
  }

  private buildStatusFilter(status?: string) {
    return status ? { status } : {};
  }

  private buildPriceFilter(minPrice?: number, maxPrice?: number) {
    if (minPrice === undefined && maxPrice === undefined) return {};
    const price: PriceFilter = {};
    if (minPrice !== undefined) price.$gte = minPrice;
    if (maxPrice !== undefined) price.$lte = maxPrice;
    return { price };
  }

  private buildDateFilter(createdAfter?: string, createdBefore?: string) {
    if (!createdAfter && !createdBefore) return {};
    const createdAt: DateFilter = {};
    if (createdAfter) createdAt.$gte = new Date(createdAfter);
    if (createdBefore) createdAt.$gte = new Date(createdBefore);
  }
}
