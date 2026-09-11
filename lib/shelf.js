(function(){
  var colors=["#24483E","#25346B","#5B2A4A","#7A5A12","#2E4E6B","#4A3C6E"];
  var shelf=document.getElementById("shelf");
  var count=document.getElementById("count");

  function showProblem(title,detail){
    shelf.hidden=true;
    var box=document.getElementById("notice");
    box.hidden=false;
    box.querySelector("strong").textContent=title;
    box.querySelector("span").textContent=detail;
  }

  fetch("books.json",{cache:"no-cache"})
    .then(function(r){ if(!r.ok) throw new Error("missing"); return r.text(); })
    .then(function(text){
      var data;
      try{ data=JSON.parse(text); }
      catch(e){ showProblem("books.json 파일에 글자가 빠진 곳이 있어요.","쉼표(,)나 따옴표(\")가 빠지지 않았는지 확인해 주세요. 가장 최근에 추가한 부분을 먼저 보세요."); return; }

      var name=data["사이트이름"]||"나의 서재";
      document.title=name;
      document.getElementById("site-name").textContent=name;
      document.getElementById("site-intro").textContent=data["소개"]||"";
      var footName=document.getElementById("foot-name"); if(footName) footName.textContent=name;

      var books=Array.isArray(data["책"])?data["책"]:[];
      count.textContent="책 "+books.length+"권";
      books.forEach(function(b,i){
        var li=document.createElement("li");
        var a=document.createElement("a");
        a.className="cover";
        a.href="reader.html?book="+encodeURIComponent(b["폴더"]||"");
        a.style.setProperty("background",colors[i%colors.length]);
        var h=document.createElement("h2"); h.textContent=b["제목"]||"제목 없음";
        var n=document.createElement("span");
        var chapters=Array.isArray(b["장"])?b["장"].length:0;
        n.textContent=chapters+"개 장";
        a.appendChild(h); a.appendChild(n);
        var meta=document.createElement("div"); meta.className="meta";
        if(b["소개"]){ var p=document.createElement("p"); p.textContent=b["소개"]; meta.appendChild(p); }
        if(b["업데이트"]){ var t=document.createElement("time"); t.dateTime=b["업데이트"]; t.textContent="업데이트 "+b["업데이트"]; meta.appendChild(t); }
        li.appendChild(a); li.appendChild(meta);
        shelf.appendChild(li);
      });
    })
    .catch(function(){
      showProblem("책 목록을 불러오지 못했어요.","컴퓨터에서 파일을 바로 열면 책이 보이지 않아요. GitHub에 올린 뒤 사이트 주소로 접속해 주세요.");
    });
})();
