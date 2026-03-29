const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function fetchBacklinks(domain) {
  const res = await fetch(`${API_URL}/api/backlinks?domain=${encodeURIComponent(domain)}`);
  return res.json();
}

export async function fetchKeywords(keyword) {
  const res = await fetch(`${API_URL}/api/keywords?keyword=${encodeURIComponent(keyword)}`);
  return res.json();
}

export async function fetchAudits(url) {
  const res = await fetch(`${API_URL}/api/audits?url=${encodeURIComponent(url)}`);
  return res.json();
}

export async function fetchRanks(keyword, domain) {
  const res = await fetch(`${API_URL}/api/ranks?keyword=${encodeURIComponent(keyword)}&domain=${encodeURIComponent(domain)}`);
  return res.json();
}
