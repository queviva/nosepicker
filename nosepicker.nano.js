((T='touches',G=(...v)=>v.sort((a,b)=>a-b)[1],m=[0,0],

rat=console.log('this is nano'),

C=(e,n,R,dx,dy,K)=>{
    
    e.stopPropagation();
    e.preventDefault();
    
    R[0]=R[0]+(dy/50);
    (K)?R[1]=G(R[1]-dx/100,0,100)
    :R[2]=G(R[2]-dx/100,0,100);
    R.forEach((v,i)=>n.style.setProperty('--nose-'+'HSL'[i],v+' %%'[i]));
    
},
    
Z={
    'wheel':(e,n,r)=>C(e,n,r,e.wheelDeltaX,e.wheelDeltaY,e.ctrlKey),
        
    'touchstart':e=>m=[e[T][0].pageX,e[T][0].pageY],
        
    'touchmove':(e,n,r)=>
            C(e,n,r,m[0]-e[T][0].pageX,m[1]-e[T][0].pageY,e[T][1])
        
})=>document.querySelectorAll(`[data-nose]:not(script)`).forEach(
        
    J=>{
        
    let r = [0,100,50].map((k,i)=>parseFloat(window.getComputedStyle(J).getPropertyValue('--nose-'+'HSL'[i]))||V[i]);
    
    for(let z in Z){J.addEventListener(z,e=>Z[z](e,J,r)),
        { passive: false }
    }
    
}))();
