FROM ubuntu:22.04

# Install interpreter dependencies
RUN apt-get update && apt-get install -y \
    libstdc++6 \
    ca-certificates \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the flex binary to the interpreter stage
COPY . /app/interpreter/
RUN chmod +x /app/interpreter/flexa

# create non-root user
RUN useradd -m -u 1000 runner \
 && chown -R runner:runner /app

# drop to non-root user (container will run as runner)
USER runner
