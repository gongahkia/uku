use serde::Deserialize;
use reqwest::blocking::Client;

#[derive(Debug, Deserialize)]
pub struct BitbucketContribution {
    pub date: String,
    pub count: u32,
}

#[derive(Debug)]
pub struct BitbucketIssue {
    pub title: String,
    pub url: String,
}

pub fn fetch_bitbucket_contributions(token: &str) -> Vec<BitbucketContribution> {
    let client = Client::new();
    let url = "https://api.bitbucket.org/2.0/repositories?role=member";
    let resp = client.get(url)
        .bearer_auth(token)
        .send();
    if resp.is_err() {
        return vec![];
    }
    let repos: serde_json::Value = resp.unwrap().json().unwrap_or_default();
    let mut contributions = Vec::new();
    if let Some(values) = repos["values"].as_array() {
        for repo in values.iter().take(5) {
            let owner = repo["owner"]["username"].as_str().unwrap_or("");
            let slug = repo["slug"].as_str().unwrap_or("");
            let url = format!("https://api.bitbucket.org/2.0/repositories/{}/{}/commits", owner, slug);
            let commits_resp = client.get(&url)
                .bearer_auth(token)
                .send();
            if let Ok(commits) = commits_resp {
                let commits_json: serde_json::Value = commits.json().unwrap_or_default();
                let count = commits_json["values"].as_array().map(|v| v.len()).unwrap_or(0);
                contributions.push(BitbucketContribution {
                    date: "recent".to_string(),
                    count: count as u32,
                });
            }
        }
    }
    contributions
}

pub fn fetch_bitbucket_issues(token: &str) -> Vec<BitbucketIssue> {
    let client = Client::new();
    let url = "https://api.bitbucket.org/2.0/repositories?role=member";
    let resp = client.get(url)
        .bearer_auth(token)
        .send();
    if resp.is_err() {
        return vec![];
    }
    let repos: serde_json::Value = resp.unwrap().json().unwrap_or_default();
    let mut issues = Vec::new();
    if let Some(values) = repos["values"].as_array() {
        for repo in values.iter().take(5) {
            let owner = repo["owner"]["username"].as_str().unwrap_or("");
            let slug = repo["slug"].as_str().unwrap_or("");
            let url = format!("https://api.bitbucket.org/2.0/repositories/{}/{}/issues?q=state=\"new\" AND kind=\"bug\"", owner, slug);
            let issues_resp = client.get(&url)
                .bearer_auth(token)
                .send();
            if let Ok(issues_json) = issues_resp {
                let issues_val: serde_json::Value = issues_json.json().unwrap_or_default();
                if let Some(arr) = issues_val["values"].as_array() {
                    for issue in arr {
                        issues.push(BitbucketIssue {
                            title: issue["title"].as_str().unwrap_or("").to_string(),
                            url: issue["links"]["html"]["href"].as_str().unwrap_or("").to_string(),
                        });
                    }
                }
            }
        }
    }
    issues
}
