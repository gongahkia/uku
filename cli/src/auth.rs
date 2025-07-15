use serde::Deserialize;
use std::fs;

#[derive(Debug, Deserialize)]
pub struct AuthConfig {
    pub github_token: String,
    pub gitlab_token: String,
    pub bitbucket_token: String,
}

pub fn load_auth_config(path: &str) -> Result<AuthConfig, Box<dyn std::error::Error>> {
    let content = fs::read_to_string(path)?;
    let config: AuthConfig = toml::from_str(&content)?;
    Ok(config)
}
