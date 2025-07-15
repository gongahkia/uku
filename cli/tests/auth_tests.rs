use uku::auth::{AuthConfig, load_auth_config};

#[test]
fn test_load_auth_config_valid() {
    let config = load_auth_config("config/config.toml");
    assert!(config.is_ok());
    let auth = config.unwrap();
    assert!(!auth.github_token.is_empty());
    assert!(!auth.gitlab_token.is_empty());
    assert!(!auth.bitbucket_token.is_empty());
}

#[test]
fn test_load_auth_config_invalid_path() {
    let config = load_auth_config("config/nonexistent.toml");
    assert!(config.is_err());
}
