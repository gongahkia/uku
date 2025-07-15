FROM rust:1.78-slim-bullseye

WORKDIR /uku

RUN apt-get update && \
    apt-get install -y bash && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN chmod +x scripts/setup.sh

RUN if [ ! -f config/config.toml ]; then \
      cp config/config.toml config/config.toml.example; \
    fi

EXPOSE 8080

ENTRYPOINT ["bash", "scripts/setup.sh"]
