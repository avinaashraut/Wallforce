const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const gallery = document.getElementById("gallery")

let zip = new JSZip()

function rand(){ return Math.random() }

const PHI = 0.618

function goldenPoint(){
let x = canvas.width * PHI
let y = canvas.height * PHI
if(Math.random()>0.5) x = canvas.width*(1-PHI)
if(Math.random()>0.5) y = canvas.height*(1-PHI)
return {x,y}
}

function setupCanvas(){
let device=document.getElementById("device").value
let res=document.getElementById("resolution").value

if(device==="mobile"){
if(res==="hd"){canvas.width=720;canvas.height=1280}
if(res==="2k"){canvas.width=1440;canvas.height=2560}
if(res==="4k"){canvas.width=2160;canvas.height=3840}
}

if(device==="desktop"){
if(res==="hd"){canvas.width=1280;canvas.height=720}
if(res==="2k"){canvas.width=2560;canvas.height=1440}
if(res==="4k"){canvas.width=3840;canvas.height=2160}
}
}

function gradient(){
let g=ctx.createLinearGradient(0,0,canvas.width,canvas.height)
g.addColorStop(0,`hsl(${rand()*360},60%,40%)`)
g.addColorStop(1,`hsl(${rand()*360},60%,60%)`)
ctx.fillStyle=g
ctx.fillRect(0,0,canvas.width,canvas.height)
}

function drawAbstract(){
gradient()
for(let i=0;i<20;i++){
let p=goldenPoint()
ctx.beginPath()
ctx.arc(p.x+(rand()-0.5)*300,p.y+(rand()-0.5)*300,rand()*200,0,Math.PI*2)
ctx.fillStyle=`hsla(${rand()*360},70%,70%,0.15)`
ctx.fill()
}
}

function drawTerrain(){
gradient()
for(let l=0;l<4;l++){
ctx.beginPath()
ctx.moveTo(0,canvas.height)
for(let x=0;x<=canvas.width;x+=10){
let y=canvas.height*(0.6+l*0.08)+Math.sin(x*0.01)*120
ctx.lineTo(x,y)
}
ctx.lineTo(canvas.width,canvas.height)
ctx.fillStyle=`rgba(20,30,50,${0.8-l*0.2})`
ctx.fill()
}
}

function drawCosmic(){
ctx.fillStyle="black"
ctx.fillRect(0,0,canvas.width,canvas.height)

let p=goldenPoint()

for(let i=0;i<6;i++){
let r=300+rand()*300
let g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r)
g.addColorStop(0,`hsla(${rand()*360},80%,60%,0.5)`)
g.addColorStop(1,"rgba(0,0,0,0)")
ctx.fillStyle=g
ctx.beginPath()
ctx.arc(p.x,p.y,r,0,Math.PI*2)
ctx.fill()
}

for(let i=0;i<2000;i++){
let s=rand()*2
ctx.fillStyle="white"
ctx.fillRect(rand()*canvas.width,rand()*canvas.height,s,s)
}
}

function drawFlow(){
ctx.fillStyle="white"
ctx.fillRect(0,0,canvas.width,canvas.height)
ctx.strokeStyle="#111"
for(let y=0;y<canvas.height;y+=25){
ctx.beginPath()
ctx.moveTo(0,y)
for(let x=0;x<canvas.width;x+=40){
ctx.lineTo(x,y+Math.sin(x*0.02+y*0.02)*80)
}
ctx.stroke()
}
}

function drawWaves(){
gradient()
ctx.strokeStyle="white"
for(let x=0;x<canvas.width;x+=6){
let y=canvas.height/2+Math.sin(x*0.02)*200
ctx.beginPath()
ctx.moveTo(x,y)
ctx.lineTo(x,y+300)
ctx.stroke()
}
}

function drawBrush(){
ctx.fillStyle="#f5f5f5"
ctx.fillRect(0,0,canvas.width,canvas.height)

let p=goldenPoint()

ctx.strokeStyle="#111"
ctx.lineWidth=80
ctx.lineCap="round"

ctx.beginPath()
ctx.moveTo(p.x-300,p.y+200)
ctx.bezierCurveTo(p.x-100,p.y-300,p.x+200,p.y+300,p.x+300,p.y-200)
ctx.stroke()
}

function cinematicFinish(){

let img = ctx.getImageData(0,0,canvas.width,canvas.height)
let d = img.data

for(let i=0;i<d.length;i+=4){
let grain = (Math.random()*12)-6
d[i]+=grain
d[i+1]+=grain
d[i+2]+=grain
}

ctx.putImageData(img,0,0)

let v = ctx.createRadialGradient(
canvas.width/2,canvas.height/2,canvas.width*0.3,
canvas.width/2,canvas.height/2,canvas.width*0.9
)

v.addColorStop(0,"rgba(0,0,0,0)")
v.addColorStop(1,"rgba(0,0,0,0.4)")

ctx.fillStyle=v
ctx.fillRect(0,0,canvas.width,canvas.height)
}

function draw(){

let engine=document.getElementById("engine").value

if(engine==="all"){
let engines=["abstract","terrain","cosmic","flow","waves","brush"]
engine=engines[Math.floor(rand()*engines.length)]
}

if(engine==="abstract") drawAbstract()
if(engine==="terrain") drawTerrain()
if(engine==="cosmic") drawCosmic()
if(engine==="flow") drawFlow()
if(engine==="waves") drawWaves()
if(engine==="brush") drawBrush()

cinematicFinish()
}

function qualityCheck(){
let img=ctx.getImageData(0,0,canvas.width,canvas.height)
let data=img.data
let total=0
for(let i=0;i<data.length;i+=40){ total+=data[i] }
let brightness=total/(data.length/40)
return brightness>50 && brightness<600
}

async function generateBatch(){

setupCanvas()

let amount=parseInt(document.getElementById("amount").value)

gallery.innerHTML=""
zip=new JSZip()

let saved=0

for(let i=0;i<amount;i++){

ctx.clearRect(0,0,canvas.width,canvas.height)
draw()

if(!qualityCheck()) continue

let data=canvas.toDataURL("image/png")

zip.file(`wallpaper_${saved}.png`,data.split(",")[1],{base64:true})

if(saved<20){
let img=new Image()
img.src=data
gallery.appendChild(img)
}

saved++
updateProgress(saved,amount)

await new Promise(r=>setTimeout(r,10))

}
}

function updateProgress(current,total){
let percent=(current/total)*100
document.getElementById("progressBar").style.width=percent+"%"
}

function downloadZip(){

zip.generateAsync({type:"blob"}).then(function(content){

let link=document.createElement("a")
link.href=URL.createObjectURL(content)
link.download="wallpapers.zip"
link.click()

})

}

function surprise(){

let engines=["abstract","terrain","cosmic","flow","waves","brush"]
document.getElementById("engine").value =
engines[Math.floor(rand()*engines.length)]

generateBatch()

}
