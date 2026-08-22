/* PRIME HOSPITAL UNIVERSAL KEYBOARD NAVIGATION
   Tab = next useful field. Shift+Tab = previous field.
   Shortcut/template buttons are intentionally skipped so mouse use is minimized.
*/
(function(){
  const isVisible=e=>!!e&&e.offsetParent!==null&&!e.disabled;
  function controls(root){
    if(!root)return[];
    return [...root.querySelectorAll('input,select,textarea')].filter(e=>isVisible(e)&&e.type!=='hidden'&&!e.readOnly&&e.tabIndex!==-1);
  }
  function normalize(root){
    if(!root)return;
    root.querySelectorAll('input,select,textarea').forEach(e=>{if(e.type==='hidden'||e.readOnly||e.disabled)e.tabIndex=-1;else if(e.tabIndex<0)e.tabIndex=0});
    root.querySelectorAll('button,a').forEach(e=>{if(!e.dataset.keyboardKeep)e.tabIndex=-1});
    const final=root.querySelector('.actions:last-of-type');
    if(final)final.querySelectorAll('button,a').forEach(e=>{e.dataset.keyboardKeep='1';e.tabIndex=0});
  }
  function install(){
    const root=document.getElementById('consultView');
    if(!root)return;
    normalize(root);
    if(root.dataset.primeKeyboard==='1')return;
    root.dataset.primeKeyboard='1';
    root.addEventListener('keydown',e=>{
      if(e.key!=='Tab')return;
      const list=controls(root),i=list.indexOf(e.target);
      if(i<0)return;
      const next=e.shiftKey?list[i-1]:list[i+1];
      if(next){e.preventDefault();next.focus();return}
      if(!e.shiftKey){
        const acts=root.querySelector('.actions:last-of-type');
        const b=acts&&[...acts.querySelectorAll('button,a')].find(isVisible);
        if(b){e.preventDefault();b.focus()}
      }
    },true);
    root.addEventListener('click',()=>setTimeout(()=>normalize(root),0));
  }
  function watch(){install();const root=document.getElementById('consultView');if(root&&!root.dataset.primeKeyboardObserver){root.dataset.primeKeyboardObserver='1';new MutationObserver(()=>normalize(root)).observe(root,{childList:true,subtree:true})}}
  window.addEventListener('load',watch);setTimeout(watch,800);setTimeout(watch,1800);window.PrimeKeyboard={install,normalize};
})();