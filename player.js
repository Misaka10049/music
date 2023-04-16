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
	$("name").innerText=list[playing].slice(0,-4)
}
const play_song=()=>{
	if(!audio.paused) audio.pause()
	else audio.play()
}
const last_song=()=>{
	playing--
	if(playing<0) playing=list.length-1
	audio.src="Audio/"+list[playing]
	play_song(),song_name()
}
const next_song=()=>{
	playing++
	if(playing==list.length) playing=0
	audio.src="Audio/"+list[playing]
	play_song(),song_name()
}
$("play_song").addEventListener("click",play_song)
$("last_song").addEventListener("click",last_song)
$("next_song").addEventListener("click",next_song)
setInterval(button_text,25)