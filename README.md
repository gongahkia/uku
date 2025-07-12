[![](https://img.shields.io/badge/uku_1.0.0-passing-green)](https://github.com/gongahkia/uku/releases/tag/1.0.0)

# `Uku`

...

## Stack

* *Script*: [Rust](https://www.rust-lang.org/)
* *Auth*: [PAT](https://en.wikipedia.org/wiki/Personal_access_token)
* *API*: [GitHub API](https://docs.github.com/en/rest), [GitLab API](https://docs.gitlab.com/api/rest/), [Bitbucket API](https://www.postman.com/api-evangelist/bitbucket/documentation/2aojru2/bitbucket)
* *Package*: [Docker](https://www.docker.com/)
* *Test*: [Rust Unit Tests](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html)

## Usage

The below instructions are for running `Uku` on your client machine.

1. Execute the below.

```console
$ git clone https://github.com/gongahkia/uku && cd uku && chmod +x scripts/setup.sh
```

2. Place your [GitHub](), [GitLab]() and [Bitbucket]() tokens within `config/config.toml`.

```toml
github_token = "XXX"
gitlab_token = "XXX"
bitbucket_token = "XXX"
```

3. Then run any of the following.

| Command | Purpose |
| :--- | :--- |
| `./scripts/setup.sh --github --show-streaks` | Show GitHub contributions |
| `./scripts/setup.sh --gitlab --show-badges` | Show GitLab contributions |
| `./scripts/setup.sh --bitbucket --show-streaks` | Show Bitbucket contributions |
| `./scripts/setup.sh --github --gitlab --bitbucket` | Aggregate all platform contributions |
| `./scripts/setup.sh suggest-issues` | List open issues |
| `cargo test` | Run all unit tests |
| `cargo test --test <test_file_name>` | Run specific test files |


## Architecture

```mermaid

```

## Reference

The name `Uku` is in reference to [Ukuleleman](https://space-dandy.fandom.com/wiki/Ukuleleman), an alien who freezes people into smiling statues with his ukulele. Ukuleleman first makes an appearance in the episode [There's Music in the Darkness, Baby](https://space-dandy.fandom.com/wiki/There%27s_Music_in_the_Darkness,_Baby) of the anime [Space Dandy](https://space-dandy.fandom.com/wiki/Space_Dandy_(anime)).

![](./asset/logo/ukuleleman.jpg)
