import { ipcRenderer } from "electron";

document.addEventListener('DOMContentLoaded', ()=>{
});

// Dev
ipcRenderer.invoke('dev:check').then((isDev)=>{
  if (!isDev) return;
  window.addEventListener('keypress', ({ctrlKey, code})=>{
    if (ctrlKey && code === 'KeyR') location.reload();
  });
  let prev = document.querySelector('[main-css]');
  let current = document.createElement('link');
  current.rel = 'stylesheet';
  current.href = './style.css?' + Date.now();
  current.setAttribute('main-css', '');
  document.head.append(current);
  prev?.remove();
});