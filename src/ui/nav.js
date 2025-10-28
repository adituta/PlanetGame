export function makeMenu(items, onChange){
  const nav=document.getElementById('menu'); nav.innerHTML=''
  items.forEach((it,i)=>{
    const b=document.createElement('button'); b.textContent=it.label; if(i===0) b.classList.add('active')
    b.onclick=()=>{ nav.querySelectorAll('button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); onChange(it.id) }
    nav.appendChild(b)
  })
  onChange(items[0].id)
}
