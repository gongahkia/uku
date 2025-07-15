const contributionsService = require('../services/contributionsService');

exports.getContributions = async (req, res) => {
  try {
    const platforms = req.query.platform ? req.query.platform.split(',') : ['github', 'gitlab', 'bitbucket'];
    const data = await contributionsService.fetchAndAggregateContributions(platforms);
    res.json(data);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
};