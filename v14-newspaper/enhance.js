(function(){

  var S=window.SHOP||{};
  function fmt(n){n=Number(n);if(typeof S.formatPrice==="function")return S.formatPrice(n);
    return (S.currency||"$")+(Number.isInteger(n)?n:n.toFixed(2));}
  var TAGS={vegetarian:["V","Vegetarian"],vegan:["VG","Vegan"],"gluten-free":["GF","Gluten-free"],spicy:["\uD83C\uDF36","Spicy"]};
  [].forEach.call(document.querySelectorAll("[data-price]"),function(e){e.textContent=fmt(e.getAttribute("data-price"));});
  [].forEach.call(document.querySelectorAll("[data-order]"),function(a){a.href=S.orderUrl||"#";if(S.orderUrl){a.target="_blank";a.rel="noopener";}});
  var menu=document.getElementById("menu"),an=document.getElementById("anchors");
  function esc(s){var d=document.createElement("div");d.textContent=s==null?"":s;return d.innerHTML;}
  if(menu&&S.menu){
    menu.innerHTML=S.menu.map(function(c,n){
      return '<section class="cat" id="cat'+n+'"><h2 class="cat-title">'+esc(c.category)+'</h2><ul class="items">'+c.items.map(function(i){
        var tg=(i.tags||[]).map(function(t){var m=TAGS[t]||[t,t];return '<span class="tag t-'+esc(String(t).replace(/[^a-z]/g,""))+'" title="'+esc(m[1])+'" aria-label="'+esc(m[1])+'">'+m[0]+'</span>';}).join("");
        return '<li class="item"><div class="ihead"><span class="iname">'+esc(i.name)+'</span><span class="idots"></span><span class="iprice">'+esc(fmt(i.price))+'</span></div><p class="idesc">'+esc(i.desc)+'</p><div class="tags">'+tg+'</div></li>';
      }).join("")+'</ul></section>';
    }).join("");
    if(an){an.innerHTML=S.menu.map(function(c,n){return '<a href="#cat'+n+'">'+esc(c.category)+'</a>';}).join("");}
  }

  var d=document.getElementById("today");
  if(d){d.textContent=new Date().toLocaleDateString("en-CA",{weekday:"long",day:"numeric",month:"long",year:"numeric"});}
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tw=document.querySelector(".tw");
  if(tw&&!reduce){var t=tw.getAttribute("data-type"),i=0;tw.textContent="";tw.classList.add("typing");
    (function step(){tw.textContent=t.slice(0,++i);if(i<t.length)setTimeout(step,35);else tw.classList.remove("typing");})();}
})();
