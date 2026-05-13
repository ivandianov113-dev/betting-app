const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO = process.env.EMAIL_TO;

const today = new Date().toLocaleDateString('bg-BG', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Sofia'
});

const prompt = `Днес е ${today}. Намери VALUE BETS за следващите 24 часа в: Футбол (Premier League, La Liga, Bundesliga, Serie A, UCL), NBA, NHL, PGA Tour. Коефициент 1.80–2.20, edge 8%+. За всеки залог: мач, лига, дата, залог, Bet365 коеф., пазарен среден, edge%, причина, доверие, риск. Минимум 4-5 бона. На БЪЛГАРСКИ.`;

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
const analysisText = claudeData.content?.map(b => b.text || '').join('') || 'Няма резултати.';

const htmlLines = analysisText.split('\n').map(line => {
  if (line.startsWith('⚡')) return `<h2 style="color:#f0c040;margin-top:20px">${line}</h2>`;
  if (line.startsWith('---')) return '<hr style="border-color:#333;margin:12px 0">';
  if (!line.trim()) return '<br>';
  return `<p style="margin:3px 0;font-size:14px;line-height:1.6">${line}</p>`;
}).join('');

const emailHtml = `<!DOCTYPE html><html><body style="background:#0f0f13;color:#e8e8f0;font-family:system-ui;max-width:600px;margin:0 auto;padding:20px">
<div style="backgr
