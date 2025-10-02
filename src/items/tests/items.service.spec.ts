import { ItemsService } from "../items.service";
import { Model } from "mongoose";
import { ItemDocument } from "../schemas/item.schema";

describe("Items Service Simple tests", () => {
  let service: ItemsService;

  beforeEach(() => {
    const mockModel = {} as unknown as Model<ItemDocument>;
    service = new ItemsService(mockModel);
  });

  it("buildSearchFilter returns regex filter", () => {
    expect(service["buildSearchFilter"]("phone")).toEqual({
      name: { $regex: "phone", $options: "i" },
    });
    expect(service["buildSearchFilter"](undefined)).toEqual({});
  });

  it("buildCategoryFilter returns category filter", () => {
    expect(service["buildCategoryFilter"]("electronics")).toEqual({
      category: "electronics",
    });
    expect(service["buildCategoryFilter"](undefined)).toEqual({});
  });
  it("buildStatusFilter returns status filter", () => {
    expect(service["buildStatusFilter"]("active")).toEqual({
      status: "active",
    });
    expect(service["buildStatusFilter"]("inactive")).toEqual({
      status: "inactive",
    });
    expect(service["buildStatusFilter"](undefined)).toEqual({});
  });

  it("buildPriceFilter returns correct price filter", () => {
    expect(service["buildPriceFilter"](100, 500)).toEqual({
      price: { $gte: 100, $lte: 500 },
    });
    expect(service["buildPriceFilter"](100, undefined)).toEqual({
      price: { $gte: 100 },
    });

    expect(service["buildPriceFilter"](undefined, 500)).toEqual({
      price: { $lte: 500 },
    });

    expect(service["buildPriceFilter"](undefined, undefined)).toEqual({});
  });

  it("buildDateFilter returns correct date filter", () => {
    const after = "2025-01-01";
    const before = "2025-12-31";
    expect(service["buildDateFilter"](after, before)).toEqual({
      createdAt: { $gte: new Date(after), $lte: new Date(before) },
    });
    expect(service["buildDateFilter"](after, undefined)).toEqual({
      createdAt: { $gte: new Date(after) },
    });
    expect(service["buildDateFilter"](undefined, before)).toEqual({
      createdAt: { $lte: new Date(before) },
    });
    expect(service["buildDateFilter"](undefined, undefined)).toEqual({});
  });

  it("findItems returns query results", async () => {
    const mockExc = jest.fn().mockResolvedValue([{ name: "phone" }]);
    const mockModel = {
      find: jest.fn(() => ({
        sort: () => ({ skip: () => ({ limit: () => ({ exec: mockExc }) }) }),
      })),
    } as unknown as Model<ItemDocument>;
    const serviceWithMock = new ItemsService(mockModel);

    const result = await serviceWithMock.findItems({ search: "phone" });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockModel.find).toHaveBeenCalledWith({
      name: { $regex: "phone", $options: "i" },
    });
    expect(result).toEqual([{ name: "phone" }]);
  });
});
