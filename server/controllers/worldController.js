const World = require("../models/World");

// GET all worlds for logged in user
exports.getWorlds = async (req, res) => {
  try {
    const worlds = await World.find({
      $or: [
        { owner: req.user.id },
        { "members.user": req.user.id },
      ],
    }).populate("owner", "username email");

    res.status(200).json({ success: true, worlds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single world by id
exports.getWorld = async (req, res) => {
  try {
    const world = await World.findById(req.params.id)
      .populate("owner", "username email")
      .populate("members.user", "username email");

    if (!world) {
      return res.status(404).json({ success: false, message: "World not found" });
    }

    // check if user has access
    const isOwner = world.owner._id.toString() === req.user.id;
    const isMember = world.members.some(m => m.user._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, world });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create a new world
exports.createWorld = async (req, res) => {
  try {
    const { name, description, genre, coverColor } = req.body;

    const world = await World.create({
      name,
      description,
      genre,
      coverColor,
      owner: req.user.id,
      members: [],
    });

    res.status(201).json({ success: true, world });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update a world
exports.updateWorld = async (req, res) => {
  try {
    const world = await World.findById(req.params.id);

    if (!world) {
      return res.status(404).json({ success: false, message: "World not found" });
    }

    if (world.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Only the owner can update this world" });
    }

    const updated = await World.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, world: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a world
exports.deleteWorld = async (req, res) => {
  try {
    const world = await World.findById(req.params.id);

    if (!world) {
      return res.status(404).json({ success: false, message: "World not found" });
    }

    if (world.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Only the owner can delete this world" });
    }

    await World.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "World deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST add a map pin
exports.addMapPin = async (req, res) => {
  try {
    const world = await World.findById(req.params.id);

    if (!world) {
      return res.status(404).json({ success: false, message: "World not found" });
    }

    const isOwner = world.owner.toString() === req.user.id;
    const isMember = world.members.some(m => m.user.toString() === req.user.id);
    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { label, lat, lng, article, notes } = req.body;

    world.mapPins.push({ label, lat, lng, article: article || null, notes: notes || "" });
    await world.save();

    res.status(201).json({ success: true, world });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a map pin
exports.deleteMapPin = async (req, res) => {
  try {
    const world = await World.findById(req.params.id);

    if (!world) {
      return res.status(404).json({ success: false, message: "World not found" });
    }

    const isOwner = world.owner.toString() === req.user.id;
    if (!isOwner) {
      return res.status(403).json({ success: false, message: "Only the owner can delete pins" });
    }

    world.mapPins = world.mapPins.filter(
      pin => pin._id.toString() !== req.params.pinId
    );
    await world.save();

    res.status(200).json({ success: true, world });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST invite a member by email
exports.inviteMember = async (req, res) => {
  try {
    const world = await World.findById(req.params.id);

    if (!world) {
      return res.status(404).json({ success: false, message: "World not found" });
    }

    if (world.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Only the owner can invite members" });
    }

    const { email, role } = req.body;
    const User = require("../models/User");
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ success: false, message: "No user found with that email" });
    }

    if (userToAdd._id.toString() === world.owner.toString()) {
      return res.status(400).json({ success: false, message: "Owner is already part of this world" });
    }

    const alreadyMember = world.members.some(m => m.user.toString() === userToAdd._id.toString());
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: "User is already a member" });
    }

    world.members.push({ user: userToAdd._id, role: role || "contributor" });
    await world.save();

    const updated = await World.findById(world._id)
      .populate("owner", "username email")
      .populate("members.user", "username email");

    res.status(200).json({ success: true, world: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE remove a member
exports.removeMember = async (req, res) => {
  try {
    const world = await World.findById(req.params.id);

    if (!world) {
      return res.status(404).json({ success: false, message: "World not found" });
    }

    if (world.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Only the owner can remove members" });
    }

    world.members = world.members.filter(
      m => m.user.toString() !== req.params.memberId
    );
    await world.save();

    res.status(200).json({ success: true, world });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};