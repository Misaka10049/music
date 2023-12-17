const $=x=>{return document.getElementById(x)}
window.$=$
//console.log($)
var playing=0
var audio=new Audio()
audio.preload="auto"
audio.src=list[playing]
document.body.append(audio)
const cover=$("cover")
const part=["Part 1 August","Part 2 Via","Part 3 Summer","Part 4 Jack","Part 5 Justin","Part 6 August","Part 7 Miranda","Part 8 August","Appendix"]
const button_text=()=>{
	if(!audio.paused) $("play_song").innerText="Pause"
	else $("play_song").innerText="Play"
}
var frame=document.createElement("iframe")
frame.allowFullscreen=true
frame.src="./../planet"
frame.style.width="0"
frame.style.height="0"
frame.style.position="absolute"
frame.style.top="-100px"
document.body.append(frame)
$("cover").addEventListener("click",function(){
	if(playing==7) frame.requestFullscreen()
})
const song_name=()=>{
	var name=list[playing].slice(0,-4)
	if(playing>=0&&playing<=9) name=name.slice(3)
	else name=name.slice(4)
	if(playing>=0&&playing<=8)
	{
		$("name").innerText=part[playing]
		$("cover").src="./image/"+part[playing]+".png"
	}
	else
	{
		$("name").innerText=name
		$("cover").src="./audio/cover.jpg"
	}
	$("writer").innerText=writer[playing]
	document.title="▶ "+$("name").innerText
}
const play_song=()=>{
	if(!audio.paused) audio.pause(),document.title="Music Player"
	else audio.play(),song_name()
}
const goal_time=$("goal_time")
const last_song=()=>{
	playing--
	if(playing<0) playing=list.length-1
	var play=!audio.paused
	if(list[playing].search("http")==-1) audio.src="Audio/"+list[playing]
	else audio.src=list[playing]
	song_name()
	if(play) audio.play()
}
const next_song=()=>{
	playing++
	if(playing==list.length) playing=0
	var play=!audio.paused
	if(list[playing].search("http")==-1) audio.src="Audio/"+list[playing]
	else audio.src=list[playing]
	song_name()
	if(play) audio.play()
}
const pro=$("progress")
const circle=$("circle")
const time=$("playing_time")
const secTostr=(sec)=>{
	var min=Math.floor(sec/60)
	sec=Math.floor(sec-min*60)
	var hour=Math.floor(min/60)
	min=Math.floor(min-hour*60)
	hour=String(hour)
	min=String(min),sec=String(sec)
	if(min.length<=1) min="0"+min
	if(sec.length<=1) sec="0"+sec
	if(hour!="0") return hour+":"+min+":"+sec
	return min+":"+sec
}
const update=()=>{
	var now=audio.currentTime,goal=audio.duration
	pro.style.width=now/goal*100+"%"
	circle.style.left=now/goal*400-8+"px"
	time.innerText=secTostr(now)
	if(audio.duration) goal_time.innerText=secTostr(audio.duration)
}
var tmpx=0,ticker=null,last_touch
const jumpTo=(event)=>{
	console.log(event)
	switch(event.type){
		case "touchstart":
			last_touch=true
			tmpx=event.touches[0].clientX
			addEventListener("touchmove",jumpTo)
			addEventListener("touchend",finishjump)
			break
		case "touchmove":
			event.preventDefault()
			tmpx=event.changedTouches[0].clientX
			break
		case "mousedown":
			if(event.which!=1) return
			if(last_touch) return last_touch=false
			tmpx=event.x
			addEventListener("mousemove",jumpTo)
			addEventListener("mouseup",finishjump)
			break
		case "mousemove":
			tmpx=event.x
			break
	}
	if(ticker) clearInterval(ticker),ticker=null
	tmpx-=40
	if(tmpx>400) tmpx=400
	else if(tmpx<0) tmpx=0
	pro.style.width=tmpx/4+"%"
	circle.style.left=tmpx-8+"px"
	time.innerText=secTostr(audio.duration*(tmpx/400))
}
const finishjump=(event)=>{
	switch(event.type){
		case "mouseup":
			removeEventListener("mousemove",jumpTo)
			removeEventListener("mouseup",finishjump)
			break
		case "touchend":
			removeEventListener("touchmove",jumpTo)
			removeEventListener("touchend",finishjump)
			break
	}
	audio.currentTime=audio.duration*(tmpx/400)
	ticker=setInterval(update,25)
}
$("play_song").addEventListener("click",play_song)
$("last_song").addEventListener("click",last_song)
$("next_song").addEventListener("click",next_song)
$("container").addEventListener("mousedown",jumpTo)
$("container").addEventListener("touchstart",jumpTo)
setInterval(button_text,25)
ticker=setInterval(update,25)