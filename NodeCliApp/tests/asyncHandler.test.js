const asyncHanlder = require('../src/middleware/asyncHandler');

describe('asyncHandler', () => {
  it('calls the wrapped function', async () => {
    const controller = jest.fn().mockResolvedValue('success');
    const wrapped = asyncHanlder(controller);
    await wrapped({}, {}, jest.fn());
    expect(controller).toHaveBeenCalled();
  });

  it('passes rejected errors to next', async () => {
    const error = new Error('something went wrong');
    const controller = jest.fn().mockRejectedValue(error);
    const wrapped = asyncHanlder(controller);
    const next = jest.fn();
    await wrapped({}, {}, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('works when wrapped function resolves undefined', async () => {
    const controller = jest.fn().mockResolvedValue(undefined);
    const wrapped = asyncHanlder(controller);
    const next = jest.fn();
    await wrapped({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });
});
