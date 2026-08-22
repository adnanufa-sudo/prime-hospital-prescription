/* PRIME HOSPITAL - OWN FREE DRUG BANK
   Local, editable starter catalogue. No paid API and no third-party drug service.
   Clinical note: this is a prescribing aid, not an authority; verify product, strength,
   indication, contraindications, interactions and local availability before prescribing.
*/
(function(){
  const KEY='prime_custom_drug_bank_v1';
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const BANK=[
    ['Paracetamol','Tablet','500 mg'],['Paracetamol','Tablet','650 mg'],['Paracetamol','Syrup','120 mg/5 mL'],['Paracetamol','Syrup','250 mg/5 mL'],
    ['Ibuprofen','Tablet','200 mg'],['Ibuprofen','Tablet','400 mg'],['Diclofenac','Tablet','50 mg'],['Aceclofenac','Tablet','100 mg'],
    ['Naproxen','Tablet','250 mg'],['Naproxen','Tablet','500 mg'],['Mefenamic acid','Tablet','500 mg'],['Etodolac','Tablet','400 mg'],
    ['Amoxicillin','Capsule','250 mg'],['Amoxicillin','Capsule','500 mg'],['Amoxicillin','Dry syrup','125 mg/5 mL'],['Amoxicillin + clavulanic acid','Tablet','625 mg'],
    ['Amoxicillin + clavulanic acid','Tablet','1.2 g'],['Azithromycin','Tablet','250 mg'],['Azithromycin','Tablet','500 mg'],['Azithromycin','Suspension','200 mg/5 mL'],
    ['Cefixime','Tablet','200 mg'],['Cefixime','Tablet','400 mg'],['Cefixime','Dry syrup','50 mg/5 mL'],['Cefuroxime','Tablet','250 mg'],['Cefuroxime','Tablet','500 mg'],
    ['Cefpodoxime','Tablet','100 mg'],['Cefpodoxime','Tablet','200 mg'],['Ceftriaxone','Injection','250 mg'],['Ceftriaxone','Injection','500 mg'],['Ceftriaxone','Injection','1 g'],
    ['Cefotaxime','Injection','1 g'],['Doxycycline','Capsule','100 mg'],['Metronidazole','Tablet','400 mg'],['Metronidazole','Tablet','500 mg'],
    ['Metronidazole','Suspension','200 mg/5 mL'],['Tinidazole','Tablet','500 mg'],['Nitrofurantoin','Tablet','100 mg'],['Fosfomycin','Sachet','3 g'],
    ['Ondansetron','Tablet','4 mg'],['Ondansetron','Tablet','8 mg'],['Ondansetron','Syrup','2 mg/5 mL'],['Domperidone','Tablet','10 mg'],
    ['Pantoprazole','Tablet','20 mg'],['Pantoprazole','Tablet','40 mg'],['Esomeprazole','Tablet','20 mg'],['Esomeprazole','Tablet','40 mg'],
    ['Rabeprazole','Tablet','20 mg'],['Omeprazole','Capsule','20 mg'],['Famotidine','Tablet','20 mg'],['Sucralfate','Suspension','1 g/10 mL'],
    ['Dicyclomine','Tablet','10 mg'],['Dicyclomine','Tablet','20 mg'],['Hyoscine butylbromide','Tablet','10 mg'],['Lactulose','Syrup','10 g/15 mL'],
    ['ORS','Powder','WHO low-osmolarity formula'],['Simethicone','Tablet','80 mg'],['Levocetirizine','Tablet','5 mg'],['Cetirizine','Tablet','10 mg'],
    ['Fexofenadine','Tablet','120 mg'],['Fexofenadine','Tablet','180 mg'],['Loratadine','Tablet','10 mg'],['Desloratadine','Tablet','5 mg'],
    ['Montelukast','Tablet','10 mg'],['Montelukast + levocetirizine','Tablet','10 mg + 5 mg'],['Salbutamol','Tablet','4 mg'],['Salbutamol','Respirator solution','2.5 mg/2.5 mL'],
    ['Budesonide','Respules','0.5 mg/2 mL'],['Budesonide','Respules','1 mg/2 mL'],['Ipratropium bromide','Respirator solution','0.5 mg/2 mL'],
    ['Budesonide + formoterol','Inhaler','160 mcg + 4.5 mcg'],['Budesonide + formoterol','Inhaler','200 mcg + 6 mcg'],['Tiotropium','Inhalation capsule','18 mcg'],
    ['Metformin','Tablet','500 mg'],['Metformin','Tablet','850 mg'],['Metformin','Tablet','1000 mg'],['Glimepiride','Tablet','1 mg'],['Glimepiride','Tablet','2 mg'],
    ['Glimepiride','Tablet','4 mg'],['Gliclazide MR','Tablet','30 mg'],['Gliclazide MR','Tablet','60 mg'],['Sitagliptin','Tablet','100 mg'],
    ['Teneligliptin','Tablet','20 mg'],['Empagliflozin','Tablet','10 mg'],['Empagliflozin','Tablet','25 mg'],['Dapagliflozin','Tablet','10 mg'],
    ['Linagliptin','Tablet','5 mg'],['Pioglitazone','Tablet','15 mg'],['Pioglitazone','Tablet','30 mg'],['Insulin regular human','Injection','100 IU/mL'],
    ['Insulin NPH human','Injection','100 IU/mL'],['Levothyroxine','Tablet','25 mcg'],['Levothyroxine','Tablet','50 mcg'],['Levothyroxine','Tablet','75 mcg'],['Levothyroxine','Tablet','100 mcg'],
    ['Amlodipine','Tablet','2.5 mg'],['Amlodipine','Tablet','5 mg'],['Amlodipine','Tablet','10 mg'],['Telmisartan','Tablet','20 mg'],['Telmisartan','Tablet','40 mg'],
    ['Telmisartan','Tablet','80 mg'],['Losartan','Tablet','25 mg'],['Losartan','Tablet','50 mg'],['Olmesartan','Tablet','20 mg'],['Olmesartan','Tablet','40 mg'],
    ['Ramipril','Tablet','2.5 mg'],['Ramipril','Tablet','5 mg'],['Enalapril','Tablet','5 mg'],['Enalapril','Tablet','10 mg'],['Metoprolol succinate','Tablet','25 mg'],
    ['Metoprolol succinate','Tablet','50 mg'],['Metoprolol tartrate','Tablet','25 mg'],['Atenolol','Tablet','25 mg'],['Bisoprolol','Tablet','5 mg'],['Furosemide','Tablet','40 mg'],
    ['Spironolactone','Tablet','25 mg'],['Hydrochlorothiazide','Tablet','12.5 mg'],['Atorvastatin','Tablet','10 mg'],['Atorvastatin','Tablet','20 mg'],['Atorvastatin','Tablet','40 mg'],
    ['Rosuvastatin','Tablet','5 mg'],['Rosuvastatin','Tablet','10 mg'],['Rosuvastatin','Tablet','20 mg'],['Aspirin','Tablet','75 mg'],['Clopidogrel','Tablet','75 mg'],
    ['Warfarin','Tablet','5 mg'],['Apixaban','Tablet','2.5 mg'],['Apixaban','Tablet','5 mg'],['Rivaroxaban','Tablet','10 mg'],['Rivaroxaban','Tablet','20 mg'],
    ['Atropine','Injection','0.6 mg/mL'],['Adrenaline','Injection','1 mg/mL'],['Hydrocortisone','Injection','100 mg'],['Dexamethasone','Injection','4 mg/mL'],
    ['Prednisolone','Tablet','5 mg'],['Prednisolone','Tablet','10 mg'],['Prednisolone','Tablet','20 mg'],['Methylprednisolone','Tablet','4 mg'],['Methylprednisolone','Tablet','16 mg'],
    ['Betamethasone','Cream','0.05%'],['Clobetasol propionate','Cream','0.05%'],['Mometasone furoate','Cream','0.1%'],['Hydrocortisone','Cream','1%'],
    ['Tacrolimus','Ointment','0.03%'],['Tacrolimus','Ointment','0.1%'],['Permethrin','Cream','5%'],['Ketoconazole','Cream','2%'],['Ketoconazole','Shampoo','2%'],
    ['Clotrimazole','Cream','1%'],['Terbinafine','Cream','1%'],['Mupirocin','Ointment','2%'],['Fusidic acid','Cream','2%'],['Acyclovir','Tablet','400 mg'],['Acyclovir','Cream','5%'],
    ['Fluconazole','Capsule','150 mg'],['Itraconazole','Capsule','100 mg'],['Itraconazole','Capsule','200 mg'],['Albendazole','Tablet','400 mg'],['Ivermectin','Tablet','6 mg'],
    ['Vitamin D3','Capsule','60,000 IU'],['Calcium carbonate + vitamin D3','Tablet','500 mg + 400 IU'],['Iron + folic acid','Tablet','Ferrous salt + folic acid'],
    ['Folic acid','Tablet','5 mg'],['Methylcobalamin','Tablet','500 mcg'],['Vitamin B complex','Tablet','B-complex'],['Zinc','Tablet','20 mg'],['Ascorbic acid','Tablet','500 mg'],
    ['Cholecalciferol','Oral drops','400 IU/drop'],['Normal saline','Infusion','0.9%'],['Ringer lactate','Infusion','Standard IV solution'],['Dextrose','Infusion','5%'],
    ['Lidocaine','Injection','2%'],['Lidocaine','Injection','1%'],['Lidocaine + adrenaline','Injection','2% + 1:200,000'],['Povidone iodine','Solution','5%'],['Chlorhexidine','Solution','2%'],
    ['Calamine','Lotion','Standard preparation'],['Mupirocin','Ointment','2%'],['Silver sulfadiazine','Cream','1%']
  ].map((x,i)=>({id:'PB'+String(i+1).padStart(4,'0'),name:x[0],form:x[1],strength:x[2],default_frequency:'',default_duration:'',default_instruction:'',source:'Prime Hospital starter bank'}));
  function custom(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
  function all(){return BANK.concat(custom())}
  function search(q){const w=String(q||'').toLowerCase().trim().split(/\s+/).filter(Boolean);return all().filter(m=>{const t=[m.name,m.form,m.strength].join(' ').toLowerCase();return w.every(x=>t.includes(x))}).slice(0,25)}
  function add(m){const c=custom();if(c.some(x=>x.id===m.id))return; c.push({...m,id:m.id||'CUSTOM_'+Date.now()});localStorage.setItem(KEY,JSON.stringify(c));renderList()}
  function renderList(){const box=document.getElementById('primeDrugBankList');if(!box)return;const q=document.getElementById('primeDrugBankSearch')?.value||'';const rows=search(q);box.innerHTML=rows.map(m=>`<div class="listrow"><div><b>${esc(m.name)}</b> <span class="muted">${esc(m.form||'')} ${esc(m.strength||'')}</span><div class="muted">${esc(m.source||'Prime Hospital')}</div></div><button type="button" class="btn" tabindex="-1" data-add="${esc(m.id)}">Add to My Medicines</button></div>`).join('')||'<p class="muted">No matching medicines.</p>';box.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const m=all().find(x=>x.id===b.dataset.add);if(m&&typeof window.saveMedicineFromDrugBank==='function')window.saveMedicineFromDrugBank(m);else add(m)})}
  window.PrimeDrugBank={all,search,add,starterCount:BANK.length};
  window.PrimeDrugBank.render=renderList;
  window.addEventListener('load',()=>{const old=window.findMedicines;window.findMedicines=async function(q){const local=window.PrimeDrugBank.search(q);let remote=[];try{if(old)remote=await old(q)}catch(e){}const seen=new Set();return local.concat(remote).filter(m=>{const k=[m.name,m.strength,m.form].join('|').toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).slice(0,25)};const mv=document.getElementById('medicinesView');if(mv&&!document.getElementById('primeDrugBankPanel')){const p=document.createElement('div');p.id='primeDrugBankPanel';p.className='section';p.innerHTML='<div class="head"><div><h3>Prime Hospital Free Drug Bank</h3><div class="muted">Built into the app. Works offline. Search generic name, form or strength, then add selected items to your personal medicine library.</div></div><span class="muted">'+BANK.length+' starter entries</span></div><input id="primeDrugBankSearch" class="search" placeholder="Search generic, form or strength"><div id="primeDrugBankList"></div>';mv.appendChild(p);document.getElementById('primeDrugBankSearch').addEventListener('input',renderList);renderList()}});
})();