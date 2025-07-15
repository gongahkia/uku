const github = require('./github');
const gitlab = require('./gitlab');
const bitbucket = require('./bitbucket');

async function fetchAndAggregateIssues(platforms) {
  let allIssues = [];
  if (platforms.includes('github')) {
    const githubIssues = await github.fetchGithubIssues();
    allIssues = allIssues.concat(githubIssues);
  }
  if (platforms.includes('gitlab')) {
    const gitlabIssues = await gitlab.fetchGitlabIssues();
    allIssues = allIssues.concat(gitlabIssues);
  }
  if (platforms.includes('bitbucket')) {
    const bitbucketIssues = await bitbucket.fetchBitbucketIssues();
    allIssues = allIssues.concat(bitbucketIssues);
  }
  return allIssues;
}

module.exports = { fetchAndAggregateIssues };