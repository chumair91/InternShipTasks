const { processEmailJob } =require('../src/workers/processors/emailProcessor');

const Order=require('../model/Order');


describe('Email job processor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully process an email job for an existing order', async () => {
    jest.spyOn(Order, 'findById').mockResolvedValue({
      _id: 'order123',
    });

    const job = {
      data: {
        orderId: 'order123',
      },
    };

    const result = await processEmailJob(job);
    expect(Order.findById).toHaveBeenCalledWith('order123');

    expect(result).toEqual({
      success: true,
    });
  });

  it('should throw an error when the order does not exist', async () => {
    jest.spyOn(Order, 'findById').mockResolvedValue(null);

    const job = {
      data: {
        orderId: 'invalid-order',
      },
    };

    await expect(processEmailJob(job)).rejects.toThrow('Order not found');

    expect(Order.findById).toHaveBeenCalledWith('invalid-order');
  });
});
