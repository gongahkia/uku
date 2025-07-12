use clap::{App, Arg, SubCommand};
use crate::auth::{AuthConfig, load_auth_config};
use crate::api::github::{fetch_github_contributions, fetch_github_issues};
use crate::api::gitlab::{fetch_gitlab_contributions, fetch_gitlab_issues};
use crate::api::bitbucket::{fetch_bitbucket_contributions, fetch_bitbucket_issues};

mod auth;
mod api;

fn main() {
    let matches = App::new("uku")
        .version("1.0")
        .author("uku contributors")
        .about("Unified open source contribution tracker")
        .arg(Arg::with_name("github").long("github").help("Fetch from GitHub"))
        .arg(Arg::with_name("gitlab").long("gitlab").help("Fetch from GitLab"))
        .arg(Arg::with_name("bitbucket").long("bitbucket").help("Fetch from Bitbucket"))
        .arg(Arg::with_name("show-streaks").long("show-streaks").help("Show contribution streaks"))
        .arg(Arg::with_name("show-badges").long("show-badges").help("Show badges"))
        .subcommand(SubCommand::with_name("suggest-issues").about("Recommend issues to tackle"))
        .get_matches();

    let auth = load_auth_config("config/config.toml").expect("Failed to load auth config");

    if matches.is_present("github") {
        let contribs = fetch_github_contributions(&auth.github_token);
        println!("GitHub contributions: {:?}", contribs);
    }
    if matches.is_present("gitlab") {
        let contribs = fetch_gitlab_contributions(&auth.gitlab_token);
        println!("GitLab contributions: {:?}", contribs);
    }
    if matches.is_present("bitbucket") {
        let contribs = fetch_bitbucket_contributions(&auth.bitbucket_token);
        println!("Bitbucket contributions: {:?}", contribs);
    }
    if let Some(_) = matches.subcommand_matches("suggest-issues") {
        let mut issues = Vec::new();
        if !auth.github_token.is_empty() {
            issues.extend(fetch_github_issues(&auth.github_token));
        }
        if !auth.gitlab_token.is_empty() {
            issues.extend(fetch_gitlab_issues(&auth.gitlab_token));
        }
        if !auth.bitbucket_token.is_empty() {
            issues.extend(fetch_bitbucket_issues(&auth.bitbucket_token));
        }
        println!("Suggested issues:");
        for issue in issues {
            println!("- {} [{}]", issue.title, issue.url);
        }
    }
}
