const User = require('../models/user.js');
const Challenge = require('../models/challenge.js'); // Make sure you have this model

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all suggested challenges
exports.getAllChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find();
        return res.json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a challenge by ID
exports.deleteChallengeById = async (req, res) => {
    try {
        const { id } = req.params;
        await Challenge.findByIdAndDelete(id);
        return res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.admin = async (req, res) => {
    try {
        const users = await User.find({})
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        return res.status(500).send('Internal Server Error');
    }
}