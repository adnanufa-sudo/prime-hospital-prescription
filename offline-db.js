/* Prime Hospital Offline-First data layer.
   Keeps the same UI/API while mirroring patients, visits, prescriptions and medicines in IndexedDB.
   Online: syncs with Supabase. Offline: works entirely from the local database. */
(function(){
  const URL='https://prcvzefynoiuneybufge.supabase.co';
  const KEY='sb_publishable_JbxZuf181uR8zbmTyyfFiA_2pLjsq0C';
  const real=window.supabase.createClient(URL,KEY);
  const DB='prime_hospital_offline_v1', VER=1, STORES=['patients','visits','prescriptions','medicines','meta','queue'];
  let dbp=null, user=null, syncing=false;
  const openDB=()=>dbp||(dbp=new Promise((res,rej)=>{const r=indexedDB.open(DB,VER);r.onupgradeneeded=()=>{const d=r.result;STORES.forEach(s=>{if(!d.objectStoreNames.contains(s)){const o=d.createObjectStore(s,{keyPath:'_key'});if(s!=='queue')o.createIndex('id','id',{unique:false});}})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
  async function tx(store,mode,fn){const d=await openDB();return new Promise((res,rej)=>{const t=d.transaction(store,mode),o=t.objectStore(store);let out;try{out=fn(o)}catch(e){rej(e);return}t.oncomplete=()=>res(out);t.onerror=()=>rej(t.error)});}
  async function all(store){return tx(store,'readonly',o=>new Promise((res,rej)=>{const a=[],r=o.openCursor();r.onsuccess=()=>{const c=r.result;if(c){a.push(c.value);c.continue()}else res(a)};r.onerror=()=>rej(r.error)}))}
  async function put(store,v){return tx(store,'readwrite',o=>o.put({...v,_key:v._key||v.id||crypto.randomUUID()}))}
  async function del(store,key){return tx(store,'readwrite',o=>o.delete(key))}
  async function clearStore(store){return tx(store,'readwrite',o=>o.clear())}
  const clean=v=>{const x={...v};delete x._key;return x};
  function key(table,row){return row._key||row.id||crypto.randomUUID()}
  function matches(row,filters){return filters.every(f=>{let v=row[f.col],q=f.val;if(f.op==='eq')return String(v??'')===String(q??'');if(f.op==='neq')return String(v??'')!==String(q??'');if(f.op==='ilike'){const p=String(q).replace(/%/g,'').toLowerCase();return String(v??'').toLowerCase().includes(p)}if(f.op==='is')return q===null?v==null:v===q;if(f.op==='notnull')return v!=null;if(f.op==='in')return Array.isArray(q)&&q.map(String).includes(String(v));return true})}
  function parseOr(row,s){return String(s).split(',').some(part=>{const m=part.match(/^(\w+)\.(ilike|eq)\.(.+)$/);if(!m)return false;return matches(row,[{col:m[1],op:m[2],val:m[3]}])})}
  class Q{
    constructor(table){this.table=table;this.filters=[];this.ors=[];this.orders=[];this.n=null;this.action='select';this.payload=null}
    select(cols='*'){this.selectCols=cols;return this}
    eq(c,v){this.filters.push({col:c,op:'eq',val:v});return this}
    neq(c,v){this.filters.push({col:c,op:'neq',val:v});return this}
    ilike(c,v){this.filters.push({col:c,op:'ilike',val:v});return this}
    is(c,v){this.filters.push({col:c,op:'is',val:v});return this}
    not(c,op,v){if(op==='is'&&v===null)this.filters.push({col:c,op:'notnull'});return this}
    or(s){this.ors.push(s);return this}
    order(c,opt={}){this.orders.push({c,asc:opt.ascending!==false});return this}
    limit(n){this.n=n;return this}
    insert(payload){this.action='insert';this.payload=payload;return this}
    update(payload){this.action='update';this.payload=payload;return this}
    delete(){this.action='delete';return this}
    single(){this._single=true;return this}
    maybeSingle(){this._maybe=true;return this}
    then(a,b){return this.exec().then(a,b)}
    async exec(){
      const rows=await localRows(this.table);let found=rows.filter(r=>matches(r,this.filters)&&this.ors.every(s=>parseOr(r,s)));
      if(this.action==='select'){
        for(const o of this.orders)found.sort((a,b)=>{const av=a[o.c],bv=b[o.c];if(av===bv)return 0;return (av>bv?1:-1)*(o.asc?1:-1)});
        if(this.n!=null)found=found.slice(0,this.n);
        if(this._single||this._maybe){if(!found.length)return {data:null,error:this._single?{message:'No rows found'}:null};return {data:found[0],error:null}}
        return {data:found,error:null};
      }
      if(this.action==='insert'){
        const arr=Array.isArray(this.payload)?this.payload:[this.payload],created=[];
        for(const item of arr){const r={...item};r.id=r.id||crypto.randomUUID();await put(this.table,r);created.push(r);await queue('insert',this.table,r)}
        scheduleSync();let data=created;if(this._single)data=created[0]||null;return {data,error:null};
      }
      if(this.action==='update'){
        const updated=[];for(const old of found){const r={...old,...this.payload};await put(this.table,r);updated.push(r);await queue('update',this.table,r)}scheduleSync();return {data:this._single?updated[0]||null:updated,error:null};
      }
      if(this.action==='delete'){
        for(const r of found){await del(this.table,key(this.table,r));await queue('delete',this.table,r)}scheduleSync();return {data:found,error:null};
      }
    }
  }
  async function localRows(table){return (await all(table)).map(clean)}
  async function queue(action,table,row){await put('queue',{id:crypto.randomUUID(),created_at:Date.now(),action,table,row})}
  async function syncNow(){if(syncing||!navigator.onLine)return false;syncing=true;try{const s=(await real.auth.getSession()).data.session;if(!s)return false;user=s.user;const q=await localRows('queue');for(const item of q.sort((a,b)=>a.created_at-b.created_at)){const r=item.row,remote={...r};delete remote._key;let op;if(item.action==='insert')op=await real.from(item.table).insert(remote);else if(item.action==='update')op=await real.from(item.table).update(remote).eq('id',r.id).eq('doctor_id',s.user.id);else op=await real.from(item.table).delete().eq('id',r.id).eq('doctor_id',s.user.id);if(!op.error)await del('queue',item.id)}await pullAll(s.user.id);return true}catch(e){console.warn('Offline sync',e);return false}finally{syncing=false;updateStatus()}}
  async function pullAll(uid){for(const table of ['patients','visits','prescriptions','medicines']){let q=real.from(table).select('*').eq('doctor_id',uid);if(table==='prescriptions')q=q.order('sort_order');const r=await q;if(r.error)continue;await clearStore(table);for(const x of (r.data||[]))await put(table,x)}await put('meta',{id:'lastSync',value:new Date().toISOString()});updateStatus()}
  function scheduleSync(){if(navigator.onLine)setTimeout(syncNow,250)}
  async function cachedSession(){const m=(await all('meta')).find(x=>x.id==='session');return m?.value||null}
  async function saveSession(s){await put('meta',{id:'session',value:s})}
  async function login(email,password){if(!navigator.onLine){const s=await cachedSession();if(s){user=s.user;return {data:{session:s},error:null}}return {data:{session:null},error:{message:'Internet is required for the first login on this iPad.'}}}const r=await real.auth.signInWithPassword({email,password});if(!r.error&&r.data.session){user=r.data.session.user;await saveSession(r.data.session);await pullAll(user.id)}return r}
  async function logout(){user=null;await del('meta','session');return real.auth.signOut()}
  const auth={getSession:async()=>{if(navigator.onLine){const r=await real.auth.getSession();if(r.data.session){user=r.data.session.user;await saveSession(r.data.session);return r}}const s=await cachedSession();if(s){user=s.user;return {data:{session:s},error:null}}return {data:{session:null},error:null}},signInWithPassword:login,signOut:logout,onAuthStateChange:(cb)=>{real.auth.onAuthStateChange((ev,s)=>{if(s){user=s.user;saveSession(s);pullAll(user.id)}cb(ev,s)});setTimeout(async()=>{const r=await auth.getSession();cb(r.data.session?'INITIAL_SESSION':'SIGNED_OUT',r.data.session)},0)}};
  window.PrimeData={from:t=>new Q(t),auth,real,syncNow,isOnline:()=>navigator.onLine,localRows,showOfflineStatus:updateStatus};
  async function updateStatus(){let el=document.getElementById('offlineStatus');if(!el)return;const q=(await localRows('queue')).length;el.textContent=navigator.onLine?(q?'ONLINE • SYNC PENDING':'ONLINE • SYNCED'):'OFFLINE • LOCAL DATA';el.dataset.state=navigator.onLine?'online':'offline';el.title=q+' pending changes'}
  window.addEventListener('online',()=>{syncNow();updateStatus()});window.addEventListener('offline',updateStatus);window.addEventListener('load',()=>{updateStatus();if(navigator.onLine)setTimeout(syncNow,1000)});
  if(!window.__primeOfflineOverrideLoaded){window.__primeOfflineOverrideLoaded=true;const sc=document.createElement('script');sc.src='/offline-overrides.js';sc.onload=()=>{if(window.__primeOfflineOverrides)window.__primeOfflineOverrides()};document.head.appendChild(sc)}
})();