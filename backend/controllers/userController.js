const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const { email, password, name, role, school, grade } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      name,
      role,
      school: role !== 'admin' ? school : undefined,
      grade: role === 'student' ? grade : undefined,
    });

    const createdUser = await User.findById(user._id).select('-password').populate('school');
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('school');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, getUsers };
