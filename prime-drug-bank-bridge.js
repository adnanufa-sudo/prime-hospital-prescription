/* Bridge from the built-in Prime Hospital Drug Bank to the doctor's personal medicine library. */
(function(){
  function ready(){return window.PrimeData&&document.getElementById('medName')}
  window.saveMedicineFromDrugBank=async function(m){
    const P=window.PrimeData;
    if(!P)return alert('Offline data layer is still loading. Please try again.');
    const s=(await P.auth.getSession()).data.session;
    if(!s)return alert('Please log in first.');
    const exists=(await P.from('medicines').select('*').eq('doctor_id',s.user.id).eq('name',m.name).eq('strength',m.strength).limit(1).maybeSingle()).data;
    if(exists){alert('This medicine is already in My Medicines.');return}
    const r=await P.from('medicines').insert({doctor_id:s.user.id,name:m.name,strength:m.strength,default_frequency:m.default_frequency||'',default_duration:m.default_duration||'',default_instruction:m.default_instruction||''});
    if(r.error){alert(r.error.message||'Could not add medicine.');return}
    if(typeof window.loadMedicines==='function')window.loadMedicines();
    alert(m.name+' '+(m.strength||'')+' added to My Medicines.');
  };
  window.addEventListener('load',()=>{if(!ready())setTimeout(()=>{},0)});
})();