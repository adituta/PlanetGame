export const UNITS = {
  ships: {
    SmallFighter: { name: 'Vânător mic',     cost: { M: 800,  C: 400,  D: 0 },    atk: 50,  hp: 150 },
    LargeFighter: { name: 'Vânător mare',    cost: { M: 3000, C: 1000, D: 0 },    atk: 120, hp: 400 },
    Cruiser:      { name: 'Crucişător',      cost: { M: 7000, C: 4000, D: 1000 }, atk: 300, hp: 900 },
    Battleship:   { name: 'Cuirasat',        cost: { M: 12000,C: 6000, D: 2000 }, atk: 600, hp: 2000 },
    Bomber:       { name: 'Bombardier',      cost: { M: 20000,C: 10000,D: 6000 }, atk: 900, hp: 2800 },
  },
  defense: {
    Rocket: { name: 'Rachetă',      cost: { M: 1500, C: 500,  D: 0 },   atk: 80,  hp: 300 },
    Laser:  { name: 'Turelă laser', cost: { M: 3000, C: 1500, D: 0 },   atk: 160, hp: 700 },
    Gauss:  { name: 'Tun Gauss',    cost: { M: 8000, C: 5000, D: 2000}, atk: 420, hp: 2200 },
  }
}

export const BUILDINGS = {
  MetalMine:   { name:'Mină de Metal',   base:20, growth:1.2,  energy:2, cost:{M:60,  C:15, D:0} },
  CrystalMine: { name:'Mină de Cristal', base:12, growth:1.2,  energy:2, cost:{M:48,  C:24, D:0} },
  DeutSynth:   { name:'Sintetizator D',  base:6,  growth:1.2,  energy:3, cost:{M:100, C:50, D:0} },
  SolarPlant:  { name:'Centrală solară', base:20, growth:1.25, energy:0, cost:{M:80,  C:30, D:0} },
}

export const FACILITATI = {
  Factory:  { name:'Fabrică',   cost:{M:200, C:100, D:0} },
  Lab:      { name:'Laborator', cost:{M:250, C:150, D:50} },
  Shipyard: { name:'Șantier',   cost:{M:300, C:200, D:80} },
}

export const RESEARCH = {
  Weapons: { name:'Arme',    desc:'+10% atac / nivel',  cost:{M:400, C:200, D:100} },
  Shields: { name:'Scuturi', desc:'-5% daune / nivel',  cost:{M:300, C:300, D:200} },
  Armour:  { name:'Blindaj', desc:'+10% viață / nivel', cost:{M:300, C:150, D:200} },
}
