  // Local-time clock in the sidebar
  (function(){
    var el = document.getElementById('clock');
    if(!el) return;
    function tick(){
      var d = new Date();
      el.textContent = d.toTimeString().slice(0,8);
    }
    tick(); setInterval(tick, 1000);
  })();

  // Terminal typing effect (content is pre-rendered; animation is progressive enhancement)
  (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var body = document.getElementById('termBody');
    if(reduce || !body) return;

    var lines = Array.prototype.slice.call(body.children);
    var finals = lines.map(function(l){ return l.innerHTML; });
    lines.forEach(function(l){ l.innerHTML = '&nbsp;'; });

    var i = 0;
    function showLine(){
      if(i >= lines.length) return;
      var line = lines[i], html = finals[i];
      var isCmd = html.indexOf('t-cmd') !== -1;
      if(!isCmd){
        line.innerHTML = html;
        i++; setTimeout(showLine, 320);
        return;
      }
      // type the command character-by-character
      var tmp = document.createElement('div'); tmp.innerHTML = html;
      var cmdSpan = tmp.querySelector('.t-cmd');
      var cmdText = cmdSpan ? cmdSpan.textContent : '';
      var prefix = '<span class="t-prompt">$ </span><span class="t-cmd">';
      var c = 0;
      (function typeChar(){
        line.innerHTML = prefix + cmdText.slice(0, c) + '</span><span class="caret"></span>';
        if(c < cmdText.length){ c++; setTimeout(typeChar, 38); }
        else { line.innerHTML = html; i++; setTimeout(showLine, 260); }
      })();
    }
    setTimeout(showLine, 420);
  })();

  // Highlight active nav item while scrolling
  (function(){
    var links = document.querySelectorAll('#nav a');
    var map = {};
    links.forEach(function(a){
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if(sec) map[id] = a;
    });
    if(!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          links.forEach(function(a){ a.classList.remove('active'); });
          var a = map[e.target.id];
          if(a) a.classList.add('active');
        }
      });
    }, { rootMargin:'-35% 0px -55% 0px' });
    Object.keys(map).forEach(function(id){ obs.observe(document.getElementById(id)); });
  })();
