const User=require("../models/User");
const jwt=require("jsonwebtoken");
const sendTokenResponse=(user,statusCode, res)=>{
    const token=jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // always true in production
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(statusCode).json({
        success:true,
        user: {id: user._id, username:user.username, email:user.email, avatar: user.avatar},
    });
};
exports.register = async (req, res) => {
  try {
    console.log("Register hit with:", req.body); // 👈 add this

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    console.log("User created:", user); // 👈 add this

    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error("REGISTER ERROR:", error); // 👈 add this
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Please provide email and password" });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, message: "Invalid credentials" });
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.logout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out" });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};