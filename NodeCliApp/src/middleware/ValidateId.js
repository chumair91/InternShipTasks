function validateId(req, res, next) {
  const { id } = req.params;
  const intId = Number(id);

  if (Number.isNaN(intId)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  next();
}

module.exports = { validateId };
