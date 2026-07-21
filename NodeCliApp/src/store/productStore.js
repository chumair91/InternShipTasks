const fs = require("node:fs");
const path = require("node:path");

const storeFile =
  process.env.PRODUCT_STORE_FILE ||
  path.join(__dirname, "..", "..", "data", "products.json");

function ensureStoreFile() {
  const storeDir = path.dirname(storeFile);
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true });
  }

  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, "[]", "utf8");
  }
}

function loadProducts() {
  ensureStoreFile();
  const raw = fs.readFileSync(storeFile, "utf8");
  return JSON.parse(raw);
}

function persistProducts(products) {
  ensureStoreFile();
  fs.writeFileSync(storeFile, JSON.stringify(products, null, 2), "utf8");
}

function generateId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function listProducts() {
  return loadProducts();
}

function getProduct(id) {
  const normalizedId = String(id);
  return (
    loadProducts().find(
      (product) =>
        String(product._id) === normalizedId ||
        String(product.id) === normalizedId,
    ) || null
  );
}

function createProduct(data) {
  const products = loadProducts();
  const product = {
    _id: generateId(),
    id: generateId(),
    name: data.name,
    price: Number(data.price),
    category: data.category || "general",
    inStock: data.inStock ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(product);
  persistProducts(products);
  return product;
}

function deleteProduct(id) {
  const products = loadProducts();
  const index = products.findIndex(
    (product) =>
      String(product._id) === String(id) || String(product.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  const [deletedProduct] = products.splice(index, 1);
  persistProducts(products);
  return deletedProduct;
}

function updateProduct(id, updates) {
  const products = loadProducts();
  const index = products.findIndex(
    (product) =>
      String(product._id) === String(id) || String(product.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  const updatedProduct = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  persistProducts(products);
  return updatedProduct;
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
