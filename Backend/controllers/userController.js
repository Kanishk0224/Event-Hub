const User = require("../models/User");

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const {
            name,
            interests,
            location,
            profileImage
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                interests,
                location,
                profileImage
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update user",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        let user = null;

        // Try find by MongoDB ObjectId if valid format
        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findByIdAndDelete(id);
        }

        // If not found or not an ObjectId, try finding by email
        if (!user && id) {
            user = await User.findOneAndDelete({ email: id.toLowerCase() });
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully",
            deletedUser: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};