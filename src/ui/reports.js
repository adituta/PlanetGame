import { S, saveState } from '../state.js'

export function pushReport(html){
  const t = new Date().toLocaleString('ro-RO')
  S.reports.unshift(`<div><span class="hint">${t}</span><div>${html}</div></div>`)
  document.getElementById('reportLog').innerHTML = S.reports.map(r=>`<div class="sep"></div>${r}`).join('')
  saveState()
}
