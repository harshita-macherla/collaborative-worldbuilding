const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

router.use(protect);

router.get("/world/:worldId", getArticles);
router.post("/world/:worldId", createArticle);
router.get("/:id", getArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

module.exports = router;