const placeOrder = require("../src/controllers/orderController");
const Order = require("../model/Order");
const flowProducer = require("../src/flow/orderFlow");

jest.mock("../model/Order");
jest.mock("../src/flow/orderFlow");

describe("placeOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order and add the correct job flow", async () => {
    const fakeOrderId = "507f1f77bcf86cd799439011";

    Order.create.mockResolvedValue({
      _id: fakeOrderId,
    });

    flowProducer.add.mockResolvedValue({
      job: {
        id: "job-123",
      },
    });

    const req = {
      user: {
        _id: "user-123",
      },
      body: {
        items: [
          {
            product: "product-123",
            quantity: 2,
          },
        ],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await placeOrder(req, res);

    // Order should be created
    expect(Order.create).toHaveBeenCalledWith({
      user: "user-123",
      items: req.body.items,
      total: 0,
    });

    // Flow should be added
    expect(flowProducer.add).toHaveBeenCalledTimes(1);

    const flow = flowProducer.add.mock.calls[0][0];

    // Root job
    expect(flow.name).toBe("process-order");
    expect(flow.queueName).toBe("order");
    expect(flow.data.orderId).toBe(fakeOrderId);

    // Email child
    expect(flow.children).toHaveLength(1);

    const emailJob = flow.children[0];

    expect(emailJob.name).toBe("send-email");
    expect(emailJob.queueName).toBe("email");
    expect(emailJob.data.orderId).toBe(fakeOrderId);

    // Payment child
    const paymentJob = emailJob.children[0];

    expect(paymentJob.name).toBe("charge-payment");
    expect(paymentJob.queueName).toBe("payment");
    expect(paymentJob.data.orderId).toBe(fakeOrderId);

    // Stock child
    const stockJob = paymentJob.children[0];

    expect(stockJob.name).toBe("validate-stock");
    expect(stockJob.queueName).toBe("stock");
    expect(stockJob.data.orderId).toBe(fakeOrderId);

    // Response
    expect(res.status).toHaveBeenCalledWith(202);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Order created. Processing has started.",
      orderId: fakeOrderId,
    });
  });
});