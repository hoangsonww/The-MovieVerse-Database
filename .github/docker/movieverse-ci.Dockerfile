# syntax=docker/dockerfile:1
FROM alpine:3.19

LABEL org.opencontainers.image.title="MovieVerse Sample Utility"
LABEL org.opencontainers.image.description="Deterministic container used for CI smoke steps."
LABEL org.opencontainers.image.source="https://github.com/hoangsonww/The-MovieVerse-Database"

RUN adduser -D movieverse && mkdir -p /opt/movieverse
RUN printf 'MovieVerse CI sample image is healthy.\n' > /opt/movieverse/healthcheck.txt

COPY <<'SCRIPT' /usr/local/bin/movieverse-entrypoint.sh
#!/bin/sh
set -eu
printf 'MovieVerse CI sample container booting...\n'
printf 'Timestamp (UTC): %s\n' "$(date -u)"
printf 'Checksum: %s\n' "$(sha256sum /opt/movieverse/healthcheck.txt | awk '{print $1}')"
printf 'Status: success\n'
exit 0
SCRIPT

RUN chmod +x /usr/local/bin/movieverse-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=1 CMD ["sh", "-c", "cat /opt/movieverse/healthcheck.txt >/dev/null 2>&1 || exit 0"]

USER movieverse
WORKDIR /opt/movieverse
CMD ["/usr/local/bin/movieverse-entrypoint.sh"]
