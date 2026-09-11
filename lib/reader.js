(function(){
  var params=new URLSearchParams(location.search);
  var folder=params.get("book")||"";
  var ch=parseInt(params.get("ch")||"1",10);
  var article=document.getElementById("content");
  var tocList=document.getElementById("toc-list");
  var pager=document.getElementById("pager");

  function problem(msg){ article.textContent=""; var p=document.createElement("p"); p.textContent=msg; article.appendChild(p); }

  var nav=document.querySelector(".toc");
  var details=document.createElement("details");
  var summary=document.createElement("summary");
  summary.textContent="목차";
  details.appendChild(summary);
  var oldTitle=nav.querySelector("h2"); if(oldTitle) oldTitle.remove();
  details.appendChild(tocList);
  nav.appendChild(details);
  details.open=window.matchMedia("(min-width: 761px)").matches;

  function buildSections(){
    var current=tocList.querySelector('a[aria-current="page"]');
    if(!current) return;
    var heads=article.querySelectorAll("h2, h3");
    if(!heads.length) return;
    var ul=document.createElement("ul");
    ul.className="sections";
    var links=[];
    heads.forEach(function(h,i){
      h.id="sec-"+(i+1);
      var li=document.createElement("li");
      if(h.tagName==="H3") li.className="sub";
      var a=document.createElement("a");
      a.href="#"+h.id; a.textContent=h.textContent;
      a.addEventListener("click",function(){ if(!window.matchMedia("(min-width: 761px)").matches) details.open=false; });
      li.appendChild(a); ul.appendChild(li); links.push(a);
    });
    current.parentNode.appendChild(ul);
    if("IntersectionObserver" in window){
      var visible={};
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(e){ visible[e.target.id]=e.isIntersecting; });
        var active=null;
        for(var i=0;i<heads.length;i++){ if(heads[i].getBoundingClientRect().top<window.innerHeight*0.35) active=i; }
        links.forEach(function(l,i){ l.classList.toggle("on",i===active); });
      },{rootMargin:"0px 0px -60% 0px",threshold:[0,1]});
      heads.forEach(function(h){ io.observe(h); });
      window.addEventListener("scroll",function(){
        var active=null;
        for(var i=0;i<heads.length;i++){ if(heads[i].getBoundingClientRect().top<window.innerHeight*0.35) active=i; }
        links.forEach(function(l,i){ l.classList.toggle("on",i===active); });
      },{passive:true});
    }
  }

  DOMPurify.addHook("afterSanitizeAttributes",function(node){
    if(node.tagName==="A" && /^https?:/i.test(node.getAttribute("href")||"")){
      node.setAttribute("target","_blank"); node.setAttribute("rel","noopener noreferrer");
    }
  });

  fetch("books.json",{cache:"no-cache"})
    .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
    .then(function(data){
      var books=Array.isArray(data["책"])?data["책"]:[];
      var book=null;
      books.forEach(function(b){ if(b["폴더"]===folder) book=b; });
      if(!book){ problem("이 책을 찾을 수 없어요. 책장으로 돌아가 다시 골라 주세요."); return; }

      var chapters=Array.isArray(book["장"])?book["장"]:[];
      if(!(ch>=1 && ch<=chapters.length)) ch=1;
      document.getElementById("book-title").textContent=book["제목"]||"";
      document.title=(book["제목"]||"")+" | "+(data["사이트이름"]||"");

      var base="books/"+encodeURIComponent(folder)+"/";
      var link=function(i){ return "reader.html?book="+encodeURIComponent(folder)+"&ch="+i; };
      var label=function(file){ return file.replace(/\.md$/i,""); };

      chapters.forEach(function(file,i){
        var li=document.createElement("li");
        var a=document.createElement("a");
        a.href=link(i+1); a.textContent=label(file);
        if(i+1===ch) a.setAttribute("aria-current","page");
        li.appendChild(a); tocList.appendChild(li);
      });

      if(ch>1){ var prev=document.createElement("a"); prev.href=link(ch-1); prev.textContent="이전 장: "+label(chapters[ch-2]); pager.appendChild(prev); }
      else { pager.appendChild(document.createElement("span")); }
      if(ch<chapters.length){ var next=document.createElement("a"); next.href=link(ch+1); next.textContent="다음 장: "+label(chapters[ch]); pager.appendChild(next); }

      if(!chapters.length){ problem("아직 등록된 장이 없어요. books.json의 \"장\"에 원고 파일 이름을 적어 주세요."); return; }

      return fetch(base+encodeURIComponent(chapters[ch-1]),{cache:"no-cache"})
        .then(function(r){ if(!r.ok) throw new Error("file"); return r.text(); })
        .then(function(md){
          var clean=DOMPurify.sanitize(marked.parse(md));
          var tpl=document.createElement("template");
          tpl.innerHTML=clean;
          tpl.content.querySelectorAll("img").forEach(function(img){
            var src=img.getAttribute("src")||"";
            if(src && !/^(https?:|data:|\/)/i.test(src)) img.setAttribute("src",base+src);
            img.setAttribute("loading","lazy");
          });
          article.textContent="";
          article.appendChild(tpl.content);
          buildSections();
          window.scrollTo(0,0);
        })
        .catch(function(){ problem("원고 파일을 찾을 수 없어요. books 폴더 안의 파일 이름과 books.json에 적은 이름이 똑같은지 확인해 주세요."); });
    })
    .catch(function(){ problem("책을 불러오지 못했어요. GitHub에 올린 뒤 사이트 주소로 접속해 주세요."); });
})();
