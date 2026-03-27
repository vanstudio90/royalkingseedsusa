import https from 'https';
import fs from 'fs';

const CK = 'ck_eaebc51974435cef365360b9146bc424a3e02276';
const CS = 'cs_c17b3619f6cd11ce1a468fa947bd0088e0d4409a';
const BASE = 'https://bcseedstores.com/wp-json/wc/v3';

function wcGet(ep, params = {}) {
  params.consumer_key = CK;
  params.consumer_secret = CS;
  const qs = Object.entries(params).map(([k,v]) => k+'='+encodeURIComponent(v)).join('&');
  const url = BASE + '/' + ep + '?' + qs;
  return new Promise((resolve, reject) => {
    https.get(url, {headers:{'User-Agent':'Mozilla/5.0'}}, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch(e) { resolve([]); } // Return empty on parse error
      });
    }).on('error', () => resolve([]));
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  // Fetch all WC products
  let allWc = [];
  for (let pg = 1; pg < 20; pg++) {
    const batch = await wcGet('products', {per_page: 100, page: pg, status: 'publish'});
    if (!Array.isArray(batch) || !batch.length) break;
    allWc.push(...batch);
    process.stdout.write(`pg${pg}:${batch.length} `);
    await sleep(500);
  }
  console.log(`\nWC total: ${allWc.length}`);

  const our = JSON.parse(fs.readFileSync('src/lib/products/products-ca-raw.json', 'utf8'));
  const missing = our.filter(p => p.status === 'published' && !p.slug.includes('wholesale') && !p.sku);
  console.log(`Missing SKUs: ${missing.length}`);

  const norm = n => n.toLowerCase().replace(/ cannabis seeds/g,'').replace(/[^a-z0-9]/g,'');
  const wcMap = {};
  allWc.forEach(p => { wcMap[norm(p.name)] = p; });

  const results = [];
  const noMatch = [];
  const seen = {};
  let count = 0;

  for (const p of missing) {
    const slug = p.slug;
    const base = slug.replace(/-feminized$/,'').replace(/-auto$/,'');
    const isAuto = slug.endsWith('-auto');
    const n = base.replace(/[^a-z0-9]/g,'');
    const wc = wcMap[n];

    if (!wc) { noMatch.push(slug); continue; }
    const wcId = wc.id;

    if (!seen[wcId]) {
      let vars = [];
      try {
        vars = await wcGet(`products/${wcId}/variations`, {per_page: 100});
        if (!Array.isArray(vars)) vars = [];
        await sleep(350);
      } catch(e) { vars = []; }

      let femSku = '', autoSku = '';
      for (const v of vars) {
        const sk = v.sku || '';
        if (!sk) continue;
        const attrs = {};
        (v.attributes || []).forEach(a => { attrs[a.name.toLowerCase()] = (a.option||'').toLowerCase(); });
        const ft = attrs['flowering type'] || attrs['flowering-type'] || '';

        if (ft.includes('auto')) { if (!autoSku) autoSku = sk; }
        else if (ft.includes('fem') || ft.includes('photo')) { if (!femSku) femSku = sk; }
        else {
          const parts = sk.split('-');
          const last = parts[parts.length - 1];
          const digits = last.match(/\d+/);
          if (digits) {
            if (parseInt(digits[0]) % 2 === 0) { if (!autoSku) autoSku = sk; }
            else { if (!femSku) femSku = sk; }
          }
        }
      }
      seen[wcId] = { f: femSku, a: autoSku, p: wc.sku, n: wc.name };
      count++;
      if (count % 100 === 0) console.log(`Fetched variations: ${count}`);
    }

    const info = seen[wcId];
    const sku = isAuto ? (info.a || info.p) : (info.f || info.p);
    results.push([slug, sku, info.n]);
  }

  console.log(`\nFound: ${results.length}  NoMatch: ${noMatch.length}`);

  let csv = 'Our_Slug,SKU,WC_Name\n';
  results.sort((a,b) => a[0].localeCompare(b[0]));
  results.forEach(([s,k,n]) => { csv += `${s},${k},"${n}"\n`; });
  fs.writeFileSync('scripts/missing-skus-found.csv', csv);
  fs.writeFileSync('scripts/no-wc-match.csv', noMatch.sort().join('\n'));
  console.log('Saved scripts/missing-skus-found.csv and scripts/no-wc-match.csv');
}

main().catch(e => console.error(e));
