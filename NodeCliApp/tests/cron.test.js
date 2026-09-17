const getLowStockProducts = require("../src/jobs/utils/getLowStockProducts");
const generateDailyReport = require("../src/jobs/utils/generateDailyReport");

const Product = require("../model/Product");
const Order = require("../model/Order");
const User = require("../model/User");
const DailyReport = require("../model/DailyReport");

jest.mock("../model/Product");
jest.mock("../model/Order");
jest.mock("../model/User");
jest.mock("../model/DailyReport");

describe("Low stock detection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find products with quantity below 5", async () => {
    const lowStockProducts = [
      {
        _id: "product-1",
        name: "Keyboard",
        quantity: 2,
      },
      {
        _id: "product-2",
        name: "Mouse",
        quantity: 4,
      },
    ];

    const select = jest.fn().mockResolvedValue(lowStockProducts);

    Product.find.mockReturnValue({
      select,
    });

    const result = await getLowStockProducts();

    expect(Product.find).toHaveBeenCalledWith({
      quantity: { $lt: 5 },
    });

    expect(select).toHaveBeenCalledWith("_id name quantity");

    expect(result).toEqual(lowStockProducts);
  });

  it("should return an empty array when there are no low-stock products", async () => {
    Product.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([]),
    });

    const result = await getLowStockProducts();

    expect(result).toEqual([]);
  });
});

describe("Daily report generation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a daily report from orders and users", async () => {
    Order.countDocuments.mockResolvedValue(5);

    Order.aggregate.mockResolvedValue([
      {
        totalRevenue: 12500,
      },
    ]);

    User.countDocuments.mockResolvedValue(3);

    const createdReport = {
      totalOrders: 5,
      totalRevenue: 12500,
      newUsers: 3,
    };

    DailyReport.create.mockResolvedValue(createdReport);

    const job = {
      updateProgress: jest.fn().mockResolvedValue(),
    };

    const result = await generateDailyReport(job);

    expect(Order.countDocuments).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "completed",
        createdAt: expect.objectContaining({
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        }),
      })
    );

    expect(Order.aggregate).toHaveBeenCalledTimes(1);

    expect(User.countDocuments).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.objectContaining({
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        }),
      })
    );

    expect(DailyReport.create).toHaveBeenCalledWith(
      expect.objectContaining({
        totalOrders: 5,
        totalRevenue: 12500,
        newUsers: 3,
        date: expect.any(Date),
      })
    );

    expect(job.updateProgress).toHaveBeenNthCalledWith(1, 0);
    expect(job.updateProgress).toHaveBeenNthCalledWith(2, 25);
    expect(job.updateProgress).toHaveBeenNthCalledWith(3, 50);
    expect(job.updateProgress).toHaveBeenNthCalledWith(4, 75);
    expect(job.updateProgress).toHaveBeenNthCalledWith(5, 100);

    expect(result).toEqual(createdReport);
  });

  it("should use zero revenue when there are no completed orders", async () => {
    Order.countDocuments.mockResolvedValue(0);
    Order.aggregate.mockResolvedValue([]);
    User.countDocuments.mockResolvedValue(2);

    DailyReport.create.mockResolvedValue({
      totalOrders: 0,
      totalRevenue: 0,
      newUsers: 2,
    });

    const result = await generateDailyReport();

    expect(DailyReport.create).toHaveBeenCalledWith(
      expect.objectContaining({
        totalOrders: 0,
        totalRevenue: 0,
        newUsers: 2,
      })
    );

    expect(result.totalRevenue).toBe(0);
  });
});