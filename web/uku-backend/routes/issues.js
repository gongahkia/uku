const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issuesController');

// GET /api/issues?platform=github,gitlab,bitbucket
router.get('/', issuesController.getIssues);

module.exports = router;