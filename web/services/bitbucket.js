const axios = require('axios');

const BITBUCKET_API_BASE = 'https://api.bitbucket.org/2.0';
const BITBUCKET_TOKEN = process.env.BITBUCKET_TOKEN || '';

async function fetchBitbucketContributions() {
  try {
    const reposResp = await axios.get(`${BITBUCKET_API_BASE}/repositories?role=member`, {
      headers: {
        'Authorization': `Bearer ${BITBUCKET_TOKEN}`,
      },
    });
    const repos = reposResp.data.values.slice(0, 5);
    const contributions = [];
    for (const repo of repos) {
      const commitsResp = await axios.get(`${BITBUCKET_API_BASE}/repositories/${repo.owner.username}/${repo.slug}/commits`, {
        headers: {
          'Authorization': `Bearer ${BITBUCKET_TOKEN}`,
        },
      });
      contributions.push({
        platform: 'Bitbucket',
        date: 'recent',
        count: commitsResp.data.values.length,
      });
    }
    return contributions;
  } catch (error) {
    console.error('Bitbucket fetch error:', error.message);
    return [];
  }
}

async function fetchBitbucketIssues() {
  try {
    const reposResp = await axios.get(`${BITBUCKET_API_BASE}/repositories?role=member`, {
      headers: {
        'Authorization': `Bearer ${BITBUCKET_TOKEN}`,
      },
    });
    const repos = reposResp.data.values.slice(0, 5);
    const issues = [];
    for (const repo of repos) {
      const issuesResp = await axios.get(`${BITBUCKET_API_BASE}/repositories/${repo.owner.username}/${repo.slug}/issues?q=state="new" AND kind="bug"`, {
        headers: {
          'Authorization': `Bearer ${BITBUCKET_TOKEN}`,
        },
      });
      for (const issue of issuesResp.data.values) {
        issues.push({
          platform: 'Bitbucket',
          title: issue.title || '',
          url: issue.links.html.href || '',
        });
      }
    }
    return issues;
  } catch (error) {
    console.error('Bitbucket issues fetch error:', error.message);
    return [];
  }
}

module.exports = { fetchBitbucketContributions, fetchBitbucketIssues };