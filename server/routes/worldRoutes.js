const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  getWorlds,
  getWorld,
  createWorld,
  updateWorld,
  deleteWorld,
  addMapPin,
  deleteMapPin,
  inviteMember,
  removeMember,
} = require("../controllers/worldController");

router.use(protect);

router.get("/", getWorlds);
router.get("/:id", getWorld);
router.post("/", createWorld);
router.put("/:id", updateWorld);
router.delete("/:id", deleteWorld);
router.post("/:id/pins", addMapPin);
router.delete("/:id/pins/:pinId", deleteMapPin);
router.post("/:id/invite", inviteMember);
router.delete("/:id/members/:memberId", removeMember);

module.exports = router;