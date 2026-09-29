const Event = require("../models/Event");

const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Please provide event title and description"
            });
        }

        const eventData = {
            ...req.body,
            category: category || "hackathon",
            location: location || "Online",
            capacity: req.body.maxCapacity || req.body.capacity || 100,
            maxCapacity: req.body.maxCapacity || req.body.capacity || 100
        };

        const event = await Event.create(eventData);

        res.status(201).json({
            message: "Event created successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create event",
            error: error.message
        });
    }
};

const getEvents = async (req, res) => {
    try {
        const {
            search,
            category,
            location,
            eventType,
            mode,
            date
        } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { tagline: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (category && category !== "all") {
            filter.category = category;
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        if (eventType) {
            filter.eventType = eventType;
        }

        if (mode && mode !== "all") {
            filter.mode = mode;
        }

        if (date) {
            const selectedDate = new Date(date);
            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate() + 1);

            filter.date = {
                $gte: selectedDate,
                $lt: nextDate
            };
        }

        const events = await Event.find(filter).sort({ createdAt: -1 });

        res.json(events);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};

const getEventById = async (req, res) => {
    try {
        const idOrSlug = req.params.id;
        let event = null;

        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            event = await Event.findById(idOrSlug);
        }

        if (!event) {
            event = await Event.findOne({
                $or: [{ id: idOrSlug }, { slug: idOrSlug }]
            });
        }

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json(event);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update event",
            error: error.message
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(
            req.params.id
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
