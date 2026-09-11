(function(){
  var params=new URLSearchParams(location.search);
  var folder=params.get("book")||"";
  var ch=parseInt(params.get("ch")||"1",10);
  var article=document.getElementById("content");
  var tocList=document.getElementById("toc-list");
  var pager=document.getElementById("pager");

  function problem(msg){ article.textContent=""; var p=document.createElement("p"); p.textContent=msg; article.appendChild(p); }

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
          window.scrollTo(0,0);
        })
        .catch(function(){ problem("원고 파일을 찾을 수 없어요. books 폴더 안의 파일 이름과 books.json에 적은 이름이 똑같은지 확인해 주세요."); });
    })
    .catch(function(){ problem("책을 불러오지 못했어요. GitHub에 올린 뒤 사이트 주소로 접속해 주세요."); });
})();
