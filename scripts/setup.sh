#!/bin/bash

set -e

if ! command -v cargo &> /dev/null; then
    echo "Cargo (Rust) not found. Please install Rust and Cargo first."
    exit 1
fi

if [ ! -f "Cargo.toml" ]; then
    echo "Cargo.toml not found. Please run this script from the root of the uku repository."
    exit 1
fi

if [ ! -f "config/config.toml" ]; then
    echo "config/config.toml not found. Please copy and edit config/config.toml with your tokens."
    exit 1
fi

echo "Building uku..."
cargo build --release

echo "Running uku..."
cargo run --release "$@"
