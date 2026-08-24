const QueryBuilder = require('../src/utils/QueryBuilder');

const createMockQuery = () => {
  return {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };
};

describe('QueryBuilder - filter ', () => {
  test('applies category, stock and price filters', () => {
    const query = createMockQuery();
    const queryString = {
      category: 'electronics',
      inStock: 'true',
      minPrice: '100',
      maxPrice: '1000',
    };

    const builder = new QueryBuilder(query, queryString);
    builder.filter();

    expect(query.find).toHaveBeenCalledWith({
      category: 'electronics',
      inStock: true,
      price: {
        $gte: '100',
        $lte: '1000',
      },
    });
  });

  test('uses an empty filter when no filter parameters are provided', () => {
    const query = createMockQuery();

    const builder = new QueryBuilder(query, {});

    builder.filter();

    expect(query.find).toHaveBeenCalledWith({});
  });
});




describe("QueryBuilder - search", () => {
  test("searches by name and category", () => {
    const query = createMockQuery();

    const builder = new QueryBuilder(query, {
      search: "laptop",
    });

    builder.search();

    expect(query.find).toHaveBeenCalledWith({
      $or: [
        {
          name: {
            $regex: "laptop",
            $options: "i",
          },
        },
        {
          category: {
            $regex: "laptop",
            $options: "i",
          },
        },
      ],
    });
  });

  test("does not modify query when search is missing", () => {
    const query = createMockQuery();

    const builder = new QueryBuilder(query, {});

    builder.search();

    expect(query.find).not.toHaveBeenCalled();
  });
});



describe("QueryBuilder - sort", () => {
  test("sorts using requested field", () => {
    const query = createMockQuery();

    const builder = new QueryBuilder(query, {
      sort: "price",
    });

    builder.sort();

    expect(query.sort).toHaveBeenCalledWith("price");
  });

    test("sorts by newest when sort is not provided", () => {
    const query = createMockQuery();

    const builder = new QueryBuilder(query, {});

    builder.sort();

    expect(query.sort).toHaveBeenCalledWith("-createdAt");
  });
});