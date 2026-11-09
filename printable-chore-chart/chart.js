(function(){
  var PRESETS={
    little:[['🦷','Brush teeth'],['👕','Get dressed'],['🛏️','Make my bed'],['🧸','Put toys away'],['🍽️','Clear my plate'],['🧺','Clothes in the hamper'],['📚','Read a book'],['🌙','Pajamas on']],
    big:[['🦷','Brush teeth'],['🛏️','Make my bed'],['🎒','Pack my bag'],['✏️','Homework'],['📖','Read 20 minutes'],['🍴','Set the table'],['🐶','Feed the pet'],['🧹','Tidy my room'],['🗑️','Take out the trash'],['🎹','Practice music']]
  };
  var MAX=12, DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var S={kid:'',layout:'week',start:0,theme:'sun',age:'little',reward:'',pics:true,a4:false,
    tasks:[['🦷','Brush teeth'],['👕','Get dressed'],['🛏️','Make my bed'],['🧸','Put toys away'],['📚','Read a book']]};
  try{var saved=JSON.parse(localStorage.getItem('wtd-chart')||'null');if(saved&&saved.tasks)S=Object.assign(S,saved)}catch(e){}
  var $=function(id){return document.getElementById(id)};
  var form=$('controls'),sheet=$('sheet'),paper=$('paper'),preview=$('preview');
  var QR=$('qrTpl').innerHTML;
  var pageStyle=document.createElement('style');document.head.appendChild(pageStyle);
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function has(t){return S.tasks.some(function(x){return x[1].toLowerCase()===t.toLowerCase()})}
  function save(){try{localStorage.setItem('wtd-chart',JSON.stringify(S))}catch(e){}}

  function setForm(){
    $('kid').value=S.kid;$('reward').value=S.reward;$('pics').checked=S.pics;$('a4').checked=S.a4;
    ['layout','start','theme','age'].forEach(function(n){var r=form.querySelector('input[name='+n+'][value="'+S[n]+'"]');if(r)r.checked=true});
  }
  function drawPicks(){
    $('picks').innerHTML=PRESETS[S.age].map(function(p,i){
      return '<button type="button" class="pick'+(has(p[1])?' on':'')+'" data-i="'+i+'" aria-pressed="'+has(p[1])+'">'+p[0]+' '+esc(p[1])+'</button>'}).join('');
    $('mine').innerHTML=S.tasks.map(function(t,i){
      return '<span class="tag">'+t[0]+' '+esc(t[1])+'<button type="button" data-rm="'+i+'" aria-label="Remove '+esc(t[1])+'">×</button></span>'}).join('');
    $('count').textContent='('+S.tasks.length+' of '+MAX+')';
    $('startCtl').style.display=S.layout==='week'?'':'none';
  }
  function drawSheet(){
    var land=S.layout==='week',W,H;
    if(S.a4){W=land?'297mm':'210mm';H=land?'210mm':'297mm'}else{W=land?'11in':'8.5in';H=land?'8.5in':'11in'}
    sheet.style.width=W;sheet.style.height=H;
    sheet.className='sheet th-'+S.theme+(land?' week':' day')+(S.pics?'':' nopics');
    pageStyle.textContent='@page{size:'+(S.a4?'A4':'letter')+' '+(land?'landscape':'portrait')+';margin:0}';
    var name=S.kid.trim(),title=name?esc(name)+(/s$/i.test(name)?'’':'’s')+' Chore Chart':'My Chore Chart';
    var tasks=S.tasks.length?S.tasks:[['⭐','']];
    var h='<div class="ch-head"><div><div class="ch-title">'+title+'</div><div class="ch-sub">'+(land?'Week of ________________':'Date: ________________')+'</div></div><div class="ch-stars">★ ★ ★</div></div>';
    if(land){
      var d=[];for(var i=0;i<7;i++)d.push(DAYS[(i+S.start)%7]);
      h+='<div class="ch-grid"><div class="gr hd"><span class="tk">Chores</span>'+d.map(function(x){return '<span>'+x+'</span>'}).join('')+'</div>';
      tasks.forEach(function(t){h+='<div class="gr"><span class="tk"><span class="em">'+t[0]+'</span>'+esc(t[1])+'</span>'+d.map(function(){return '<span><i class="box"></i></span>'}).join('')+'</div>'});
      h+='<div class="gr won"><span class="tk"><span class="em">🏆</span>I won the day!</span>'+d.map(function(){return '<span><i class="star">☆</i></span>'}).join('')+'</div></div>';
    }else{
      h+='<ul class="ch-list">'+tasks.map(function(t){return '<li><i class="box"></i><span class="em">'+t[0]+'</span>'+esc(t[1])+'</li>'}).join('')+'<li class="won"><i class="star">☆</i><span class="em">🏆</span>I won the day!</li></ul>';
    }
    h+='<div class="ch-foot"><div class="ch-reward">'+(S.reward.trim()?'🎁 My reward: <b>'+esc(S.reward)+'</b>':'🎁 My reward: ______________________')+'</div>'+
      '<div class="ch-qr">'+QR+'<div><b>Track it in the app</b><span>Scan to get Win the Day<br>brightwinslab.com</span></div></div></div>';
    sheet.innerHTML=h;
    var n=tasks.length+1;sheet.style.setProperty('--rows',n);
    fit();
  }
  function fit(){
    sheet.style.transform='none';
    var sw=sheet.offsetWidth,sh=sheet.offsetHeight,aw=preview.clientWidth;
    var k=Math.min(1,aw/sw);
    sheet.style.transform='scale('+k+')';paper.style.width=(sw*k)+'px';paper.style.height=(sh*k)+'px';
  }
  function all(){drawPicks();drawSheet();save()}

  form.addEventListener('input',function(e){
    var t=e.target;
    if(t.id==='kid')S.kid=t.value;else if(t.id==='reward')S.reward=t.value;
    else if(t.id==='pics')S.pics=t.checked;else if(t.id==='a4')S.a4=t.checked;
    else if(t.name){S[t.name]=t.name==='start'?+t.value:t.value}
    all();
  });
  $('picks').addEventListener('click',function(e){
    var b=e.target.closest('.pick');if(!b)return;var p=PRESETS[S.age][+b.dataset.i];
    if(has(p[1]))S.tasks=S.tasks.filter(function(x){return x[1].toLowerCase()!==p[1].toLowerCase()});
    else if(S.tasks.length<MAX)S.tasks.push(p.slice());
    all();
  });
  $('mine').addEventListener('click',function(e){var b=e.target.closest('[data-rm]');if(!b)return;S.tasks.splice(+b.dataset.rm,1);all()});
  function addCustom(){var v=$('custom').value.trim();if(!v||has(v)||S.tasks.length>=MAX)return;S.tasks.push(['⭐',v]);$('custom').value='';all()}
  $('addBtn').addEventListener('click',addCustom);
  $('custom').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addCustom()}});
  $('printBtn').addEventListener('click',function(){window.print()});
  window.addEventListener('resize',fit);
  window.addEventListener('beforeprint',function(){sheet.style.transform='none'});
  window.addEventListener('afterprint',fit);
  var top=$('top'),mb=document.querySelector('.menu-btn');
  window.addEventListener('scroll',function(){top.classList.toggle('scrolled',scrollY>8)},{passive:true});
  mb.addEventListener('click',function(){var o=top.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  setForm();all();
  if(document.fonts)document.fonts.ready.then(fit);
})();
