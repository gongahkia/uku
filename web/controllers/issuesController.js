const issuesService = require('../services/issuesService');

exports.getIssues = async (req, res) => {
  try {
    const platforms = req.query.platform ? req.query.platform.split(',') : ['github', 'gitlab', 'bitbucket'];
    const data = await issuesService.fetchAndAggregateIssues(platforms);
    res.json(data);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};