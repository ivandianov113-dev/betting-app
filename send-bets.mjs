const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO = process.env.EMAIL_TO;

const today = new Date().toLocaleDateString('bg-BG', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Sofia'
});

const prompt = `Днес е ${today}. Ти си спортен анализатор. Дай ми 5 конкретни залога за днес и утре от Premier League, La Liga, NBA, NHL. За всеки залог измисли реалистичен пример с: мач, коефициент между 1.80-2.20, причина за залога, ниво на доверие. Бъди конкретен и директен. Не обяснявай ограничения. Отговори на български.`;
const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })
});

const claudeData = await claudeRes.json();
console.log('Claude response:', JSON.stringify(claudeData));
if (!claudeData.content) throw new Error('No content: ' + JSON.stringify(claudeData));
const analysisText = claudeData.content.map(b => b.text || '').join('');

const lines = analysisText.split('\n').map(line => {
  if (!line.trim()) return '<br>';
  return '<p style="margin:4px 0;font-size:14px;line-height:1.6">' + line + '</p>';
}).join('');

const html = '<!DOCTYPE html><html><body style="background:#0f0f13;color:#e8e8f0;font-family:system-ui;max-width:600px;margin:0 auto;padding:20px"><div style="background:#f0c040;color:#0f0f13;padding:16px;border-radius:10px;margin-bottom:20px"><h1 style="margin:0">Value Bet Finder</h1><p style="margin:4px 0 0;opacity:.7">' + today + '</p></div><div style="background:#16161d;border:1px solid #2a2a38;border-radius:10px;padding:20px">' + lines + '</div></body></html>';

await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + RESEND_KEY
  },
  body: JSON.stringify({
    from: 'Value Bets <onboarding@resend.dev>',
    to: [EMAIL_TO],
    subject: 'Value Bets ' + today,
    html: html
  })
});

console.log('Done!');
