use serde::Deserialize;
use reqwest::blocking::Client;

#[derive(Debug, Deserialize)]
pub struct GitlabContribution {
    pub date: String,
    pub count: u32,
}

#[derive(Debug)]
pub struct GitlabIssue {
    pub title: String,
    pub url: String,
}

pub fn fetch_gitlab_contributions(token: &str) -> Vec<GitlabContribution> {
    let client = Client::new();
    let url = "https://gitlab.com/api/v4/projects?membership=true";
    let resp = client.get(url)
        .header("PRIVATE-TOKEN", token)
        .send();
    if resp.is_err() {
        return vec![];
    }
    let projects: Vec<serde_json::Value> = resp.unwrap().json().unwrap_or_default();
    let mut contributions = Vec::new();
    for project in projects.iter().take(5) {
        let id = project["id"].as_u64().unwrap_or(0);
        let url = format!("https://gitlab.com/api/v4/projects/{}/repository/commits", id);
        let commits_resp = client.get(&url)
            .header("PRIVATE-TOKEN", token)
            .send();
        if let Ok(commits) = commits_resp {
            let commits_json: Vec<serde_json::Value> = commits.json().unwrap_or_default();
            contributions.push(GitlabContribution {
                date: "recent".to_string(),
                count: commits_json.len() as u32,
            });
        }
    }
    contributions
}

pub fn fetch_gitlab_issues(token: &str) -> Vec<GitlabIssue> {
    let client = Client::new();
    let url = "https://gitlab.com/api/v4/issues?scope=all&state=opened&labels=good%20first%20issue";
    let resp = client.get(url)
        .header("PRIVATE-TOKEN", token)
        .send();
    if resp.is_err() {
        return vec![];
    }
    let issues: Vec<serde_json::Value> = resp.unwrap().json().unwrap_or_default();
    issues.into_iter().map(|issue| GitlabIssue {
        title: issue["title"].as_str().unwrap_or("").to_string(),
        url: issue["web_url"].as_str().unwrap_or("").to_string(),
    }).collect()
}
