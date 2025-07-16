const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

async function fetchGithubContributions() {
  try {
    const reposResp = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'uku',
      },
    });
    const repos = reposResp.data.slice(0, 5);
    const contributions = [];
    for (const repo of repos) {
      const commitsResp = await axios.get(`${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/commits`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'uku',
        },
      });
      contributions.push({
        platform: 'GitHub',
        date: 'recent',
        count: commitsResp.data.length,
      });
    }
    return contributions;
  } catch (error) {
    console.error('GitHub fetch error:', error.message);
    return [];
  }
}

async function fetchGithubIssues() {
  try {
    const issuesResp = await axios.get(`${GITHUB_API_BASE}/issues?filter=all&state=open&labels=good%20first%20issue`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'uku',
      },
    });
    return issuesResp.data.map(issue => ({
      platform: 'GitHub',
      title: issue.title || '',
      url: issue.html_url || '',
    }));
  } catch (error) {
    console.error('GitHub issues fetch error:', error.message);
    return [];
  }
}

module.exports = { fetchGithubContributions, fetchGithubIssues };