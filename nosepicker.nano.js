document.querySelectorAll('[data-nose]').forEach((N,V,J,

    X='nose',
    
    T='touches',
    
    H='hsla',
    
    M=[0,0],
    
    G=(...v)=>v.sort((a,b)=>a-b)[1],
    
    S=()=>
        [...V,H+'('+V.map((p,i)=>p+' %% '[i])+')']
        .forEach((p,i)=>J.style.setProperty(
        X+(H[i]||H),p+' %%  '[i])),

    C=(e,x,y,k,z=e.stopPropagation()+e.preventDefault())=>S(
        k?
        (V[1]=G(V[1]+y/50,100,0),V[3]=G(V[3]-x/5000,1,0)):
        (V[0]-=y/50,V[2]=G(V[2]+x/100,100,0))),
    
    Z={
        wheel:e=>C(e,e.wheelDeltaX,e.wheelDeltaY,e.ctrlKey),
        touchstart:e=>M=[e[T][0].pageX,e[T][0].pageY],
        touchmove:e=>C(e,M[0]-e[T][0].pageX,M[1]-e[T][0].pageY,e[T][1])}
    
)=>{
    
    S(
        
        [J,X]=[N.id,X].map((v,i)=>N.dataset[X].split(' ')[i]||v),
        
        J=document.getElementById(J)||N,
        
        Z['set-'+X]=e=>S(V=e.detail),
        
        V=(window.getComputedStyle(J).getPropertyValue(
            (X='--'+X+'-')+H)
            ||'0,100,50,1')
            .match(/[\d\.-]+/g).map(p=>Number(p))
        
    );
    
    for(let z in Z)N.addEventListener(z,Z[z])
    
});