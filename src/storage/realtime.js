export function connectRealtime(){
  // dacă nu există Socket.IO client, nu facem nimic.
  if(typeof io === 'undefined'){ console.info('Socket.IO client absent (serverul nu rulează) – e ok.'); return }
  const socket = io()
  socket.on('connect',()=>console.log('[RT] connected', socket.id))
  socket.on('mission:result', (data)=>{
    const log=document.getElementById('reportLog')
    const t=new Date().toLocaleString('ro-RO')
    const div=document.createElement('div')
    div.innerHTML=`<div class="hint">${t}</div><div><strong>Rezultat misiune (RT):</strong> ${data.winner} la G${data.target?.galaxy}/S${data.target?.system}/${data.target?.pos}</div><div class="sep"></div>`
    log.prepend(div)
  })
}
