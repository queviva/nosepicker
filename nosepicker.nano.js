document.querySelectorAll('[data-nose]').forEach((N,V,J,X,
    
    T='touches',
    
    H='hsla',
    
    M=[0,0],
    
    G=(...v)=>v.sort((a,b)=>a-b)[1],
    
    S=()=>
        [...V,H+'('+V.map((p,i)=>p+' %% '[i])+')'].forEach((p,i)=>
        J.style.setProperty(X+(H[i]||H),p+' %%  '[i])),

    C=(e,X,Y,K,z=e.stopPropagation()+e.preventDefault())=>S(K?
        (V[1]=G(V[1]+Y/50,100,0),V[3]=G(V[3]-X/5000,1,0)):
        (V[0]-=Y/50,V[2]=G(V[2]+X/100,100,0))),
    
    Z={
        wheel:e=>C(e,e.wheelDeltaX,e.wheelDeltaY,e.ctrlKey),
        touchstart:e=>M=[e[T][0].pageX,e[T][0].pageY],
        touchmove:e=>C(e,M[0]-e[T][0].pageX,M[1]-e[T][0].pageY,e[T][1]),
        'set-nose':e=>S(V=e.detail)
    }
    
)=>{
    
    S(
        [J,X]=[N.id,'--nose-'].map((v,i)=>N.dataset.nose.split(' ')[i]||v),
        
        J=document.getElementById(J)||N,
        
        V=(window.getComputedStyle(J).getPropertyValue(X+H)||
        '0,100,50,1').match(/[\d\.-]+/g).map(p=>Number(p))
    );
    
    for(let z in Z)N.addEventListener(z,Z[z]);
    
});