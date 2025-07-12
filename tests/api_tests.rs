use uku::api::github::{fetch_github_contributions, fetch_github_issues};
use uku::api::gitlab::{fetch_gitlab_contributions, fetch_gitlab_issues};
use uku::api::bitbucket::{fetch_bitbucket_contributions, fetch_bitbucket_issues};

#[test]
fn test_fetch_github_contributions_empty_token() {
    let result = fetch_github_contributions("");
    assert!(result.is_empty());
}

#[test]
fn test_fetch_gitlab_contributions_empty_token() {
    let result = fetch_gitlab_contributions("");
    assert!(result.is_empty());
}

#[test]
fn test_fetch_bitbucket_contributions_empty_token() {
    let result = fetch_bitbucket_contributions("");
    assert!(result.is_empty());
}

#[test]
fn test_fetch_github_issues_empty_token() {
    let result = fetch_github_issues("");
    assert!(result.is_empty());
}

#[test]
fn test_fetch_gitlab_issues_empty_token() {
    let result = fetch_gitlab_issues("");
    assert!(result.is_empty());
}

#[test]
fn test_fetch_bitbucket_issues_empty_token() {
    let result = fetch_bitbucket_issues("");
    assert!(result.is_empty());
}
