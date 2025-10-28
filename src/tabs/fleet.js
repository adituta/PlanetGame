import { UNITS } from '../data/consts.js'
import { S, fmt } from '../state.js'
import { h, byId } from '../ui/dom.js'
import { pushReport } from '../ui/reports.js'
import { simulateBattle, sumFleet, effectiveStats } from '../sim/battle.js'

export function renderFleetTab(root){
  const wrap = h('div',{class:'grid'},[
    h('div',{class:'card'},[
      h('h3',{},'Flota ta'),
      h('table',{id:'myFleetTable',class:'table'}),
      h('div',{class:'sep'}),
      h('h3',{},'Apărare planetară'),
      h('table',{id:'myDefTable',class:'table'}),
    ]),
    h('div',{class:'card'},[
      h('h3',{},'Oponent custom / Țintă'),
      h('div',{id:'opponentBuilder'}),
      h('div',{class:'sep'}),
      h('div',{},[
        h('input',{id:'g',type:'number',placeholder:'Gal',style:'width:80px'}),
        h('input',{id:'s',type:'number',placeholder:'Sist',style:'width:80px'}),
        h('input',{id:'p',type:'number',placeholder:'Planeta (1..10)',style:'width:140px'}),
      ]),
      h('div',{class:'sep'}),
      h('button',{class:'primary', id:'btnSimulate'},'Simulează bătălia'),
      h('button',{id:'btnQuick', style:'margin-left:8px'},'Adversar aleator'),
      h('button',{id:'btnSend', style:'margin-left:8px'},'Trimite flotă')
    ])
  ])
  root.appendChild(wrap)

  renderFleetTables()
  renderOpponentBuilder()

  byId('btnQuick').onclick = ()=>{
    const R = randomOpponent()
    for(const k of Object.keys(UNITS.ships)) byId('op_ship_'+k).value = R.units[k]||0
    for(const k of Object.keys(UNITS.defense)) byId('op_def_'+k).value = R.units[k]||0
    for(const t of ['Weapons','Shields','Armour']) byId('op_tech_'+t).value = R.tech[t]
  }

  byId('btnSimulate').onclick = ()=>{
    const A = { units:{...S.ships}, tech:{...S.research} }
    const D = collectOpponentFromUI()
    const res = simulateBattle(A,D)
    const sumA0 = sumFleet(effectiveStats(A, D.tech))
    const sumD0 = sumFleet(effectiveStats(D, A.tech))
    const sumAf = sumFleet(res.finalA)
    const sumDf = sumFleet(res.finalD)
    pushReport(`
      <div><strong>Rezultat:</strong> <span class="${res.winner.includes('Atacator')?'good':res.winner.includes('Apărător')?'bad':'warn'}">${res.winner}</span></div>
      <div class="sep"></div>
      <table class="table">
        <tr><th></th><th class="right">ATK total</th><th class="right">HP total</th></tr>
        <tr><td>Atacator (inițial)</td><td class="right">${fmt(sumA0.atk)}</td><td class="right">${fmt(sumA0.hp)}</td></tr>
        <tr><td>Apărător (inițial)</td><td class="right">${fmt(sumD0.atk)}</td><td class="right">${fmt(sumD0.hp)}</td></tr>
        <tr><td>Atacator (final)</td><td class="right">${fmt(sumAf.atk)}</td><td class="right">${fmt(sumAf.hp)}</td></tr>
        <tr><td>Apărător (final)</td><td class="right">${fmt(sumDf.atk)}</td><td class="right">${fmt(sumDf.hp)}</td></tr>
      </table>
    `)
  }

  byId('btnSend').onclick = async ()=>{
    const g = parseInt(byId('g').value||'0'), s = parseInt(byId('s').value||'0'), p = parseInt(byId('p').value||'0')
    if(!g||!s||!p){ pushReport('<span class="warn">Completează coordonatele țintei (G/S/P)</span>'); return }
    const send = {}; for(const k of Object.keys(UNITS.ships)){ const n=parseInt(byId('op_ship_'+k).value||'0'); if(n>0) send[k]=n }
    if(Object.keys(send).length===0){ pushReport('<span class="warn">Selectează ce nave trimiți (folosește câmpurile de la „Oponent custom” ca selector rapid).</span>'); return }

    // dacă serverul există → POST misiune; altfel, simulăm local un „success”
    try{
      const resp = await fetch('/api/missions', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ type:'attack', target:{galaxy:g,system:s,pos:p}, units:send }) })
      if(resp.ok){
        const data = await resp.json()
        pushReport(`<strong>Misiune trimisă</strong> către G${g}/S${s}/${p} • id ${data.missionId||'local'}`)
      }else{
        throw new Error('no server')
      }
    }catch{
      // fallback local
      pushReport(`<strong>Misiune (local)</strong> trimisă către G${g}/S${s}/${p}. Adaugă serverul pentru rezolvare în timp real.`)
    }
  }
}

