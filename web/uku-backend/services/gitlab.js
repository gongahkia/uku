const axios = require('axios');

const GITLAB_API_BASE = 'https://gitlab.com/api/v4';
const GITLAB_TOKEN = process.env.GITLAB_TOKEN || '';

async function fetchGitlabContributions() {
  try {
    const projectsResp = await axios.get(`${GITLAB_API_BASE}/projects?membership=true`, {
      headers: {
        'PRIVATE-TOKEN': GITLAB_TOKEN,
      },
    });
    const projects = projectsResp.data.slice(0, 5);
    const contributions = [];
    for (const project of projects) {
      const commitsResp = await axios.get(`${GITLAB_API_BASE}/projects/${project.id}/repository/commits`, {
        headers: {
          'PRIVATE-TOKEN': GITLAB_TOKEN,
        },
      });
      contributions.push({
        platform: 'GitLab',
        date: 'recent',
        count: commitsResp.data.length,
      });
    }
    return contributions;
  } catch (error) {
    console.error('GitLab fetch error:', error.message);
    return [];
  }
}

async function fetchGitlabIssues() {
  try {
    const issuesResp = await axios.get(`${GITLAB_API_BASE}/issues?scope=all&state=opened&labels=good%20first%20issue`, {
      headers: {
        'PRIVATE-TOKEN': GITLAB_TOKEN,
      },
    });
    return issuesResp.data.map(issue => ({
      platform: 'GitLab',
      title: issue.title || '',
      url: issue.web_url || '',
    }));
  } catch (error) {
    console.error('GitLab issues fetch error:', error.message);
    return [];
  }
}

module.exports = { fetchGitlabContributions, fetchGitlabIssues };