import { S, saveState } from '../state.js'

export function exportSave(){
  const blob = new Blob([JSON.stringify(S,null,2)],{type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download='PlanetGame_save.json'; a.click()
  URL.revokeObjectURL(url)
}
export function importSave(file, onDone){
  const reader = new FileReader()
  reader.onload = ()=>{ try{
    const data = JSON.parse(reader.result)
    Object.assign(S, data) // shallow merge; pentru simplitate în demo
    saveState(); onDone?.()
  }catch{ alert('Fișier invalid') } }
  reader.readAsText(file)
}
export function resetGame(){
  if(!confirm('Sigur resetezi jocul?')) return
  localStorage.removeItem('PlanetGame.save'); location.reload()
}
