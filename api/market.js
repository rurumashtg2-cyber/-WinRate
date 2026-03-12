export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const symbols = req.query.symbols || '^IXIC,^DJI,^GSPC,^RUT,ES=F,CL=F,GC=F,DX-Y.NYB,^TNX,^IRX,^VIX,^VVIX';
  const url = `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(symbols)}&range=1d&interval=5m`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });
    if (!r.ok) throw new Error(`Yahoo returned ${r.status}`);
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
