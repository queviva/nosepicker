((
    P=Object.assign(
        {selector:'nose'},
        JSON.parse(Object.values(document.currentScript.dataset)[0]||'{}')
    ),
    
    R=P.selector
    
) => window.addEventListener('load', () =>
     document.querySelectorAll(`[data-${R}]:not(script)`).forEach((N,V,J,
    
    T='touches',
    
    M=[0,0],
    
    F=Object.assign({},P,JSON.parse(N.dataset[R]||'{}')),
    
    X=F.selector,
    
    G=(...v)=>v.sort((a,b)=>a-b)[1],
    
    H=()=>`hsla(${V.map((p,i)=>p+' %% '[i])})`,
    
    D=(e,d)=>N.dispatchEvent(new CustomEvent(e,d)),
    
    S=()=>D(X+'-input',{
        
        detail:H(),
        
        p:[...V,H()].forEach((p,i)=>
           J.style.setProperty('--'+X+'-'+('hsla'[i]||'hsla'),p+' %%  '[i])),
        
        i:F.pattern?(N.style.backgroundImage=V[3]<1? `repeating-linear-gradient(-45deg,rgba(0,0,0,${0.5-V[3]/2}),rgba(0,0,0,${0.5-V[3]/2}) 10px,transparent 10px,transparent 20px)`:''):''
        
    }),

    C=(e,x,y,k,z=e.stopPropagation()+e.preventDefault())=>S(k?
       (V[1]=G(V[1]+y/50,100,0),V[3]=G(V[3]-x/5000,1,0)):
       (V[0]-=y/50,V[2]=G(V[2]+x/100,100,0))
    ),
    
    A=0,
    
    Z={
        wheel:e=>C(e,e.wheelDeltaX,e.wheelDeltaY,e.ctrlKey),
        touchstart:e=>M=[e[T][0].pageX,e[T][0].pageY],
        touchmove:e=>C(e,M[0]-e[T][0].pageX,M[1]-e[T][0].pageY,e[T][1]),
        click:e=>D(X+'-change',{detail:H()}),
        ['set-'+X]:e=>S(V=e.detail),
        ['tog-'+X]:(e,b=(A=!A))=>{for(let z in Z){
            (!e||!z.match(/-/))?
            N[(b?'add':'remove')+'EventListener'](z,Z[z]):''
        }}
    }
    
)=>S(
        
    J=document.querySelector(F.root)||N,
        
    V=(window.getComputedStyle(J).getPropertyValue(`--${X}-hsla`)||'0,100,50,1').match(/[\d\.-]+/g).map(p=>Number(p)),
        
    D(X+'load',Z['tog-'+X]())
        
))))();