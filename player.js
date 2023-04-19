const $=x=>{return document.getElementById(x)}
window.$=$
//console.log($)
var playing=0
var audio=new Audio()
audio.preload="auto"
audio.src="Audio/"+list[playing]
document.body.append(audio)
const button_text=()=>{
	if(!audio.paused) $("play_song").innerText="暂停"
	else $("play_song").innerText="播放"
}
const song_name=()=>{
	var name=list[playing].slice(0,-4)
	$("name").innerText=name
	document.title="▶ "+name
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
	audio.src="Audio/"+list[playing]
	song_name()
	if(play) audio.play()
}
const next_song=()=>{
	playing++
	if(playing==list.length) playing=0
	var play=!audio.paused
	audio.src="Audio/"+list[playing]
	song_name()
	if(play) audio.play()
}
const pro=$("progress")
const circle=$("circle")
const time=$("playing_time")
const secTostr=(sec)=>{
	var min=Math.floor(sec/60)
	sec=Math.floor(sec-min*60)
	min=String(min),sec=String(sec)
	if(min.length<=1) min="0"+min
	if(sec.length<=1) sec="0"+sec
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
	tmpx-=8
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