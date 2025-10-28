import { BUILDINGS, FACILITATI, RESEARCH, UNITS } from './data/consts.js'

export let S

const DEFAULT_STATE = {
  res: { M: 200, C: 100, D: 0, E: 0, ECap: 0 },
  buildings: { MetalMine: 1, CrystalMine: 1, DeutSynth: 0, SolarPlant: 1 },
  facilitati: { Factory: 0, Lab: 0, Shipyard: 0 },
  research: { Weapons: 0, Shields: 0, Armour: 0 },
  ships: { SmallFighter: 0, LargeFighter: 0, Cruiser: 0, Battleship: 0, Bomber: 0 },
  defense: { Rocket: 0, Laser: 0, Gauss: 0 },
  reports: [],
  lastTick: Date.now(),
}

export function initState() {
  const saved = loadState()
  S = saved || structuredClone(DEFAULT_STATE)
  S.tick = tick
}

export function saveState() {
  localStorage.setItem('PlanetGame.save', JSON.stringify({ ...S, tick: undefined }))
}
export function loadState() {
  try { return JSON.parse(localStorage.getItem('PlanetGame.save')) } catch { return null }
}
export function fmt(n) { return Math.floor(n).toLocaleString('ro-RO') }
export function canAfford(cost) { return S.res.M >= cost.M && S.res.C >= cost.C && S.res.D >= cost.D }
export function pay(cost) { S.res.M -= cost.M; S.res.C -= cost.C; S.res.D -= cost.D }

export function buildingOutput() {
  const mm = BUILDINGS.MetalMine, cm = BUILDINGS.CrystalMine, ds = BUILDINGS.DeutSynth, sp = BUILDINGS.SolarPlant
  const prodM = mm.base * Math.pow(S.buildings.MetalMine, mm.growth)
  const prodC = cm.base * Math.pow(S.buildings.CrystalMine, cm.growth)
  const prodD = ds.base * Math.pow(S.buildings.DeutSynth, ds.growth)
  const energyCap = 20 * Math.pow(S.buildings.SolarPlant, sp.growth)
  const energyUse = (mm.energy*S.buildings.MetalMine)+(cm.energy*S.buildings.CrystalMine)+(ds.energy*S.buildings.DeutSynth)
  const f = Math.min(1, energyCap / Math.max(1, energyUse))
  return { prodM: prodM*f, prodC: prodC*f, prodD: prodD*f, energyCap, energyUse }
}

function tick() {
  const now = Date.now(); const dt = Math.max(0, (now - S.lastTick) / 1000); S.lastTick = now
  const out = buildingOutput()
  S.res.M += out.prodM * dt; S.res.C += out.prodC * dt; S.res.D += out.prodD * dt
  S.res.E = Math.max(0, out.energyCap - out.energyUse); S.res.ECap = out.energyCap
}

export function scaledCost(base, lvl) {
  const f = 1 + 0.15 * lvl - 0.02 * S.facilitati.Factory
  return { M: Math.ceil(base.M * f), C: Math.ceil(base.C * f), D: Math.ceil(base.D * f) }
}

export function upgradeBuilding(key) {
  const lvl = S.buildings[key]; const cost = scaledCost(BUILDINGS[key].cost, lvl)
  if (!canAfford(cost)) return false; pay(cost); S.buildings[key]++; return true
}
export function upgradeFacilitate(key) {
  const lvl = S.facilitati[key]; const base = FACILITATI[key].cost; const cost = scaledCost(base, lvl)
  if (!canAfford(cost)) return false; pay(cost); S.facilitati[key]++; return true
}
export function doResearch(key) {
  if (S.facilitati.Lab <= 0) return false
  const lvl = S.research[key]; const cost = scaledCost(RESEARCH[key].cost, lvl)
  if (!canAfford(cost)) return false; pay(cost); S.research[key]++; return true
}
export function buildUnit(kind, key) {
  const cfg = UNITS[kind][key]; if (!canAfford(cfg.cost)) return false
  if (kind === 'ships' && S.facilitati.Shipyard <= 0) return false
  pay(cfg.cost); S[kind][key]++; return true
}

export { BUILDINGS, FACILITATI, RESEARCH, UNITS }
