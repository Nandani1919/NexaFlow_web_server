const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;

async function check(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

const health = await check("/api/health");
const db = await check("/api/health/db");

console.log(JSON.stringify({ health, db }, null, 2));
