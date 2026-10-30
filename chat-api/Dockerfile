# Build from the repository root:
#   docker build -f chat-api/Dockerfile -t filip-chat-api .
# Run with the keys in an env file outside the web root, reachable only from nginx on the host:
#   docker run -d --name filip-chat-api --restart unless-stopped \
#     --env-file /etc/filip-chat/chat.env -p 127.0.0.1:3001:3001 filip-chat-api
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001 TRUST_PROXY=true

# The API runs TypeScript directly and only needs these files: no npm install, no dependencies.
RUN echo '{"type":"module"}' > package.json
COPY lib/data.ts lib/data.ts
COPY lib/chat/guards.ts lib/chat/replies.ts lib/chat/mockTransport.ts lib/chat/types.ts lib/chat/
COPY chat-api/package.json chat-api/package.json
COPY chat-api/src chat-api/src
COPY chat-api/knowledge chat-api/knowledge

USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3001/api/health || exit 1
CMD ["node", "--disable-warning=ExperimentalWarning", "chat-api/src/main.ts"]
