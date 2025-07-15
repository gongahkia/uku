use crate::api::github::GithubContribution;
use crate::api::gitlab::GitlabContribution;
use crate::api::bitbucket::BitbucketContribution;

#[derive(Debug)]
pub struct NormalizedContribution {
    pub platform: String,
    pub date: String,
    pub count: u32,
}

pub fn normalize_github_contributions(contribs: &[GithubContribution]) -> Vec<NormalizedContribution> {
    contribs.iter().map(|c| NormalizedContribution {
        platform: "GitHub".to_string(),
        date: c.date.clone(),
        count: c.count,
    }).collect()
}

pub fn normalize_gitlab_contributions(contribs: &[GitlabContribution]) -> Vec<NormalizedContribution> {
    contribs.iter().map(|c| NormalizedContribution {
        platform: "GitLab".to_string(),
        date: c.date.clone(),
        count: c.count,
    }).collect()
}

pub fn normalize_bitbucket_contributions(contribs: &[BitbucketContribution]) -> Vec<NormalizedContribution> {
    contribs.iter().map(|c| NormalizedContribution {
        platform: "Bitbucket".to_string(),
        date: c.date.clone(),
        count: c.count,
    }).collect()
}

pub fn aggregate_contributions(
    github: &[GithubContribution],
    gitlab: &[GitlabContribution],
    bitbucket: &[BitbucketContribution],
) -> Vec<NormalizedContribution> {
    let mut all = Vec::new();
    all.extend(normalize_github_contributions(github));
    all.extend(normalize_gitlab_contributions(gitlab));
    all.extend(normalize_bitbucket_contributions(bitbucket));
    all
}

pub fn total_contributions(contribs: &[NormalizedContribution]) -> u32 {
    contribs.iter().map(|c| c.count).sum()
}

pub fn streaks(contribs: &[NormalizedContribution]) -> u32 {
    use std::collections::HashSet;
    let mut days = HashSet::new();
    for c in contribs {
        days.insert(c.date.clone());
    }
    days.len() as u32
}
