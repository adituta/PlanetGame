import { UNITS } from '../data/consts.js'

export function effectiveStats(attacker, defenderTech){
  const W=attacker.tech?.Weapons||0, A=attacker.tech?.Armour||0, Sh=defenderTech?.Shields||0
  const atkMult=1+0.10*W, hpMult=1+0.10*A, dmgVsDef=1-Math.min(0.5,0.05*Sh)
  const units={}
  for(const [key,n] of Object.entries(attacker.units||{})){
    if(n<=0) continue
    const base = UNITS.ships[key] || UNITS.defense[key]
    if(!base) continue
    units[key]={ n, atk:base.atk*atkMult*dmgVsDef, hp:base.hp*hpMult }
  }
  return units
}
export function sumFleet(units){ let atk=0,hp=0; for(const u of Object.values(units)){ atk+=u.atk*u.n; hp+=u.hp*u.n } return {atk,hp} }
function applyDamage(units,dmg){
  let totalHP=0; for(const u of Object.values(units)) totalHP+=u.hp*u.n
  if(totalHP<=0||dmg<=0) return units
  const out={}
  for(const [k,u] of Object.entries(units)){
    const share=(u.hp*u.n)/totalHP; const dmgHere=dmg*share
    const unitsLost=Math.min(u.n, Math.floor(dmgHere/u.hp))
    const leftover=dmgHere-unitsLost*u.hp; const extra=(leftover>0.8*u.hp)?1:0
    const nNew=Math.max(0,u.n-unitsLost-extra); if(nNew>0) out[k]={...u,n:nNew}
  }
  return out
}
export function simulateBattle(A,D,rounds=6){
  let a=effectiveStats(A,D.tech), d=effectiveStats(D,A.tech); const timeline=[]
  for(let r=1;r<=rounds;r++){
    const Sa=sumFleet(a), Sd=sumFleet(d); if(Sa.hp<=0||Sd.hp<=0) break
    d=applyDamage(d,Sa.atk); a=applyDamage(a,Sd.atk)
    timeline.push({r, A:sumFleet(a), D:sumFleet(d)})
  }
  const Sa=sumFleet(a), Sd=sumFleet(d)
  const winner = Sa.hp>0&&Sd.hp<=0 ? 'Atacator' : (Sd.hp>0&&Sa.hp<=0 ? 'Apărător' : (Sa.hp>Sd.hp?'Atacator (puncte)':(Sd.hp>Sa.hp?'Apărător (puncte)':'Egal')))
  return { winner, finalA:a, finalD:d, timeline }
}
import { UNITS } from '../data/consts.js'

export function effectiveStats(attacker, defenderTech){
  const W=attacker.tech?.Weapons||0, A=attacker.tech?.Armour||0, Sh=defenderTech?.Shields||0
  const atkMult=1+0.10*W, hpMult=1+0.10*A, dmgVsDef=1-Math.min(0.5,0.05*Sh)
  const units={}
  for(const [key,n] of Object.entries(attacker.units||{})){
    if(n<=0) continue
    const base = UNITS.ships[key] || UNITS.defense[key]
    if(!base) continue
    units[key]={ n, atk:base.atk*atkMult*dmgVsDef, hp:base.hp*hpMult }
  }
  return units
}
export function sumFleet(units){ let atk=0,hp=0; for(const u of Object.values(units)){ atk+=u.atk*u.n; hp+=u.hp*u.n } return {atk,hp} }
function applyDamage(units,dmg){
  let totalHP=0; for(const u of Object.values(units)) totalHP+=u.hp*u.n
  if(totalHP<=0||dmg<=0) return units
  const out={}
  for(const [k,u] of Object.entries(units)){
    const share=(u.hp*u.n)/totalHP; const dmgHere=dmg*share
    const unitsLost=Math.min(u.n, Math.floor(dmgHere/u.hp))
    const leftover=dmgHere-unitsLost*u.hp; const extra=(leftover>0.8*u.hp)?1:0
    const nNew=Math.max(0,u.n-unitsLost-extra); if(nNew>0) out[k]={...u,n:nNew}
  }
  return out
}
export function simulateBattle(A,D,rounds=6){
  let a=effectiveStats(A,D.tech), d=effectiveStats(D,A.tech); const timeline=[]
  for(let r=1;r<=rounds;r++){
    const Sa=sumFleet(a), Sd=sumFleet(d); if(Sa.hp<=0||Sd.hp<=0) break
    d=applyDamage(d,Sa.atk); a=applyDamage(a,Sd.atk)
    timeline.push({r, A:sumFleet(a), D:sumFleet(d)})
  }
  const Sa=sumFleet(a), Sd=sumFleet(d)
  const winner = Sa.hp>0&&Sd.hp<=0 ? 'Atacator' : (Sd.hp>0&&Sa.hp<=0 ? 'Apărător' : (Sa.hp>Sd.hp?'Atacator (puncte)':(Sd.hp>Sa.hp?'Apărător (puncte)':'Egal')))
  return { winner, finalA:a, finalD:d, timeline }
}
