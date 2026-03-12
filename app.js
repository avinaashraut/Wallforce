const mainCanvas = document.getElementById("mainCanvas")
const mainCtx = mainCanvas.getContext("2d")

const thumbRow = document.getElementById("thumbRow")

const tempCanvas = document.createElement("canvas")
const ctx = tempCanvas.getContext("2d")

let zip = new JSZip()

function rand(){ return Math.random() }

const PHI = 0.618

function goldenPoint(){

let x = tempCanvas.width * PHI
let y = tempCanvas.height * PHI

if(Math.random()>0.5) x = tempCanvas.width*(1-PHI)
if(Math.random()>0.5) y = tempCanvas.height*(1-PHI)

return {x,y}

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

function drawAbstract(){

gradient()

let p=goldenPoint()

ctx.beginPath()
ctx.arc(p.x,p.y,220,0,Math.PI*2)
ctx.fillStyle="rgba(255,255,255,0.2)"
ctx.fill()

}

function draw(){

let engine=document.getElementById("engine").value

if(engine==="all"){
let engines=["abstract","terrain","cosmic","flow","waves","brush"]
engine=engines[Math.floor(rand()*engines.length)]
}

drawAbstract()

}

function cinematic(){

let img = ctx.getImageData(0,0,tempCanvas.width,tempCanvas.height)
let d = img.data

for(let i=0;i<d.length;i+=4){

let grain = (Math.random()*12)-6

d[i]+=grain
d[i+1]+=grain
d[i+2]+=grain

}

ctx.putImageData(img,0,0)

}

function generate(){

ctx.clearRect(0,0,tempCanvas.width,tempCanvas.height)

draw()

cinematic()

}

function generatePreviewSet(){

setupCanvas()

thumbRow.innerHTML=""

generate()

mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height)
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

document.getElementById("downloadMain").onclick=function(){

let link=document.createElement("a")
link.download="wallpaper.png"
link.href=mainCanvas.toDataURL()
link.click()

}

async function startBulk(){

setupCanvas()

document.getElementById("downloadZipBtn").disabled=true

let amount=parseInt(document.getElementById("bulkAmount").value)

zip=new JSZip()

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

function downloadZip(){

zip.generateAsync({type:"blob"}).then(function(content){

let link=document.createElement("a")
link.href=URL.createObjectURL(content)
link.download="wallpapers.zip"
link.click()

})

}
