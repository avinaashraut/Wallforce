const mainCanvas = document.getElementById("mainCanvas")
const mainCtx = mainCanvas.getContext("2d")

const thumbRow = document.getElementById("thumbRow")

const tempCanvas = document.createElement("canvas")
const ctx = tempCanvas.getContext("2d")

let zip

function rand(){
return Math.random()
}

function setupCanvas(){

let device=document.getElementById("device").value
let res=document.getElementById("resolution").value

if(device==="mobile"){
if(res==="hd"){tempCanvas.width=720;tempCanvas.height=1280}
if(res==="2k"){tempCanvas.width=1440;tempCanvas.height=2560}
if(res==="4k"){tempCanvas.width=2160;tempCanvas.height=3840}
}

if(device==="desktop"){
if(res==="hd"){tempCanvas.width=1280;tempCanvas.height=720}
if(res==="2k"){tempCanvas.width=2560;tempCanvas.height=1440}
if(res==="4k"){tempCanvas.width=3840;tempCanvas.height=2160}
}

mainCanvas.width=tempCanvas.width
mainCanvas.height=tempCanvas.height

}

function gradient(){

let g=ctx.createLinearGradient(0,0,tempCanvas.width,tempCanvas.height)
g.addColorStop(0,`hsl(${rand()*360},60%,40%)`)
g.addColorStop(1,`hsl(${rand()*360},60%,60%)`)

ctx.fillStyle=g
ctx.fillRect(0,0,tempCanvas.width,tempCanvas.height)

}

function drawWallpaper(){

let category=document.getElementById("category").value

if(category==="random"){
let engines=["abstract","cosmic","waves","flow","terrain","brush"]
category=engines[Math.floor(Math.random()*engines.length)]
}

if(category==="abstract") drawAbstract()
if(category==="cosmic") drawCosmic()
if(category==="waves") drawWaves()
if(category==="flow") drawFlow()
if(category==="terrain") drawTerrain()
if(category==="brush") drawBrush()

}

function drawAbstract(){
gradient()
ctx.beginPath()
ctx.arc(tempCanvas.width*0.5,tempCanvas.height*0.5,200,0,Math.PI*2)
ctx.fillStyle="rgba(255,255,255,0.2)"
ctx.fill()
}

function drawCosmic(){
gradient()
for(let i=0;i<800;i++){
ctx.fillStyle="white"
ctx.fillRect(Math.random()*tempCanvas.width,Math.random()*tempCanvas.height,2,2)
}
}

function drawWaves(){
gradient()
ctx.strokeStyle="white"
for(let i=0;i<30;i++){
ctx.beginPath()
for(let x=0;x<tempCanvas.width;x+=20){
let y=Math.sin(x*0.01+i)*20+i*20
ctx.lineTo(x,y)
}
ctx.stroke()
}
}

function drawFlow(){
gradient()
ctx.strokeStyle="white"
for(let i=0;i<100;i++){
ctx.beginPath()
ctx.moveTo(Math.random()*tempCanvas.width,Math.random()*tempCanvas.height)
ctx.lineTo(Math.random()*tempCanvas.width,Math.random()*tempCanvas.height)
ctx.stroke()
}
}

function drawTerrain(){
gradient()
ctx.fillStyle="rgba(0,0,0,0.4)"
ctx.beginPath()
ctx.moveTo(0,tempCanvas.height)
for(let x=0;x<tempCanvas.width;x+=40){
let y=tempCanvas.height-Math.random()*300
ctx.lineTo(x,y)
}
ctx.lineTo(tempCanvas.width,tempCanvas.height)
ctx.fill()
}

function drawBrush(){
gradient()
for(let i=0;i<20;i++){
ctx.strokeStyle=`hsl(${Math.random()*360},80%,60%)`
ctx.lineWidth=20
ctx.beginPath()
ctx.moveTo(Math.random()*tempCanvas.width,Math.random()*tempCanvas.height)
ctx.lineTo(Math.random()*tempCanvas.width,Math.random()*tempCanvas.height)
ctx.stroke()
}
}

function generate(){
ctx.clearRect(0,0,tempCanvas.width,tempCanvas.height)
drawWallpaper()
}

function generatePreview(){

setupCanvas()
thumbRow.innerHTML=""

generate()
mainCtx.drawImage(tempCanvas,0,0)

for(let i=0;i<8;i++){
generate()
let thumb=document.createElement("canvas")
thumb.width=tempCanvas.width
thumb.height=tempCanvas.height
let tctx=thumb.getContext("2d")
tctx.drawImage(tempCanvas,0,0)

thumb.onclick=function(){
mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height)
mainCtx.drawImage(thumb,0,0)
}

thumbRow.appendChild(thumb)
}
}

document.getElementById("generateBtn").onclick=generatePreview

document.getElementById("downloadBtn").onclick=function(){
let link=document.createElement("a")
link.download="wallpaper.png"
link.href=mainCanvas.toDataURL()
link.click()
}

async function startBulk(){

setupCanvas()
zip=new JSZip()
let amount=parseInt(document.getElementById("bulkAmount").value)

let preview=document.getElementById("bulkPreview")
preview.innerHTML=""

for(let i=0;i<amount;i++){
generate()
let data=tempCanvas.toDataURL("image/png")
zip.file(`wallpaper_${i}.png`,data.split(",")[1],{base64:true})

if(i<10){
let img=new Image()
img.src=data
preview.appendChild(img)
}

updateProgress(i+1,amount)
await new Promise(r=>setTimeout(r,5))
}

document.getElementById("downloadZipBtn").disabled=false
}

function updateProgress(done,total){
let percent=(done/total)*100
document.getElementById("progressBar").style.width=percent+"%"
}

document.getElementById("bulkBtn").onclick=startBulk

document.getElementById("downloadZipBtn").onclick=function(){
zip.generateAsync({type:"blob"}).then(function(content){
let link=document.createElement("a")
link.href=URL.createObjectURL(content)
link.download="wallpapers.zip"
link.click()
})
}
