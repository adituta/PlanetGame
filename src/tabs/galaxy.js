import { pushReport } from '../ui/reports.js'
import { h } from '../ui/dom.js'

const STATE = { galaxy: 1, system: 1 }

async function fetchPlanets(g,s){
  try{
    const res = await fetch(`/api/universe/${g}/${s}`)
    if(!res.ok) throw new Error('no server')
    return await res.json() // { planets:[...] }
  }catch{
    // fallback local mock: 10 planete NPC
    return {
      planets: Array.from({length:10},(_,i)=>({ galaxy:g, system:s, pos:i+1, name:`Planeta ${i+1}`, owner:`NPC-${g}-${s}-${i+1}`, power: Math.floor(50+Math.random()*500) }))
    }
  }
}

export function renderGalaxyTab(root){
  const card = h('div',{class:'card'},[
    h('h3',{},'Galaxie'),
    h('div',{},[
      h('button',{id:'gPrev'},'◀'),
      h('span',{style:'margin:0 6px'},'G'),
      h('input',{id:'gal', type:'number', min:1, value:STATE.galaxy, style:'width:80px'}),
      h('span',{style:'margin:0 6px'},'S'),
      h('input',{id:'sys', type:'number', min:1, value:STATE.system, style:'width:80px'}),
      h('button',{id:'gNext', style:'margin-left:6px'},'▶'),
      h('input',{id:'searchPlayer', placeholder:'Caută jucător...', style:'margin-left:auto'}),
      h('button',{id:'btnSearch'},'Caută')
    ]),
    h('div',{id:'planetList', class:'list', style:'margin-top:8px'}),
  ])
  root.appendChild(card)

  const refresh = async ()=>{
    const data = await fetchPlanets(STATE.galaxy, STATE.system)
    const list = card.querySelector('#planetList'); list.innerHTML=''
    data.planets.forEach(p=>{
      const row = h('div',{class:'item'},[
        h('div',{},[
          h('div',{},`${p.pos}. ${p.name}`),
          h('div',{class:'hint'},`${p.owner} • putere ${p.power}`)
        ]),
        h('button',{class:'primary', onclick:()=>{
          const evt=new CustomEvent('fleet:prepare',{detail:{target:p}}); window.dispatchEvent(evt)
          pushReport(`Ținta selectată: <strong>${p.name}</strong> (G${p.galaxy}/S${p.system}/${p.pos}) — mergi în tabul „Flotă”.`)
        }},'Atacă')
      ])
      list.appendChild(row)
    })
  }

  card.querySelector('#gPrev').onclick = ()=>{ STATE.system = Math.max(1, STATE.system-1); refresh() }
  card.querySelector('#gNext').onclick = ()=>{ STATE.system = STATE.system+1; refresh() }
  card.querySelector('#gal').onchange = (e)=>{ STATE.galaxy=parseInt(e.target.value||'1'); refresh() }
  card.querySelector('#sys').onchange = (e)=>{ STATE.system=parseInt(e.target.value||'1'); refresh() }
  card.querySelector('#btnSearch').onclick = ()=>{
    const q = card.querySelector('#searchPlayer').value.trim()
    if(!q){ pushReport('Introdu un nume ca să cauți.'); return }
    pushReport(`(Mock) Rezultate pentru „${q}”: NPC-1 @ G1/S1/3, NPC-2 @ G1/S2/7`)
  }

  // când selectezi planetă în Galaxie, pre-populează tabul Flotă (dacă e deschis)
  window.addEventListener('fleet:prepare',(e)=>{
    // doar semnal; tabul Flotă citește evenimentul
  })

  refresh()
}
