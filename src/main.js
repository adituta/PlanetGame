console.log('main.js LOADED')
document.getElementById('menu').innerHTML = '<button>Test</button>'


import { initState, S, saveState } from './state.js'
import { renderHUD } from './ui/hud.js'
import { makeMenu } from './ui/nav.js'
import { renderPlanetTab } from './tabs/planet.js'
import { renderFleetTab } from './tabs/fleet.js'
import { renderGalaxyTab } from './tabs/galaxy.js'
import { exportSave, importSave, resetGame } from './storage/persist.js'
import { connectRealtime } from './storage/realtime.js'

initState()
renderHUD()

const TABS = {
  planeta: renderPlanetTab,
  galaxie: renderGalaxyTab,
  flota: renderFleetTab,
}

makeMenu(
  [
    { id: 'planeta', label: 'Planeta' },
    { id: 'galaxie', label: 'Galaxie' },
    { id: 'flota', label: 'Flotă' },
  ],
  (id) => {
    const root = document.getElementById('tab-root')
    root.innerHTML = ''
    TABS[id]?.(root)
  }
)

// tick simplu
setInterval(() => {
  S.tick()
  renderHUD()
  saveState()
}, 1000)

// export/import/reset din bara de jos
document.getElementById('btnExport').onclick = exportSave
document.getElementById('btnReset').onclick = resetGame
document.getElementById('fileImport').addEventListener('change', (e) => {
  const f = e.target.files?.[0]; if (!f) return
  importSave(f, () => { renderHUD() })
})

connectRealtime() // e safe și când serverul nu rulează
