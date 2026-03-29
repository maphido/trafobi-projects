#!/bin/sh
# Ensure upload directories exist and are writable by nextjs (uid 1001)
mkdir -p /app/uploads/thumbnails
chown -R 1001:1001 /app/uploads

# Drop to nextjs user and start the app
exec su-exec nextjs node server.js
