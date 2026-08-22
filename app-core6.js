/* PRIME HOSPITAL V2 - KEYBOARD + LOW GLARE + FREE LOCAL DRUG BANK */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

  /* Free local drug bank. This is a searchable convenience library, not a clinical interaction database. */
  const DRUG_BANK=[
    ['Paracetamol','Tablet 500 mg','1-0-1','3 days','After food'],['Paracetamol','Tablet 650 mg','1-0-1','3 days','After food'],
    ['Ibuprofen','Tablet 200 mg','1-0-1','3 days','After food'],['Ibuprofen','Tablet 400 mg','1-0-1','3 days','After food'],
    ['Aceclofenac','Tablet 100 mg','1-0-1','5 days','After food'],['Diclofenac','Tablet 50 mg','1-0-1','5 days','After food'],
    ['Nimesulide','Tablet 100 mg','1-0-1','3 days','After food'],['Levocetirizine','Tablet 5 mg','0-0-1','5 days','At night'],
    ['Cetirizine','Tablet 10 mg','0-0-1','5 days','At night'],['Fexofenadine','Tablet 120 mg','1-0-0','5 days','Before food'],
    ['Amoxicillin','Capsule 500 mg','1-1-1','5 days','After food'],['Amoxicillin + Clavulanate','Tablet 625 mg','1-0-1','5 days','After food'],
    ['Azithromycin','Tablet 500 mg','1-0-0','3 days','Before food'],['Cefixime','Tablet 200 mg','1-0-1','5 days','After food'],
    ['Cefuroxime','Tablet 500 mg','1-0-1','5 days','After food'],['Doxycycline','Capsule 100 mg','1-0-1','5 days','After food'],
    ['Metronidazole','Tablet 400 mg','1-1-1','5 days','After food'],['Ofloxacin','Tablet 200 mg','1-0-1','5 days','After food'],
    ['Pantoprazole','Tablet 40 mg','1-0-0','7 days','Before breakfast'],['Rabeprazole','Tablet 20 mg','1-0-0','7 days','Before breakfast'],
    ['Omeprazole','Capsule 20 mg','1-0-0','7 days','Before breakfast'],['Ondansetron','Tablet 4 mg','SOS','3 days','As directed'],
    ['Domperidone','Tablet 10 mg','1-1-1','5 days','Before food'],['ORS','Sachet','1-1-1','3 days','Dissolve in water'],
    ['Loperamide','Tablet 2 mg','SOS','2 days','As directed'],['Albendazole','Tablet 400 mg','0-0-1','1 day','After food'],
    ['Mebendazole','Tablet 100 mg','1-1-1','3 days','After food'],['Metformin','Tablet 500 mg','1-0-1','30 days','With meals'],
    ['Metformin','Tablet 500 mg ER','1-0-1','30 days','With meals'],['Glimepiride','Tablet 1 mg','1-0-0','30 days','Before breakfast'],
    ['Amlodipine','Tablet 5 mg','1-0-0','30 days','Any time'],['Losartan','Tablet 50 mg','1-0-0','30 days','Any time'],
    ['Telmisartan','Tablet 40 mg','1-0-0','30 days','Any time'],['Atenolol','Tablet 25 mg','1-0-0','30 days','As directed'],
    ['Atorvastatin','Tablet 10 mg','0-0-1','30 days','At night'],['Rosuvastatin','Tablet 10 mg','0-0-1','30 days','At night'],
    ['Levothyroxine','Tablet 50 mcg','1-0-0','30 days','Empty stomach'],['Vitamin D3','Capsule 60000 IU','0-0-1','8 weeks','After food'],
    ['Calcium + Vitamin D3','Tablet','1-0-1','30 days','After food'],['Iron + Folic Acid','Tablet','1-0-0','30 days','After food'],
    ['Mupirocin','Ointment 2%','1-1-1','5 days','Apply locally'],['Clotrimazole','Cream 1%','1-0-1','14 days','Apply locally'],
    ['Ketoconazole','Cream 2%','1-0-1','14 days','Apply locally'],['Hydrocortisone','Cream 1%','1-0-1','5 days','Apply thin layer'],
    ['Calamine','Lotion','1-1-1','7 days','Apply locally'],['Permethrin','Cream 5%','0-0-1','1 day','Apply as directed'],
    ['Povidone Iodine','Solution 5%','1-1-1','5 days','For local use'],['ORS','Solution','1-1-1','3 days','As directed'],
    ['Salbutamol','Inhaler 100 mcg','SOS','As directed','Inhale as directed'],['Budesonide','Respules 0.5 mg','1-0-1','As directed','Nebulize as directed'],
    ['Montelukast + Levocetirizine','Tablet','0-0-1','5 days','At night'],['Ambroxol','Syrup','1-1-1','5 days','After food'],
    ['Dextromethorphan','Syrup','1-1-1','5 days','As directed'],['Lactulose','Syrup','0-0-1','7 days','At night'],
    ['B-Complex','Tablet','1-0-0','30 days','After food']
  ];

  function localFind(q){
    const words=String(q||'').toLowerCase().trim().split(/\s+/).filter(Boolean); if(!words.length)return [];
    return DRUG_BANK.filter(x=>words.every(w=>x.join(' ').toLowerCase().includes(w))).slice(0,20).map((x,i)=>({id:'local_'+i,name:x[0],strength:x[1],default_frequency:x[2],default_duration:x[3],default_instruction:x[4],_local:true}));
  }
  window.primeDrugBank=DRUG_BANK;
  window.primeLocalFindMedicines=localFind;

  /* Low-glare dark clinical theme. Print styles remain controlled by the existing print CSS. */
  const style=document.createElement('style');
  style.id='prime-v2-theme';
  style.textContent=`
    :root{color-scheme:dark}
    body{background:#090d14!important;color:#d8e1ec!important}
    .card{background:#0f1621!important;border:1px solid #263446!important;box-shadow:0 4px 16px #0006!important}
    .brand,.section h3{color:#63c7d9!important}.muted{color:#8392a6!important}
    .btn{background:#111b28!important;color:#9adbea!important;border-color:#28516a!important}
    .btn:hover{background:#17283a!important;border-color:#3a8298!important}
    .btn.primary{background:#123a48!important;color:#a7e9f4!important;border-color:#2b91a7!important}
    .btn.danger{color:#f29b9b!important;border-color:#744047!important}
    .quick button,.chips button{background:#111b28!important;color:#b7c7d8!important;border-color:#35475b!important}
    .quick button:nth-child(4n+1){border-color:#39728a!important}.quick button:nth-child(4n+2){border-color:#59658e!important}.quick button:nth-child(4n+3){border-color:#477b65!important}.quick button:nth-child(4n){border-color:#805c75!important}
    .field input,.field select,.field textarea,.search,.datebar input{background:#0b121c!important;color:#e1e8f0!important;border-color:#2c3b4d!important}
    .field input:focus,.field select:focus,.field textarea:focus,.search:focus{outline:2px solid #2b91a7!important;outline-offset:1px}
    .section{border-top-color:#263446!important}.table th,.table td{border-color:#2b3a4d!important}.table input{background:#0b121c!important;color:#e1e8f0!important}
    .suggest{background:#101a27!important;border-color:#356178!important;box-shadow:0 8px 24px #0009!important}.suggest div{border-bottom-color:#263446!important}.suggest div:hover{background:#183044!important}
    .listrow{border-color:#263446!important;background:#0d141f!important}.stat{background:#0d141f!important;border-color:#263446!important}.stat b{color:#63c7d9!important}
    .modalbox{background:#0f1621!important;border:1px solid #2a3c50!important}.tabs .btn{border-color:#3c5267!important}
    #primeOfflineBadge{position:fixed;right:12px;bottom:12px;z-index:9999;padding:6px 10px;border:1px solid #3b596d;border-radius:999px;background:#0d1620;color:#9cc7d3;font-size:11px;font-weight:700;box-shadow:0 4px 14px #0008}
    @media print{body{background:#fff!important;color:#111!important}.card,.btn,.quick button{background:transparent!important;color:inherit!important;border-color:inherit!important}}
  `;
  document.head.appendChild(style);

  /* Offline/online indicator. */
  const badge=document.createElement('div');badge.id='primeOfflineBadge';document.body.appendChild(badge);
  function onlineState(){badge.textContent=navigator.onLine?'● ONLINE':'● OFFLINE • LOCAL';badge.style.borderColor=navigator.onLine?'#2d6a67':'#765e38';badge.style.color=navigator.onLine?'#83d6c5':'#e0bc76'}
  window.addEventListener('online',onlineState);window.addEventListener('offline',onlineState);onlineState();

  /* Universal consultation tab order. Utility/quick buttons are skipped. */
  function tabOrder(){
    const root=$('consultView');if(!root)return;
    const fields=[...root.querySelectorAll('input,select,textarea')].filter(e=>!e.disabled&&!e.readOnly&&e.type!=='hidden'&&e.offsetParent!==null);
    fields.forEach(e=>e.tabIndex=0);
    root.querySelectorAll('button').forEach(b=>{if(!b.closest('.actions:last-child'))b.tabIndex=-1});
    const final=[...root.querySelectorAll('.actions')].at(-1);final?.querySelectorAll('button').forEach(b=>b.tabIndex=0);
  }
  document.addEventListener('focusin',e=>{if(e.target.closest('#consultView'))setTimeout(tabOrder,0)});
  window.addEventListener('load',()=>setTimeout(tabOrder,100));

  /* BMI calculation, inserted next to weight/height without disrupting the form. */
  function bmi(){
    const w=parseFloat($('weight')?.value),h=parseFloat($('height')?.value); if(!w||!h||h<=0)return;
    const m=h/100,b=(w/(m*m)).toFixed(1);let el=$('bmi');
    if(!el){const f=document.createElement('div');f.className='field';f.innerHTML='<label>BMI</label><input id="bmi" readonly>';const grid=$('weight')?.closest('.grid');grid?.appendChild(f);el=$('bmi')}
    el.value=b;
  }
  $('weight')?.addEventListener('input',bmi);$('height')?.addEventListener('input',bmi);

  /* Add height field if the current version does not have one. */
  function ensureHeight(){
    const weight=$('weight');if(!weight||$('height'))return;
    const grid=weight.closest('.grid');if(!grid)return;
    const f=document.createElement('div');f.className='field';f.innerHTML='<label>Height (cm)</label><input id="height" type="number" inputmode="decimal">';grid.appendChild(f);
    $('height').addEventListener('input',bmi);bmi();
  }

  /* Local Drug Bank integration: local library is used when remote search has no result or Internet is unavailable. */
  const oldFind=window.findMedicines;
  window.findMedicines=async function(q){
    let remote=[];try{if(navigator.onLine&&oldFind)remote=await oldFind(q)}catch(e){}
    const local=localFind(q);const seen=new Set(remote.map(m=>String(m.name||'').toLowerCase()+'|'+String(m.strength||'').toLowerCase()));
    return remote.concat(local.filter(m=>!seen.has(String(m.name).toLowerCase()+'|'+String(m.strength).toLowerCase()))).slice(0,20);
  };

  /* Save the local drug bank for offline use and expose an editable personal layer. */
  try{if(!localStorage.getItem('prime_local_drug_bank_v2'))localStorage.setItem('prime_local_drug_bank_v2',JSON.stringify(DRUG_BANK))}catch(e){}

  function boot(){ensureHeight();tabOrder();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,200));else setTimeout(boot,200);
})();