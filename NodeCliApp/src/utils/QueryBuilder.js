class QueryBuilder {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    console.log("printing query");
    console.log(this.queryString);

    const filter = {};
    if (this.queryString.category) {
      filter.category = this.queryString.category;
    }
    if (this.queryString.inStock) {
      filter.inStock = this.queryString.inStock === "true";
    }
    if (this.queryString.minPrice || this.queryString.maxPrice) {
      filter.price = {};

      if (this.queryString.minPrice) {
        filter.price.$gte = this.queryString.minPrice;
      }
      if (this.queryString.maxPrice) {
        filter.price.$lte = this.queryString.maxPrice;
      }
    }
    this.query = this.query.find(filter);
    return this;
  }
  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        $or: [
          {
            name: {
              $regex: this.queryString.search,
              $options: "i",
            },
          },
          {
            category: {
              $regex: this.queryString.search,
              $options: "i",
            },
          },
        ],
      });
    }
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    if (this.queryString.page || this.queryString.limit) {
      let page = this.queryString.page || 1;
      let limit = this.queryString.limit || 10;

      this.query = this.query.skip((page - 1) * limit).limit(limit);
    }
    return this;
  }
}

module.exports = QueryBuilder;
