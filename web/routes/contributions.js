const express = require('express');
const router = express.Router();
const contributionsController = require('../controllers/contributionsController');

// GET /api/contributions?platform=github,gitlab,bitbucket
router.get('/', contributionsController.getContributions);

module.exports = router;