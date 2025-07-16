[![](https://img.shields.io/badge/uku_1.0.0-passing-green)](https://github.com/gongahkia/uku/releases/tag/1.0.0)
[![](https://img.shields.io/badge/uku_2.0.0-passing-ligh_green)](https://github.com/gongahkia/uku/releases/tag/2.0.0)

# `Uku`

Unified [CLI](./cli/) tool and [Web App](./web/uku-app) for aggregating, analyzing, and visualizing [open-source](https://en.wikipedia.org/wiki/Open-source_software) contributions *(streaks, badges, issues)* across [GitHub](https://github.com/), [GitLab](https://about.gitlab.com/), and [Bitbucket](https://bitbucket.org/product/).

Made mostly to practise [the stack](#stack).

## Stack

* *Script*: [Rust](https://www.rust-lang.org/), [Bash](https://www.gnu.org/software/bash/)
* *Frontend*: [React](https://react.dev/), [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/)
* *Backend*: [Node.js](https://nodejs.org/en), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* *DB*: [Firebase Realtime Database](https://firebase.google.com/docs/database)
* *Auth*: [PAT](https://en.wikipedia.org/wiki/Personal_access_token)
* *API*: [GitHub API](https://docs.github.com/en/rest), [GitLab API](https://docs.gitlab.com/api/rest/), [Bitbucket API](https://www.postman.com/api-evangelist/bitbucket/documentation/2aojru2/bitbucket)
* *Package*: [Docker](https://www.docker.com/)

## Usage

The below instructions are for running `Uku` on your client machine.

### CLI

1. Execute the below.

```console
$ git clone https://github.com/gongahkia/uku && cd uku/cli && chmod +x scripts/setup.sh
```

2. Place your [GitHub](https://github.com/), [GitLab](https://gitlab.com/) and [Bitbucket](https://bitbucket.org/product/) tokens within `./cli/config/config.toml`.

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

4. Optionally build `Uku` as a [Docker Image](./Dockerfile) by running the following.

```console
$ docker build -t uku .
```

### Web App

1. Execute the below.

```console
$ git clone https://github.com/gongahkia/uku && cd uku/web/uku-app && npm i
```

2. Place your [GitHub](https://github.com/), [GitLab](https://gitlab.com/) and [Bitbucket](https://bitbucket.org/product/) tokens within `./web/uku-app/.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_OAUTH_GITHUB_CLIENT_ID=XXX
NEXT_PUBLIC_OAUTH_GITLAB_CLIENT_ID=XXX
NEXT_PUBLIC_OAUTH_BITBUCKET_CLIENT_ID=XXX

NEXT_PUBLIC_APP_NAME=Uku
NEXT_PUBLIC_APP_DESCRIPTION="Unified Open-Source Contribution Aggregator"
```

3. Then build `Uku` by running the below.

```console
$ cd web
$ docker build -t uku-web . && docker run -p 3000:3000 uku-web
```

## Architecture

### CLI

```mermaid
flowchart TD
    subgraph User Environment
        CLI[User CLI]
        ConfigFile[config/config.toml]
        SetupScript[scripts/setup.sh]
    end

    subgraph Docker["Docker Container (optional)"]
        DockerApp[uku App]
    end

    subgraph App["uku Application (Rust)"]
        Main[src/main.rs]
        Auth[src/auth.rs]
        Utils[src/utils.rs]
        DataProcessing[src/data_processing.rs]
        Visualization[src/visualization.rs]
        Suggestions[src/suggestions.rs]
        subgraph API
            Github[src/api/github.rs]
            Gitlab[src/api/gitlab.rs]
            Bitbucket[src/api/bitbucket.rs]
        end
        Tests[tests/]
    end

    subgraph External["External Services"]
        GitHubAPI[GitHub API]
        GitLabAPI[GitLab API]
        BitbucketAPI[Bitbucket API]
    end

    CLI -->|reads| ConfigFile
    CLI -->|runs| SetupScript
    SetupScript -->|builds/runs| Main
    DockerApp -->|runs| SetupScript
    DockerApp -->|mounts| ConfigFile

    Main --> Auth
    Main --> API
    Main --> DataProcessing
    Main --> Visualization
    Main --> Suggestions
    Main --> Utils

    Auth -->|loads tokens| ConfigFile
    Auth --> Main

    API --> Github
    API --> Gitlab
    API --> Bitbucket

    Github -->|uses token| Auth
    Gitlab -->|uses token| Auth
    Bitbucket -->|uses token| Auth

    Github -->|REST calls| GitHubAPI
    Gitlab -->|REST calls| GitLabAPI
    Bitbucket -->|REST calls| BitbucketAPI

    Github --> DataProcessing
    Gitlab --> DataProcessing
    Bitbucket --> DataProcessing

    DataProcessing --> Visualization
    DataProcessing --> Suggestions

    Suggestions --> Main
    Visualization --> Main

    Tests -.-> Main
    Tests -.-> Auth
    Tests -.-> API
    Tests -.-> DataProcessing
    Tests -.-> Visualization
    Tests -.-> Suggestions
```

### Web App

```mermaid
flowchart TD
    %% ===== USER ENVIRONMENT =====
    subgraph User
        Browser[Frontend App Next.js]
        UserPrefs[User Preferences]
    end

    %% ===== FRONTEND =====
    subgraph Frontend["Vercel Deployment (Next.js / TailwindCSS)"]
        Layout[layout.tsx / globals.css]
        Pages["App Pages (app/)"]
        Components["Shared UI Components (components/)"]
        ThemeProvider
        BadgesList
        ContributionGraph
        IssuesList
        Toast[Notifications Sonner]
        APIClient["Client Fetch (lib/api.ts)"]
    end

    %% ===== BACKEND =====
    subgraph Backend["Heroku Deployment (Express Server)"]
        IndexJS[index.js / server entry]
        API["API Routes (/api/...)"]
        ContributionsAPI[GET /api/contributions]
        IssuesAPI[GET /api/issues]
        Services["Service Layer (/services)"]
        GitHubSvc[GitHub Service]
        GitLabSvc[GitLab Service]
        BitbucketSvc[Bitbucket Service]
    end

    %% ===== DATABASE & AUTH =====
    subgraph Firebase["Firebase Services"]
        Firestore[Firestore DB]
        FirebaseAuth[(Firebase Auth)]
    end

    %% ===== EXTERNAL SOURCES =====
    subgraph External["Open Source Platform APIs"]
        GitHubAPI[(GitHub API)]
        GitLabAPI[(GitLab API)]
        BitbucketAPI[(Bitbucket API)]
    end

    %% ===== DATA FLOW =====
    Browser -->|renders| Frontend
    Pages --> Layout
    Pages --> Components
    Components --> ThemeProvider
    Components --> ContributionGraph & BadgesList & IssuesList
    ThemeProvider --> Layout
    
    Browser -->|Fetch user data| APIClient
    APIClient --> ContributionsAPI
    APIClient --> IssuesAPI

    ContributionsAPI --> GitHubSvc
    ContributionsAPI --> GitLabSvc
    ContributionsAPI --> BitbucketSvc

    IssuesAPI --> GitHubSvc
    IssuesAPI --> GitLabSvc
    IssuesAPI --> BitbucketSvc

    GitHubSvc -->|uses token| FirebaseAuth
    GitLabSvc -->|uses token| FirebaseAuth
    BitbucketSvc -->|uses token| FirebaseAuth

    GitHubSvc -->|calls| GitHubAPI
    GitLabSvc -->|calls| GitLabAPI
    BitbucketSvc -->|calls| BitbucketAPI

    ContributionsAPI --> Firestore
    IssuesAPI --> Firestore
    Browser -->|reads user state| FirebaseAuth
    Browser -->|reads badge progress| Firestore

    FirebaseAuth --> UserPrefs
    Firestore --> UserPrefs

    Toast --> Layout
    Toast --> Components
```

## Reference

The name `Uku` is in reference to [Ukuleleman](https://space-dandy.fandom.com/wiki/Ukuleleman), an alien who freezes people into smiling statues with his ukulele. Ukuleleman first makes an appearance in the episode [There's Music in the Darkness, Baby](https://space-dandy.fandom.com/wiki/There%27s_Music_in_the_Darkness,_Baby) of the anime [Space Dandy](https://space-dandy.fandom.com/wiki/Space_Dandy_(anime)).

![](./asset/logo/ukuleleman.jpg)