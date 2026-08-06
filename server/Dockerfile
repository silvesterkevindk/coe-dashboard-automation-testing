# ---------- API server (Express + SQLite) ----------
# node:20-slim (Debian) agar prebuild better-sqlite3 tersedia (hindari isu musl/alpine)
FROM node:20-slim
WORKDIR /app

# Install dependency (better-sqlite3 akan pakai prebuilt binary)
COPY package*.json ./
RUN npm install --omit=dev

# Kode server saja
COPY server ./server

ENV API_PORT=4000
ENV DB_PATH=/data/qa-dashboard.db

# File database disimpan di volume /data agar persisten
VOLUME ["/data"]
EXPOSE 4000

CMD ["node", "server/index.js"]
