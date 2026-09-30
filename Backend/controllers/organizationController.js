const Organization = require("../models/Organization");

const createOrganization = async (req, res) => {
    try {
        const {
            name,
            description,
            logo,
            location,
            website
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Organization name is required"
            });
        }

        const organization = await Organization.create({
            name,
            description,
            logo,
            location,
            website,
            createdBy: req.body.createdBy
        });

        res.status(201).json({
            message: "Organization created successfully",
            organization
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create organization",
            error: error.message
        });
    }
};

const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find()
            .populate("createdBy", "name email");

        res.json(organizations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch organizations",
            error: error.message
        });
    }
};

const getOrganizationById = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!organization) {
            return res.status(404).json({
                message: "Organization not found"
            });
        }

        res.json(organization);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch organization",
            error: error.message
        });
    }
};

const updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!organization) {
            return res.status(404).json({
                message: "Organization not found"
            });
        }

        res.json({
            message: "Organization updated successfully",
            organization
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update organization",
            error: error.message
        });
    }
};

const deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndDelete(
            req.params.id
        );

        if (!organization) {
            return res.status(404).json({
                message: "Organization not found"
            });
        }

        res.json({
            message: "Organization deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete organization",
            error: error.message
        });
    }
};

module.exports = {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization
};
