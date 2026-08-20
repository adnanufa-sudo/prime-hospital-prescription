/* UNIVERSAL MANAGEMENT + CLEAN PRINT OVERRIDES */
(function(){
  const $id=id=>document.getElementById(id);
  const U4=v=>String(v??'').trim().toUpperCase();
  const esc4=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  let managementRows=[];
  let managementTemplates=JSON.parse(localStorage.getItem('prime_management_templates')||'[]');
  function getManagement(){return managementRows}
  function saveManagementTemplates(){localStorage.setItem('prime_management_templates',JSON.stringify(managementTemplates))}
  function managementData(){return managementTemplates}
  function renderManagementTemplates(){
    const box=$id('managementTemplateQuick'); if(!box)return;
    box.innerHTML=managementTemplates.map(t=>`<button type="button" class="management-template" tabindex="-1" data-id="${esc4(t.id)}">📋 ${esc4(t.name)}</button>`).join('')||'<span class="muted">NO MANAGEMENT TEMPLATES YET.</span>';
    box.querySelectorAll('.management-template').forEach(b=>b.onclick=()=>applyManagementTemplate(b.dataset.id));
  }
  function addManagementRow(m={}){
    const body=$id('managementRows'); if(!body)return;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><input class="mgmt-name" placeholder="TREATMENT / INJECTION / IV / PROCEDURE" value="${esc4(m.name||'')}"></td><td><input class="mgmt-dose" placeholder="DOSE / DETAILS" value="${esc4(m.details||'')}"></td><td><input class="mgmt-route" placeholder="ROUTE / TIME" value="${esc4(m.route||'')}"></td><td><button class="btn danger" type="button" tabindex="-1">×</button></td>`;
    body.appendChild(tr); managementRows.push(tr);
    tr.querySelector('button').onclick=()=>{managementRows=managementRows.filter(x=>x!==tr);tr.remove()};
    return tr;
  }
  function clearManagement(){managementRows=[];const b=$id('managementRows');if(b)b.innerHTML='';addManagementRow()}
  function readManagement(){return [...($id('managementRows')?.rows||[])].map(r=>({name:r.querySelector('.mgmt-name')?.value.trim()||'',details:r.querySelector('.mgmt-dose')?.value.trim()||'',route:r.querySelector('.mgmt-route')?.value.trim()||''})).filter(x=>x.name||x.details||x.route)}
  function setManagement(items){managementRows=[];const b=$id('managementRows');if(b)b.innerHTML='';(items||[]).forEach(addManagementRow);if(!(items||[]).length)addManagementRow()}
  function applyManagementTemplate(id){const t=managementTemplates.find(x=>x.id===id);if(t)setManagement(t.items||[])}
  function insertManagementSection(){
    const consult=$id('consultView'), rx=consult?.querySelector('.section h3')?.parentElement; if(!consult||$id('managementSection'))return;
    const sections=[...consult.querySelectorAll('.section')];
    const prescription=sections.find(s=>s.querySelector('h3')?.textContent?.includes('Prescription'));
    if(!prescription)return;
    const sec=document.createElement('div');sec.id='managementSection';sec.className='section';
    sec.innerHTML=`<h3>Management</h3><div id="managementTemplateQuick" class="quick"></div><table class="table management-table"><thead><tr><th>TREATMENT / INJECTION / IV / PROCEDURE</th><th>DOSE / DETAILS</th><th>ROUTE / TIME</th><th></th></tr></thead><tbody id="managementRows"></tbody></table><div class="quick" style="margin-top:8px"><button class="btn primary" type="button" onclick="addManagementRow()">＋ ADD MANAGEMENT</button><button type="button" onclick="addManagementQuick('STAT TABLET')">STAT TABLET</button><button type="button" onclick="addManagementQuick('IV FLUID')">IV FLUID</button><button type="button" onclick="addManagementQuick('INJECTION')">INJECTION</button><button type="button" onclick="addManagementQuick('PROCEDURE')">PROCEDURE</button></div>`;
    prescription.parentNode.insertBefore(sec,prescription);
    addManagementRow();renderManagementTemplates();
  }
  window.addManagementRow=addManagementRow;
  window.addManagementQuick=function(name){const r=addManagementRow({name});r.querySelector('.mgmt-name').focus()};
  window.openManagementTemplateEditor=function(id=null){
    const t=id?managementTemplates.find(x=>x.id===id):null;
    let modal=$id('managementTemplateEditor');if(!modal){modal=document.createElement('div');modal.id='managementTemplateEditor';modal.className='modal';modal.innerHTML=`<div class="modalbox" style="max-width:900px"><div class="head"><h2 id="mgmtTplTitle">ADD MANAGEMENT TEMPLATE</h2><button class="btn danger" type="button" onclick="closeManagementEditor()">CLOSE</button></div><div class="field"><label>TEMPLATE NAME</label><input id="mgmtTplName"></div><div class="section"><h3>TREATMENTS</h3><table class="table"><thead><tr><th>TREATMENT / INJECTION / IV / PROCEDURE</th><th>DOSE / DETAILS</th><th>ROUTE / TIME</th><th></th></tr></thead><tbody id="mgmtTplRows"></tbody></table><button class="btn" type="button" onclick="addManagementTemplateRow()">＋ ADD ITEM</button></div><div class="actions" style="justify-content:flex-end"><button class="btn primary" type="button" onclick="saveManagementTemplate()">SAVE TEMPLATE</button></div></div>`;document.body.appendChild(modal)}
    $id('mgmtTplName').value=t?.name||'';$id('mgmtTplRows').innerHTML='';(t?.items||[]).forEach(addManagementTemplateRow);if(!t?.items?.length)addManagementTemplateRow();modal.classList.add('on');window._editingMgmtTpl=id||null;
  };
  window.addManagementTemplateRow=function(m={}){const b=$id('mgmtTplRows');const tr=document.createElement('tr');tr.innerHTML=`<td><input class="mt-name" value="${esc4(m.name||'')}"></td><td><input class="mt-details" value="${esc4(m.details||'')}"></td><td><input class="mt-route" value="${esc4(m.route||'')}"></td><td><button class="btn danger" type="button">×</button></td>`;b.appendChild(tr);tr.querySelector('button').onclick=()=>tr.remove();return tr};
  window.closeManagementEditor=function(){$id('managementTemplateEditor')?.classList.remove('on')};
  window.saveManagementTemplate=function(){const name=$id('mgmtTplName').value.trim();if(!name)return alert('ENTER TEMPLATE NAME.');const items=[...$id('mgmtTplRows').rows].map(r=>({name:r.querySelector('.mt-name').value.trim(),details:r.querySelector('.mt-details').value.trim(),route:r.querySelector('.mt-route').value.trim()})).filter(x=>x.name||x.details||x.route);const id=window._editingMgmtTpl||'mg_'+Date.now();managementTemplates=managementTemplates.filter(t=>t.id!==id);managementTemplates.push({id,name,items});saveManagementTemplates();closeManagementEditor();renderManagementTemplates();loadManagementTemplatesList()};
  window.loadManagementTemplatesList=function(){const box=$id('managementTemplatesList');if(!box)return;box.innerHTML=managementTemplates.map(t=>`<div class="listrow"><div><b>${esc4(t.name)}</b><div class="muted">${t.items.length} ITEMS</div></div><div class="actions"><button class="btn primary" type="button" onclick="applyManagementTemplate('${esc4(t.id)}')">USE</button><button class="btn" type="button" onclick="openManagementTemplateEditor('${esc4(t.id)}')">EDIT</button><button class="btn danger" type="button" onclick="deleteManagementTemplate('${esc4(t.id)}')">DELETE</button></div></div>`).join('')||'<p class="muted">NO MANAGEMENT TEMPLATES.</p>'};
  window.deleteManagementTemplate=function(id){if(!confirm('DELETE THIS MANAGEMENT TEMPLATE?'))return;managementTemplates=managementTemplates.filter(t=>t.id!==id);saveManagementTemplates();loadManagementTemplatesList();renderManagementTemplates()};
  window.applyManagementTemplate=applyManagementTemplate;
  function insertManagementManager(){
    const tv=$id('templatesView');if(!tv||$id('managementTemplatesManager'))return;
    const sec=document.createElement('div');sec.id='managementTemplatesManager';sec.className='section';sec.innerHTML='<div class="head"><div><h3>Management Templates</h3><div class="muted">PRE-WRITTEN STAT TABLETS, IV FLUIDS, INJECTIONS AND PROCEDURES.</div></div><button class="btn primary" type="button" onclick="openManagementTemplateEditor()">＋ ADD MANAGEMENT TEMPLATE</button></div><div id="managementTemplatesList"></div>';
    tv.appendChild(sec);loadManagementTemplatesList();
  }
  function extrasWithManagement(id){const old=typeof getVisitExtras==='function'?getVisitExtras(id):{};return {...old,management:old.management||[]}}
  const oldGetExtras=window.getVisitExtras;window.getVisitExtras=function(id){const x=oldGetExtras?oldGetExtras(id):{};if(x.management===undefined)x.management=[];return x};
  const oldSaveExtras=window.saveVisitExtras;window.saveVisitExtras=function(id){if(oldSaveExtras)oldSaveExtras(id);const x=getVisitExtras(id);x.management=readManagement();localStorage.setItem('prime_visit_extras_'+id,JSON.stringify(x))};
  const oldApplyTemplate=window.applyTemplate;window.applyTemplate=function(id){if(oldApplyTemplate)oldApplyTemplate(id);const t=typeof templateData==='function'?templateData().find(x=>x.id===id):null;if(t&&t.management)setManagement(t.management)};
  const oldRenderTemplateQuick=window.renderTemplateQuick;window.renderTemplateQuick=function(){if(oldRenderTemplateQuick)oldRenderTemplateQuick();renderManagementTemplates()};
  async function preparePrint4(v,p){
    const s=await session();
    const meds=(await S.from('prescriptions').select('*').eq('visit_id',v.id).eq('doctor_id',s.user.id).order('sort_order')).data||[];
    const ex=getVisitExtras(v.id)||{};let parts=[];
    const add=(label,val)=>{if(val!==null&&val!==undefined&&String(val).trim()&&String(val).trim()!=='—')parts.push(`<div class="pblock"><b>${U4(label)}:</b> ${U4(val)}</div>`)};
    add('PATIENT',p?.name);add('AGE / SEX',[p?.age,p?.gender].filter(Boolean).join(' / '));add('DATE',v.visit_date);
    const vit=[['BP',v.bp],['BSL',v.blood_sugar],['SPO2',v.spo2],['TEMP',v.temperature],['PULSE',v.pulse],['WEIGHT',v.weight]].filter(x=>x[1]);if(vit.length)add('VITALS',vit.map(x=>U4(x[0])+': '+U4(x[1])).join('   '));
    add('COMPLAINTS',v.complaints);add('KNOWN CASE OF',ex.knownCases);add('HABBITS',ex.habits);add('HISTORY OF',ex.historyOf);add('EXAMINATION',ex.examination);add('DIAGNOSIS',v.diagnosis);add('INVESTIGATIONS',v.investigations);
    if(ex.management?.length){parts.push('<div class="psection-title">MANAGEMENT</div><div class="management-print">'+ex.management.map(m=>{const text=[m.name,m.details,m.route].filter(Boolean).map(U4).join(' — ');return `<div class="management-line">${text}</div>`}).join('')+'</div>')}
    if(meds.length){parts.push('<div class="psection-title">PRESCRIPTION</div><div class="rx-clean">'+meds.map(m=>`<div class="rx-line"><div class="rx-med"><b>${U4(m.medicine_name)}</b>${m.strength&&String(m.strength).trim()?`<div class="formulation">${U4(m.strength)}</div>`:''}</div><div class="rx-dose">${U4(m.frequency)}</div><div class="rx-duration">${U4(m.duration)}</div></div>`).join('')+'</div>')}
    add('ADVICE / FOLLOW-UP',v.advice);$id('printContent').innerHTML=parts.join('');
  }
  window.preparePrint=preparePrint4;
  function openPrint4(size){const w=window.open('','_blank','width=900,height=1000');if(!w)return alert('PLEASE ALLOW POP-UPS FOR PRINTING.');const a4=size==='a4',width=a4?'164mm':'110mm',top='43mm',left='7mm',font=a4?'11.5px':'10.5px';const html=`<!doctype html><html><head><title>PRESCRIPTION</title><style>@page{size:${a4?'A4':'A5'} portrait;margin:0}html,body{margin:0;padding:0;background:#fff}body{font-family:Arial,sans-serif;color:#111;text-transform:uppercase}.sheet{position:absolute;left:${left};top:${top};width:${width};font-size:${font};line-height:1.42}.pblock{margin:0 0 9px}.psection-title{font-weight:700;margin:13px 0 8px}.management-line{margin:0 0 7px;padding-left:2px}.rx-clean{margin:2px 0 8px}.rx-line{display:grid;grid-template-columns:minmax(0,1fr) 25mm 20mm;column-gap:7mm;align-items:start;margin:0 0 10px;padding:0;border:0}.rx-med{min-width:0}.rx-dose,.rx-duration{white-space:nowrap}.formulation{font-style:italic;font-weight:400;margin-top:2px}.print-sign{margin-top:18px;text-align:right;font-weight:700}</style></head><body><div class="sheet">${$id('printContent').innerHTML}</div></body></html>`;w.document.write(html);w.document.close();setTimeout(()=>w.print(),350);w.onafterprint=()=>w.close()}
  window.openPrintWindow=openPrint4;
  function setupManagement(){insertManagementSection();insertManagementManager();renderManagementTemplates();if(!$id('managementRows')?.children.length)addManagementRow()}
  function universalPatch(){setupManagement();
    const printButtons=document.querySelectorAll('[onclick*="printCurrent"],button');
    // Keep print buttons but make the final print renderer use the clean layout.
    const oldNew=window.newConsult; if(oldNew&&!window._mgmtNewWrapped){window._mgmtNewWrapped=true;window.newConsult=function(){oldNew();setTimeout(()=>{setupManagement();},0)}}
    const oldHist=window.newConsultFromHistory;if(oldHist&&!window._mgmtHistWrapped){window._mgmtHistWrapped=true;window.newConsultFromHistory=function(){oldHist();setTimeout(()=>{setupManagement();},0)}}
    const oldVisit=window.newConsultFromVisit;if(oldVisit&&!window._mgmtVisitWrapped){window._mgmtVisitWrapped=true;window.newConsultFromVisit=async function(id){await oldVisit(id);setTimeout(()=>{setupManagement();},0)}}
    const oldRoute=window.route;if(oldRoute&&!window._mgmtRouteWrapped){window._mgmtRouteWrapped=true;window.route=function(v){oldRoute(v);setTimeout(()=>{setupManagement();if(v==='templates')loadManagementTemplatesList()},0)}}
    const oldCopy=window.copyPrevious;if(oldCopy&&!window._mgmtCopyWrapped){window._mgmtCopyWrapped=true;window.copyPrevious=async function(){await oldCopy();setTimeout(()=>{const v=currentVisit; if(v){const x=getVisitExtras(v.id);setManagement(x.management||[])}},0)}}
    const oldPrint=window.printCurrent;if(oldPrint&&!window._mgmtPrintWrapped){window._mgmtPrintWrapped=true;window.printCurrent=async function(size){if(!currentVisit)return alert('SAVE THE VISIT FIRST, THEN PRINT.');await preparePrint4(currentVisit,currentPatient);openPrint4(size)}}
    const oldSavePrint=window.saveAndPrint;if(oldSavePrint&&!window._mgmtSavePrintWrapped){window._mgmtSavePrintWrapped=true;window.saveAndPrint=async function(size){await saveVisit();if(currentVisit){await preparePrint4(currentVisit,currentPatient);openPrint4(size)}}}
  }
  window.addEventListener('load',()=>setTimeout(universalPatch,0));
})();
