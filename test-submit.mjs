import fs from 'fs';
const req = await fetch('http://localhost:3000/api/project/861a3bd3-8b9d-42fb-a4a2-68f5c942363a/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ loadin_text: 'Test reader text' })
});
console.log(req.status);
console.log(await req.text());
