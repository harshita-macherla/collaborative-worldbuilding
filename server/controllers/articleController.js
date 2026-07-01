const Article = require("../models/Article");
const World = require("../models/World");

// helper: check if user has access to a world
const hasAccess = async (worldId, userId) => {
  const world = await World.findById(worldId);
  if (!world) return false;
  const isOwner = world.owner.toString() === userId;
  const isMember = world.members.some(m => m.user.toString() === userId);
  return isOwner || isMember;
};

// GET all articles in a world (optionally filtered by type)
exports.getArticles = async (req, res) => {
  try {
    const { worldId } = req.params;
    const { type } = req.query;

    if (!(await hasAccess(worldId, req.user.id))) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const filter = { world: worldId };
    if (type) filter.type = type;

    const articles = await Article.find(filter)
      .populate("createdBy", "username")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single article + auto-linked content
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("createdBy", "username");

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (!(await hasAccess(article.world, req.user.id))) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Get all OTHER articles in this world to detect links
    const allArticles = await Article.find({
      world: article.world,
      _id: { $ne: article._id },
    }).select("title _id type");

    // Replace mentions of other article titles with markers the frontend can turn into links
    let linkedContent = article.content;
    allArticles.forEach(other => {
      const escapedTitle = other.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b(${escapedTitle})\\b`, "gi");
      linkedContent = linkedContent.replace(
        regex,
        `[[LINK:${other._id}:$1]]`
      );
    });

    res.status(200).json({
      success: true,
      article: { ...article.toObject(), linkedContent },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create article
exports.createArticle = async (req, res) => {
  try {
    const { worldId } = req.params;
    const { title, type, content, tags, date } = req.body;

    if (!(await hasAccess(worldId, req.user.id))) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const article = await Article.create({
      world: worldId,
      title,
      type,
      content,
      tags: tags || [],
      date: date || "",
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (!(await hasAccess(article.world, req.user.id))) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, article: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (!(await hasAccess(article.world, req.user.id))) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};