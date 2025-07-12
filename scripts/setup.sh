#!/bin/bash
if ! command -v cargo &> /dev/null
then
    echo "Cargo (Rust) is not installed. Please install Rust and Cargo first."
    exit 1
fi

if [ ! -f "Cargo.toml" ]; then
    cargo init --bin .
fi

mkdir -p src/api config tests scripts
touch src/main.rs src/auth.rs src/data_processing.rs src/visualization.rs src/suggestions.rs src/utils.rs
touch src/api/github.rs src/api/gitlab.rs src/api/bitbucket.rs
touch config/config.toml
touch tests/auth_tests.rs tests/api_tests.rs tests/data_processing_tests.rs tests/visualization_tests.rs

echo "uku project structure initialized."
