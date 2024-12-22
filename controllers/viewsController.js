const Views = require('../models/Views');

// Get view count for a specific section
exports.getViews = async (req, res) => {
    const { section } = req.params;
    try {
        let views = await Views.findOne({ section });
        if (!views) {
            views = await Views.create({ section, count: 0 });
        }
        res.json({ count: views.count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching views' });
    }
};

// Increment view count for a specific section
exports.incrementViews = async (req, res) => {
    const { section } = req.params;
    try {
        let views = await Views.findOne({ section });
        if (!views) {
            views = await Views.create({ section, count: 1 });
        } else {
            views.count += 1;
            await views.save();
        }
        res.json({ count: views.count });
    } catch (error) {
        res.status(500).json({ error: 'Error incrementing views' });
    }
}; 