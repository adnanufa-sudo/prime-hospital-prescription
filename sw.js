const HOME='/home.html';
const SKIP=['/print-prescription.html'];
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.mode!=='navigate') return;
  const u=new URL(r.url);
  if(u.origin!==self.location.origin||SKIP.includes(u.pathname)) return;
  e.respondWith((async()=>{
    const res=await fetch(r);
    const type=res.headers.get('content-type')||'';
    if(!type.includes('text/html')) return res;
    let html=await res.text();
    if(html.includes('id="primeHomeButton"')) return new Response(html,{status:res.status,headers:{'Content-Type':'text/html; charset=utf-8'}});
    const ui=`<a id="primeHomeButton" href="${HOME}" aria-label="Prime Hospital Home" title="Back to Prime Hospital Home" style="position:fixed;left:12px;bottom:12px;z-index:2147483647;display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:12px;background:#123d88;color:#fff;text-decoration:none;font:700 13px Arial;box-shadow:0 4px 14px #0003"><span style="width:28px;height:28px;border-radius:8px;background:#fff;color:#123d88;display:grid;place-items:center;font-size:19px;font-weight:800">+</span><span>PRIME HOSPITAL</span></a><script>document.addEventListener('DOMContentLoaded',()=>{const home='${HOME}';document.querySelectorAll('h1,h2,h3,.brand,.logo,[class*=brand],[class*=logo]').forEach(el=>{if(el.textContent.trim().toUpperCase().includes('PRIME HOSPITAL')){el.style.cursor='pointer';el.addEventListener('click',()=>location.href=home)}});});</script>`;
    html=html.replace('</body>',ui+'</body>');
    return new Response(html,{status:res.status,headers:{'Content-Type':'text/html; charset=utf-8'}});
  })());
});