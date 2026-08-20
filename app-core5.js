/* MANAGEMENT STATE FIXES */
(function(){
  const $5=id=>document.getElementById(id);
  const U5=v=>String(v??'').trim().toUpperCase();
  function readMgmt(){return [...($5('managementRows')?.rows||[])].map(r=>({name:r.querySelector('.mgmt-name')?.value.trim()||'',details:r.querySelector('.mgmt-dose')?.value.trim()||'',route:r.querySelector('.mgmt-route')?.value.trim()||''})).filter(x=>x.name||x.details||x.route)}
  function clearMgmt(){const b=$5('managementRows');if(!b)return; b.innerHTML='';if(typeof window.addManagementRow==='function')window.addManagementRow()}
  function loadMgmtForVisit(id){if(!id)return;const x=typeof getVisitExtras==='function'?getVisitExtras(id):{};if(typeof window.setManagement==='function')window.setManagement(x.management||[]);else{const b=$5('managementRows');if(b){b.innerHTML='';(x.management||[]).forEach(m=>window.addManagementRow(m));if(!x.management?.length)window.addManagementRow()}}}
  const n=window.newConsult;if(n&&!window._mgmt5New){window._mgmt5New=true;window.newConsult=function(){n();setTimeout(clearMgmt,0)}}
  const nh=window.newConsultFromHistory;if(nh&&!window._mgmt5Hist){window._mgmt5Hist=true;window.newConsultFromHistory=function(){nh();setTimeout(clearMgmt,0)}}
  const nv=window.newConsultFromVisit;if(nv&&!window._mgmt5Visit){window._mgmt5Visit=true;window.newConsultFromVisit=async function(id){await nv(id);setTimeout(()=>loadMgmtForVisit(id),0)}}
  const cp=window.copyPrevious;if(cp&&!window._mgmt5Copy){window._mgmt5Copy=true;window.copyPrevious=async function(){await cp();try{let s=await session();if(currentPatient){let v=(await S.from('visits').select('id').eq('patient_id',currentPatient.id).eq('doctor_id',s.user.id).order('visit_date',{ascending:false}).limit(1).maybeSingle()).data;if(v)loadMgmtForVisit(v.id)}}catch(e){}}}
  const ap=window.applyTemplate;if(ap&&!window._mgmt5Tpl){window._mgmt5Tpl=true;window.applyTemplate=function(id){ap(id);setTimeout(()=>{const t=typeof templateData==='function'?templateData().find(x=>x.id===id):null;if(t?.management&&typeof window.setManagement==='function')window.setManagement(t.management)},0)}}
  const sv=window.saveVisitExtras;if(sv&&!window._mgmt5Save){window._mgmt5Save=true;window.saveVisitExtras=function(id){sv(id);const x=typeof getVisitExtras==='function'?getVisitExtras(id):{};x.management=readMgmt();localStorage.setItem('prime_visit_extras_'+id,JSON.stringify(x))}}
  // Keep management quick-entry buttons out of the Tab sequence; inputs remain fully tab-navigable.
  document.addEventListener('keydown',e=>{if(e.key==='Tab'&&e.target.closest('#managementRows')){const controls=[...document.querySelectorAll('#consultView input,#consultView select,#consultView textarea')].filter(x=>!x.disabled&&x.tabIndex!==-1&&x.offsetParent!==null);const i=controls.indexOf(e.target);if(i>=0){e.preventDefault();(controls[e.shiftKey?i-1:i+1]||e.target).focus()}}});
})();
