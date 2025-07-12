use serde::Deserialize;
use reqwest::blocking::Client;

#[derive(Debug, Deserialize)]
pub struct GithubContribution {
    pub date: String,
    pub count: u32,
}

#[derive(Debug)]
pub struct GithubIssue {
    pub title: String,
    pub url: String,
}

pub fn fetch_github_contributions(token: &str) -> Vec<GithubContribution> {
    let client = Client::new();
    let url = "https://api.github.com/user/repos";
    let resp = client.get(url)
        .header("User-Agent", "uku")
        .bearer_auth(token)
        .send();
    if resp.is_err() {
        return vec![];
    }
    let repos: Vec<serde_json::Value> = resp.unwrap().json().unwrap_or_default();
    let mut contributions = Vec::new();
    for repo in repos.iter().take(5) {
        let name = repo["name"].as_str().unwrap_or("");
        let owner = repo["owner"]["login"].as_str().unwrap_or("");
        let url = format!("https://api.github.com/repos/{}/{}/commits", owner, name);
        let commits_resp = client.get(&url)
            .header("User-Agent", "uku")
            .bearer_auth(token)
            .send();
        if let Ok(commits) = commits_resp {
            let commits_json: Vec<serde_json::Value> = commits.json().unwrap_or_default();
            contributions.push(GithubContribution {
                date: "recent".to_string(),
                count: commits_json.len() as u32,
            });
        }
    }
    contributions
}

pub fn fetch_github_issues(token: &str) -> Vec<GithubIssue> {
    let client = Client::new();
    let url = "https://api.github.com/issues?filter=all&state=open&labels=good%20first%20issue";
    let resp = client.get(url)
        .header("User-Agent", "uku")
        .bearer_auth(token)
        .send();
    if resp.is_err() {
        return vec![];
    }
    let issues: Vec<serde_json::Value> = resp.unwrap().json().unwrap_or_default();
    issues.into_iter().map(|issue| GithubIssue {
        title: issue["title"].as_str().unwrap_or("").to_string(),
        url: issue["html_url"].as_str().unwrap_or("").to_string(),
    }).collect()
}
