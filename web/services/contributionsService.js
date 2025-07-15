const github = require('./github');
const gitlab = require('./gitlab');
const bitbucket = require('./bitbucket');

function normalizeContributions(contribs, platform) {
  return contribs.map(c => ({
    platform: platform,
    date: c.date || 'recent',
    count: c.count || 0,
  }));
}

async function fetchAndAggregateContributions(platforms) {
  let allContributions = [];
  if (platforms.includes('github')) {
    const githubContribs = await github.fetchGithubContributions();
    allContributions = allContributions.concat(normalizeContributions(githubContribs, 'GitHub'));
  }
  if (platforms.includes('gitlab')) {
    const gitlabContribs = await gitlab.fetchGitlabContributions();
    allContributions = allContributions.concat(normalizeContributions(gitlabContribs, 'GitLab'));
  }
  if (platforms.includes('bitbucket')) {
    const bitbucketContribs = await bitbucket.fetchBitbucketContributions();
    allContributions = allContributions.concat(normalizeContributions(bitbucketContribs, 'Bitbucket'));
  }
  return allContributions;
}

module.exports = { fetchAndAggregateContributions };