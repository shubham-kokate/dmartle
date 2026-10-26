var MAX=6,WIN=0.05,STORE="dmartle-stats";
var ist=Math.floor((Date.now()+19800000)/86400000);
var state={};
var $=function(i){return document.getElementById(i)};
function fmt(n){return "₹"+Number(n).toLocaleString("en-IN")}
function load(){try{return JSON.parse(localStorage.getItem(STORE))||{}}catch(e){return {}}}
function save(s){try{localStorage.setItem(STORE,JSON.stringify(s))}catch(e){}}
function start(daily){
  var idx=daily?(ist*7+3)%ITEMS.length:Math.floor(Math.random()*ITEMS.length);
  var it=ITEMS[idx];
  state={daily:daily,item:it,guesses:[],done:false,won:false};
  $("emoji").textContent=it[2];$("name").textContent=it[0];$("pack").textContent=it[1];
  $("price").classList.add("hide");$("end").classList.add("hide");$("entry").classList.remove("hide");
  $("mode").textContent=daily?"Daily #"+(ist-20000):"Practice round";
  $("guess").value="";render();
}
function band(g,p){var d=Math.abs(g-p)/p;return d<=WIN?"🟩":d<=0.10?"🟨":d<=0.25?"🟧":"🟥"}
function hintFor(g,p){
  var d=Math.abs(g-p)/p;
  if(d<=WIN)return "Spot on";
  var dir=g<p?"↑ Higher":"↓ Lower";
  return dir+(d<=0.10?", very close":d<=0.25?", getting warm":", far off");
}
function render(){
  var b=$("bill"),p=state.item[3];b.innerHTML="";
  if(!state.guesses.length){b.innerHTML='<div class="empty">No guesses yet. What does this cost at DMart?</div>'}
  state.guesses.forEach(function(g){
    var r=document.createElement("div");r.className="row";
    var a=document.createElement("b");a.textContent=band(g,p)+" "+fmt(g);
    var h=document.createElement("span");h.className="hint";h.textContent=hintFor(g,p);
    r.appendChild(a);r.appendChild(h);b.appendChild(r);
  });
  $("left").textContent=state.done?"":(MAX-state.guesses.length)+" guesses left";
}
function finish(won){
  state.done=true;state.won=won;
  $("price").textContent=fmt(state.item[3]);$("price").classList.remove("hide");
  $("entry").classList.add("hide");$("left").textContent="";
  $("endTitle").textContent=won?"Nice, you got it!":"Out of guesses";
  var s=load();
  if(state.daily&&s.last!==ist){
    s.played=(s.played||0)+1;s.last=ist;
    if(won){s.wins=(s.wins||0)+1;s.streak=(s.lastWin===ist-1?(s.streak||0):0)+1;s.lastWin=ist}else{s.streak=0}
    save(s);
  }
  $("endSub").textContent=(won?"Solved in "+state.guesses.length+"/"+MAX:"The price was "+fmt(state.item[3]))+(state.daily&&s.played?" · Streak "+(s.streak||0)+" · Won "+(s.wins||0)+"/"+s.played:"");
  $("end").classList.remove("hide");
}
function submit(){
  if(state.done)return;
  var v=parseFloat($("guess").value);
  if(!(v>0)){$("guess").focus();return}
  state.guesses.push(v);$("guess").value="";render();
  if(Math.abs(v-state.item[3])/state.item[3]<=WIN)finish(true);
  else if(state.guesses.length>=MAX)finish(false);
  else $("guess").focus();
}
$("go").onclick=submit;
$("guess").addEventListener("keydown",function(e){if(e.key==="Enter")submit()});
$("again").onclick=function(){start(false)};
$("share").onclick=function(){
  var p=state.item[3];
  var t="Dmartle "+(state.daily?"#"+(ist-20000):"practice")+" "+(state.won?state.guesses.length:"X")+"/"+MAX+"\n"+state.guesses.map(function(g){return band(g,p)}).join("");
  var done=function(){$("share").textContent="Copied!"};
  try{navigator.clipboard.writeText(t).then(done,function(){prompt("Copy your result:",t)})}catch(e){prompt("Copy your result:",t)}
};
start(true);
