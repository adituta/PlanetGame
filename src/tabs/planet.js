import { BUILDINGS, FACILITATI, RESEARCH, UNITS } from '../data/consts.js'
import { S, fmt, scaledCost, canAfford, pay, upgradeBuilding, upgradeFacilitate, doResearch, buildUnit } from '../state.js'
import { h, byId } from '../ui/dom.js'

export function renderPlanetTab(root){
  const left = h('div',{class:'card'},[ h('h3',{},'Clădiri & producție'), h('div',{id:'buildingsList',class:'list'}) ])
  const mid  = h('div',{class:'card'},[ h('h3',{},'Facilități'), h('div',{id:'facilitatiList',class:'list'}) ])
  const right= h('div',{class:'card'},[ h('h3',{},'Cercetare'), h('div',{id:'researchList',class:'list'}) ])
  const yard = h('div',{class:'card'},[ h('h3',{},'Șantier & Apărare'), h('div',{id:'shipList',class:'list'}), h('div',{id:'defList',class:'list', style:'margin-top:8px'}) ])

  const grid = h('div',{class:'grid-3'},[left, mid, right])
  root.appendChild(grid)
  root.appendChild(yard)

  renderBuildingsList()
  renderFacilitati()
  renderResearch()
  renderShips()
  renderDefense()
}

function renderBuildingsList(){
  const root = byId('buildingsList'); root.innerHTML=''
  Object.entries(S.buildings).forEach(([key, lvl])=>{
    const cfg = BUILDINGS[key]; const cost = scaledCost(cfg.cost, lvl)
    const btn = h('button',{class:'primary', onclick:()=>{ if(upgradeBuilding(key)){ renderBuildingsList() } }},'Modernizează')
    if(!canAfford(cost)) btn.disabled = true
    root.appendChild(h('div',{class:'item'},[
      h('div',{},[
        h('div',{class:'label'}, cfg.name),
        h('div',{class:'hint'}, `Nivel: ${lvl} • Cost: M ${fmt(cost.M)} / C ${fmt(cost.C)} / D ${fmt(cost.D)}`),
      ]),
      btn
    ]))
  })
}

function renderFacilitati(){
  const root = byId('facilitatiList'); root.innerHTML=''
  Object.entries(FACILITATI).forEach(([key, cfg])=>{
    const lvl = S.facilitati[key]; const cost = scaledCost(cfg.cost, lvl)
    const btn = h('button',{class:'primary', onclick:()=>{ if(upgradeFacilitate(key)){ renderFacilitati() } }},'Modernizează')
    if(!canAfford(cost)) btn.disabled = true
    root.appendChild(h('div',{class:'item'},[
      h('div',{},[
        h('div',{class:'label'}, cfg.name),
        h('div',{class:'hint'}, `Nivel: ${lvl} • Cost: M ${fmt(cost.M)} / C ${fmt(cost.C)} / D ${fmt(cost.D)}`),
      ]),
      btn
    ]))
  })
}

function renderResearch(){
  const root = byId('researchList'); root.innerHTML=''
  Object.entries(RESEARCH).forEach(([key, cfg])=>{
    const lvl = S.research[key]; const cost = scaledCost(cfg.cost, lvl)
    const btn = h('button',{class:'primary', onclick:()=>{ if(doResearch(key)){ renderResearch() } }},'Cercetează')
    if(!canAfford(cost) || S.facilitati.Lab<=0) btn.disabled = true
    root.appendChild(h('div',{class:'item'},[
      h('div',{},[
        h('div',{class:'label'}, `${cfg.name} (lvl ${lvl})`),
        h('div',{class:'hint'}, `${cfg.desc} • Cost: M ${fmt(cost.M)} / C ${fmt(cost.C)} / D ${fmt(cost.D)}`),
      ]),
      btn
    ]))
  })
}

function renderShips(){
  const root = byId('shipList'); root.innerHTML=''
  Object.entries(UNITS.ships).forEach(([key,cfg])=>{
    const btn = h('button',{class:'primary', onclick:()=>{ if(buildUnit('ships',key)){ renderShips() } }},'Construiește 1')
    if(!canAfford(cfg.cost) || S.facilitati.Shipyard<=0) btn.disabled=true
    root.appendChild(h('div',{class:'item'},[
      h('div',{},[
        h('div',{class:'label'}, cfg.name),
        h('div',{class:'hint'}, `Cost: M ${fmt(cfg.cost.M)} / C ${fmt(cfg.cost.C)} / D ${fmt(cfg.cost.D)} • Atk ${cfg.atk} • HP ${cfg.hp}`),
      ]),
      h('div',{},[ h('span',{class:'hint', style:'margin-right:8px'}, `Deții: ${S.ships[key]}`), btn ])
    ]))
  })
}
function renderDefense(){
  const root = byId('defList'); root.innerHTML=''
  Object.entries(UNITS.defense).forEach(([key,cfg])=>{
    const btn = h('button',{class:'primary', onclick:()=>{ if(buildUnit('defense',key)){ renderDefense() } }},'Construiește 1')
    if(!canAfford(cfg.cost)) btn.disabled=true
    root.appendChild(h('div',{class:'item'},[
      h('div',{},[
        h('div',{class:'label'}, cfg.name),
        h('div',{class:'hint'}, `Cost: M ${fmt(cfg.cost.M)} / C ${fmt(cfg.cost.C)} / D ${fmt(cfg.cost.D)} • Atk ${cfg.atk} • HP ${cfg.hp}`),
      ]),
      h('div',{},[ h('span',{class:'hint', style:'margin-right:8px'}, `Deții: ${S.defense[key]}`), btn ])
    ]))
  })
}
