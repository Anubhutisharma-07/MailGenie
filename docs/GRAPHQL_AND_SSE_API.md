# ⚡ GraphQL & SSE Fallback Streaming Architecture

This document describes the **GraphQL Data Layer** and **Server-Sent Events (SSE) Fallback** introduced in MailGenie.

---

## 1. GraphQL API Endpoint

MailGenie exposes a unified GraphQL endpoint to optimize network overhead and eliminate over-fetching:

- **GraphQL Endpoint:** `POST /graphql`
- **Schema Explorer:** `http://localhost:8080/graphiql`

### Querying Custom Templates
```graphql
query FetchTemplates {
  getTemplates(category: "Business") {
    id
    title
    tone
    content
  }
}
```

### Executing AI Generation Mutation
```graphql
mutation GenerateReply {
  generateEmail(input: {
    emailContent: "Can we reschedule our sync to Thursday at 3 PM?"
    tone: "Professional"
    provider: "GROQ"
  }) {
    reply
    provider
    executionTimeMs
  }
}
```

---

## 2. Server-Sent Events (SSE) Stream Endpoint

For clients operating in restricted corporate networks where WebSocket handshakes (`ws://` / `wss://`) are blocked, MailGenie exposes an SSE endpoint:

- **Endpoint:** `POST /api/email/stream/sse`
- **Content-Type:** `text/event-stream`

### Client Event Ingestion
```javascript
const response = await fetch('/api/email/stream/sse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailContent: 'Meeting followup', tone: 'Friendly' })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log('Stream chunk:', decoder.decode(value));
}
```