function renderFleetTables(){
  const tableFleet = byId('myFleetTable')
  const tableDef   = byId('myDefTable')
  tableFleet.innerHTML = tableFromUnits(S.ships)
  tableDef.innerHTML   = tableFromUnits(S.defense)
}
function tableFromUnits(dict){
  let html = '<tr><th>Unitate</th><th class="right">Număr</th><th class="right">Atk</th><th class="right">HP</th></tr>'
  for(const [key,n] of Object.entries(dict)){
    const cfg = (UNITS.ships[key] || UNITS.defense[key])
    html += `<tr><td>${cfg.name}</td><td class="right">${fmt(n)}</td><td class="right">${cfg.atk}</td><td class="right">${cfg.hp}</td></tr>`
  }
  return html
}
function renderOpponentBuilder(){
  const root = byId('opponentBuilder'); root.innerHTML=''
  const grid = h('div',{class:'grid-3'})

  const shipCol = h('div',{class:'card'},[
    h('div',{class:'label'},'Nave (selectează pentru simulare / trimitere)'),
    ...Object.entries(UNITS.ships).map(([k,c])=>h('div',{class:'item'},[
      h('span',{},`${c.name}`),
      h('input',{type:'number',min:0,value:0,id:'op_ship_'+k,style:'width:90px'})
    ]))
  ])

  const defCol = h('div',{class:'card'},[
    h('div',{class:'label'},'Apărare (pt. simulare)'),
    ...Object.entries(UNITS.defense).map(([k,c])=>h('div',{class:'item'},[
      h('span',{},`${c.name}`),
      h('input',{type:'number',min:0,value:0,id:'op_def_'+k,style:'width:90px'})
    ]))
  ])

  const techCol = h('div',{class:'card'},[
    h('div',{class:'label'},'Tehnologii oponent'),
    ...['Weapons','Shields','Armour'].map(t=>h('div',{class:'item'},[
      h('span',{},t),
      h('input',{type:'number',min:0,value:0,id:'op_tech_'+t,style:'width:90px'})
    ]))
  ])

  grid.appendChild(shipCol); grid.appendChild(defCol); grid.appendChild(techCol)
  root.appendChild(grid)
}
function collectOpponentFromUI(){
  const units={}, tech={Weapons:0,Shields:0,Armour:0}
  for(const k of Object.keys(UNITS.ships))   units[k] = parseInt(byId('op_ship_'+k).value||'0')
  for(const k of Object.keys(UNITS.defense)) units[k] = (units[k]||0) + parseInt(byId('op_def_'+k).value||'0')
  for(const t of ['Weapons','Shields','Armour']) tech[t] = parseInt(byId('op_tech_'+t).value||'0')
  return { units, tech }
}
function randomOpponent(){
  const A = { units:{...S.ships, ...S.defense}, tech:{Weapons:0,Shields:0,Armour:0} }
  const me = effectiveStats(A, {Weapons:0,Shields:0,Armour:0}); const targetHP = sumFleet(me).hp * (0.8 + Math.random()*0.4)
  const keys=[...Object.keys(UNITS.ships), ...Object.keys(UNITS.defense)]; const units={}; let hp=0
  while(hp<targetHP){ const k=keys[Math.floor(Math.random()*keys.length)]; const base=(UNITS.ships[k]||UNITS.defense[k]); units[k]=(units[k]||0)+1; hp+=base.hp }
  const tech={Weapons:Math.floor(Math.random()*3),Shields:Math.floor(Math.random()*3),Armour:Math.floor(Math.random()*3)}
  return { units, tech }
}
