const { add } = require("../src/math");

test("add two numbers", () => {
  expect(add(2, 1)).toBe(3);
});
