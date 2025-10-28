import { S, fmt, buildingOutput } from '../state.js'
import { byId } from './dom.js'

export function renderHUD(){
  const el=document.getElementById('hud')
  const out=buildingOutput()
  el.innerHTML = `
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <div>Metal: <strong>${fmt(S.res.M)}</strong> <span class="hint">(+${fmt(out.prodM)}/s)</span></div>
      <div>Cristal: <strong>${fmt(S.res.C)}</strong> <span class="hint">(+${fmt(out.prodC)}/s)</span></div>
      <div>Deuteriu: <strong>${fmt(S.res.D)}</strong> <span class="hint">(+${fmt(out.prodD)}/s)</span></div>
      <div>Energie: <strong>${fmt(S.res.E)}</strong> <span class="hint">(cap ${fmt(S.res.ECap)})</span></div>
    </div>
  `
}
