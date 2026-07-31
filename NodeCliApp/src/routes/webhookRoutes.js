const { webhook } = require("../controllers/webhookController");

const router = require("express").Router();

router.post("/stripe", webhook);

module.exports = router;
