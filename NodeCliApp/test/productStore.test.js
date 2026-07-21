const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");

const {
  createProduct,
  deleteProduct,
  listProducts,
} = require("../src/store/productStore");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "product-store-"));
process.env.PRODUCT_STORE_FILE = path.join(tempDir, "products.json");

test("createProduct and deleteProduct work with the fallback store", () => {
  const created = createProduct({
    name: "Test Product",
    price: 15,
    category: "tools",
  });
  assert.ok(created._id);
  assert.equal(created.name, "Test Product");

  const listed = listProducts();
  assert.ok(listed.some((product) => product._id === created._id));

  const deleted = deleteProduct(created._id);
  assert.equal(deleted._id, created._id);
  assert.equal(
    listProducts().some((product) => product._id === created._id),
    false,
  );
});
