const hpp = require("../src/middleware/hpp");

describe("HPP Middleware", () => {
  it("should preserve arrays in JSON body requests", () => {
    const middleware = hpp();
    const req = {
      is: (type) => type === "json",
      query: {},
      body: {
        items: [
          { product: "prod-1", quantity: 1 },
          { product: "prod-2", quantity: 2 },
        ],
      },
    };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(req.body.items).toHaveLength(2);
    expect(next).toHaveBeenCalled();
  });

  it("should preserve whitelisted array properties in body", () => {
    const middleware = hpp({ whitelist: ["items"] });
    const req = {
      is: (type) => false,
      query: {},
      body: {
        items: [
          { product: "prod-1", quantity: 1 },
          { product: "prod-2", quantity: 2 },
        ],
        tags: ["tag1", "tag2"],
      },
    };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(req.body.items).toHaveLength(2);
    expect(req.body.tags).toBe("tag2"); // Non-whitelisted array gets sanitized
    expect(next).toHaveBeenCalled();
  });

  it("should sanitize duplicate query parameters", () => {
    const middleware = hpp();
    const req = {
      is: (type) => false,
      query: {
        category: ["electronics", "clothing"],
      },
      body: {},
    };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(req.query.category).toBe("clothing");
    expect(next).toHaveBeenCalled();
  });
});
