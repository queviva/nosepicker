//1034
((A='addEventListener',D=document,T='touches',G=(...v)=>v.sort((a,b)=>a-b)[1],L=(e,n,X,Y,K,v=n.H,z=e.stopPropagation()+e.preventDefault(),Q='hsla %% ',S=(a,b)=>n.R.style.setProperty(a,b))=>{S('--nose-hsla',`hsla(${v[0]-=K?0:Y},${v[1]=K?G(v[1]+Y,100,0):v[1]}%,${v[2]=K?v[2]:G(v[2]+X,100,0)}%,${v[3]=K?G(v[3]-X*.01,1,0):v[3]})`);v.forEach((val,i)=>S('--nose-'+Q[i],v[i]+Q[i+4]))})=>window[A]('load',e=>D.querySelectorAll('[data-nose]:not(script)').forEach((J,i)=>new(function(J,prefs=JSON.parse(J.dataset.nose||'{}'),prev=[0,0]){for(let k in(r={R:D.getElementById(prefs.root)||D.documentElement,H:(prefs.hsla||window.getComputedStyle(J).getPropertyValue('--nose-hsla')).split(',').map(v=>Number(v.replace(/[^\d.]/g,'')))})){this[k]=r[k]}for(let k in(r={wheel:e=>L(e,this,e.wheelDeltaX*(e.shiftKey?.001:.01),e.wheelDeltaY*(e.shiftKey?.001:.01),e.ctrlKey),touchmove:e=>L(e,this,.01*(prev[0]-e[T][0].clientX),.01*(prev[1]-e[T][0].clientY),e[T][1]),touchstart:e=>prev=[e[T][0].pageX,e[T][0].pageY]})){J[A](k,r[k],{passive:false})}})(J))))()