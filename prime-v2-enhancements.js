/* Prime Hospital V2 enhancements: keyboard-first OPD, local quick data, free drug-bank seed, Marathi instructions. */
(function(){
  'use strict';
  const DRUGS=[
    ['Paracetamol','Paracetamol','500 mg','Tablet','Oral','1-0-1','3 days','जेवणानंतर घ्यावे'],
    ['Paracetamol','Paracetamol','650 mg','Tablet','Oral','1-0-1','3 days','जेवणानंतर घ्यावे'],
    ['Ibuprofen','Ibuprofen','400 mg','Tablet','Oral','1-0-1','3 days','जेवणानंतर घ्यावे'],
    ['Amoxicillin','Amoxicillin','500 mg','Capsule','Oral','1-1-1','5 days','जेवणानंतर घ्यावे'],
    ['Azithromycin','Azithromycin','500 mg','Tablet','Oral','1-0-0','3 days','जेवणाच्या 1 तास आधी किंवा 2 तास नंतर'],
    ['Cetirizine','Cetirizine','10 mg','Tablet','Oral','0-0-1','5 days','रात्री घ्यावे'],
    ['Levocetirizine','Levocetirizine','5 mg','Tablet','Oral','0-0-1','5 days','रात्री घ्यावे'],
    ['Pantoprazole','Pantoprazole','40 mg','Tablet','Oral','1-0-0','5 days','नाश्त्याच्या 30 मिनिटे आधी घ्यावे'],
    ['Ondansetron','Ondansetron','4 mg','Tablet','Oral','1-1-1','3 days','गरजेनुसार / डॉक्टरांच्या सल्ल्याने'],
    ['ORS','ORS','21 g','Sachet','Oral','SOS','1 day','पाण्यात विरघळवून घ्यावे'],
    ['Metformin','Metformin','500 mg','Tablet','Oral','1-0-1','30 days','जेवणासोबत घ्यावे'],
    ['Amlodipine','Amlodipine','5 mg','Tablet','Oral','1-0-0','30 days','दररोज एकाच वेळी घ्यावे'],
    ['Telmisartan','Telmisartan','40 mg','Tablet','Oral','1-0-0','30 days','दररोज एकाच वेळी घ्यावे'],
    ['Atorvastatin','Atorvastatin','10 mg','Tablet','Oral','0-0-1','30 days','रात्री घ्यावे'],
    ['Levothyroxine','Levothyroxine','50 mcg','Tablet','Oral','1-0-0','30 days','रिकाम्या पोटी सकाळी घ्यावे']
  ];
  const KEY='prime_v2_drug_bank';
  function seed(){try{if(!localStorage.getItem(KEY))localStorage.setItem(KEY,JSON.stringify(DRUGS.map((d,i)=>({id:'phdrug_'+i,name:d[0],generic:d[1],strength:d[2],form:d[3],route:d[4],frequency:d[5],duration:d[6],instruction:d[7]}))))}catch(e){}}
  function focusable(root){return [...root.querySelectorAll('input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])')].filter(x=>x.tabIndex!==-1&&x.offsetParent!==null)}
  function installKeyboard(){
    const root=document.querySelector('#consultView'); if(!root||root.dataset.phV2Keys)return; root.dataset.phV2Keys='1';
    root.addEventListener('keydown',e=>{
      if(e.key!=='Tab'||e.ctrlKey||e.metaKey||e.altKey)return;
      const a=focusable(root),i=a.indexOf(e.target); if(i<0)return;
      e.preventDefault(); let n=i+(e.shiftKey?-1:1);
      if(n<0)n=a.length-1;if(n>=a.length)n=0;
      a[n].focus(); if(a[n].select&&['INPUT','TEXTAREA'].includes(a[n].tagName))a[n].select();
    },true);
  }
  function status(){
    let el=document.querySelector('#phV2Status');if(!el){el=document.createElement('span');el.id='phV2Status';el.className='offline-badge';document.body.appendChild(el)}
    const online=navigator.onLine;el.textContent=online?'ONLINE • SYNC':'OFFLINE • LOCAL';
  }
  function addStyle(){if(document.getElementById('ph-v2-css'))return;const l=document.createElement('link');l.id='ph-v2-css';l.rel='stylesheet';l.href='/v2-ui.css';document.head.appendChild(l);document.body.classList.add('ph-v2')}
  function boot(){seed();addStyle();status();installKeyboard();}
  window.addEventListener('online',status);window.addEventListener('offline',status);window.addEventListener('load',boot);setTimeout(boot,800);
  window.PrimeHospitalV2={drugBank:()=>JSON.parse(localStorage.getItem(KEY)||'[]'),searchDrugs:q=>{q=String(q||'').toLowerCase().trim();return JSON.parse(localStorage.getItem(KEY)||'[]').filter(x=>(x.name+' '+x.generic+' '+x.strength+' '+x.form).toLowerCase().includes(q)).slice(0,20)}};
})();
