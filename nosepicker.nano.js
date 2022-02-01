document.querySelectorAll('[data-nose]').forEach((
    
    N,
    V,
    J,
    
    T='touches',
    
    M=[0,0],
    
    G=(...v)=>v.sort((a,b)=>a-b)[1],
    
    S=()=>//N.dispatchEvent(new CustomEvent('nose-input',{detail:v+(
        [...V,'hsla('+V.map((p,i)=>p+' %% '[i])+')'].forEach((p,i)=>
        J.style.setProperty('--nose-'+('HSLA'[i]||'hsla'),p+' %%  '[i]))
    //||'')}))
    ,

    C=(e,X,Y,K)=>{
    
        e.stopPropagation();
        e.preventDefault();
    
        K?(V[1]=G(V[1]+Y/50,100,0),V[3]=G(V[3]-X/5000,1,0)):(V[0]-=Y/50,V[2]=G(V[2]+X/100,100,0));
    
        S();
    
    },
    
    Z = {
        'wheel':e=>C(e,e.wheelDeltaX,e.wheelDeltaY,e.ctrlKey),
        'touchstart':e=>M=[e[T][0].pageX,e[T][0].pageY],
        'touchmove':e=>C(e,M[0]-e[T][0].pageX,M[1]-e[T][0].pageY,e[T][1])
    }
    
)=>{

        
    S(
        
        J=document.getElementById(N.dataset.nose)||N,
        
        V=(window.getComputedStyle(J).getPropertyValue('--nose-hsla')||
        '0,100,50,1').match(/[\d\.]+/g).map(p=>Number(p))
        
    );
    
    for(let z in Z){N.addEventListener(z,Z[z])}
    
});