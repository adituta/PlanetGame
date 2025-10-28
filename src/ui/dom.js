export const byId = (id) => document.getElementById(id)

export function h(tag, attrs={}, children=[]){
  const el=document.createElement(tag)
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') el.className=v
    else if(k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v)
    else if(k==='html') el.innerHTML=v
    else el.setAttribute(k,v)
  })
  ;(Array.isArray(children)?children:[children]).filter(Boolean).forEach(c=>{
    if(typeof c==='string') el.appendChild(document.createTextNode(c))
    else el.appendChild(c)
  })
  return el
}
