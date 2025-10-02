import { Controller, Get, Query } from "@nestjs/common";
import { ItemsService } from "./items.service";

@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async getItems(
    @Query("search") search?: string,
    @Query("category") category?: string,
    @Query("status") status?: string,
    @Query("minPrice") minPrice?: number,
    @Query("maxPrice") maxPrice?: number,
    @Query("createdAfter") createdAfter?: string,
    @Query("createdBefore") createdBefore?: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("sort") sort: "asc" | "desc" = "desc",
  ) {
    return this.itemsService.findItems({
      search,
      category,
      status,
      minPrice,
      maxPrice,
      createdAfter,
      createdBefore,
      page,
      limit,
      sort,
    });
  }
}
