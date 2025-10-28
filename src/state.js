import { BUILDINGS,  FACILITATI, RESEARCH, UNITS} from './data/consts.js'

// --------- Starea jocului ---------
  const DEFAULT_STATE = {
    res:{M:200, C:100, D:0, E:0, ECap:0},
    buildings:{ MetalMine:1, CrystalMine:1, DeutSynth:0, SolarPlant:1 },
    facilitati:{ Factory:0, Lab:0, Shipyard:0 },
    research:{ Weapons:0, Shields:0, Armour:0 },
    ships:{ SmallFighter:0, LargeFighter:0, Cruiser:0, Battleship:0, Bomber:0 },
    defense:{ Rocket:0, Laser:0, Gauss:0 },
    reports:[],
    lastTick: Date.now()
  }

  let S = loadState() || DEFAULT_STATE


  // ===== Utilitare =====
  function saveState(){ localStorage.setItem('miniOgameSave', JSON.stringify(S)) }
  function loadState(){ try{ return JSON.parse(localStorage.getItem('miniOgameSave')) }catch{ return null } }
  function fmt(n){ return Math.floor(n).toLocaleString('ro-RO') }

  function canAfford(cost){
    return S.res.M>=cost.M && S.res.C>=cost.C && S.res.D>=cost.D
  }
  function pay(cost){ S.res.M-=cost.M; S.res.C-=cost.C; S.res.D-=cost.D }

