const VideoGame = require("../models/VideoGame");

exports.getCompanies = async (req, res) => {
    try {
        const companies = await VideoGame.distinct('company');
        return res.status(200).json({ status: 'success', data: { companies: companies } })
    } catch (err) {
        return res.status(500).json({ status: 'failed' });
    }
}

exports.getTypes = async (req, res) => {
    try {
        const types = await VideoGame.distinct('type');
        return res.status(200).json({ status: 'success', data: { types: types } })
    } catch (err) {
        return res.status(500).json({ status: 'failed' });
    }
}

exports.getConsoles = async (req, res) => {
    try {
        const consoles = await VideoGame.distinct('consoles');
        return res.status(200).json({ status: 'success', data: { consoles: consoles } })
    } catch (err) {
        return res.status(500).json({ status: 'failed' });
    }
}