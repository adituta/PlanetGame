import express from 'express'
import http from 'http'
import { Server as IOServer } from 'socket.io'
import cors from 'cors'

const PORT = 5173
const app = express(); const server = http.createServer(app); const io = new IOServer(server)
app.use(cors()); app.use(express.json())

// univers toy în memorie
const universe = new Map()
for(let g=1;g<=2;g++) for(let s=1;s<=20;s++){
  const key=`G${g}-S${s}`; const arr=[]
  for(let p=1;p<=10;p++) arr.push({ galaxy:g, system:s, pos:p, name:`Planeta ${p}`, owner:`NPC-${g}-${s}-${p}`, power: Math.floor(50+Math.random()*500) })
  universe.set(key, arr)
}

app.get('/api/universe/:g/:s', (req,res)=>{
  const g=+req.params.g, s=+req.params.s
  res.json({ planets: universe.get(`G${g}-S${s}`)||[] })
})

app.post('/api/missions', (req,res)=>{
  const { target, units } = req.body
  const missionId = Math.random().toString(36).slice(2,10)
  // demo: rezolvăm instant – câștigă atacatorul dacă trimite ≥ 5 vânători mici :)
  const total = Object.values(units||{}).reduce((a,b)=>a+b,0)
  const winner = total>=5 ? 'Atacator' : 'Apărător'
  io.emit('mission:result', { missionId, target, winner })
  res.json({ ok:true, missionId })
})

server.listen(PORT, ()=>console.log('Server running on http://localhost:'+PORT))
