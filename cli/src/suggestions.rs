use crate::api::github::GithubIssue;
use crate::api::gitlab::GitlabIssue;
use crate::api::bitbucket::BitbucketIssue;

#[derive(Debug)]
pub struct SuggestedIssue {
    pub platform: String,
    pub title: String,
    pub url: String,
}

pub fn suggest_github(issues: &[GithubIssue]) -> Vec<SuggestedIssue> {
    issues.iter().map(|i| SuggestedIssue {
        platform: "GitHub".to_string(),
        title: i.title.clone(),
        url: i.url.clone(),
    }).collect()
}

pub fn suggest_gitlab(issues: &[GitlabIssue]) -> Vec<SuggestedIssue> {
    issues.iter().map(|i| SuggestedIssue {
        platform: "GitLab".to_string(),
        title: i.title.clone(),
        url: i.url.clone(),
    }).collect()
}

pub fn suggest_bitbucket(issues: &[BitbucketIssue]) -> Vec<SuggestedIssue> {
    issues.iter().map(|i| SuggestedIssue {
        platform: "Bitbucket".to_string(),
        title: i.title.clone(),
        url: i.url.clone(),
    }).collect()
}

pub fn aggregate_suggestions(
    github: &[GithubIssue],
    gitlab: &[GitlabIssue],
    bitbucket: &[BitbucketIssue],
) -> Vec<SuggestedIssue> {
    let mut all = Vec::new();
    all.extend(suggest_github(github));
    all.extend(suggest_gitlab(gitlab));
    all.extend(suggest_bitbucket(bitbucket));
    all
}
