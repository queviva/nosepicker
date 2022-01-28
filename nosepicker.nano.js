((T='touches',G=(...v)=>v.sort((a,b)=>a-b)[1],m=[0,0],

C=(e,n,v,X,Y,K)=>{
    
    e.stopPropagation();
    e.preventDefault();
    
    v[0]-=K?0:Y/50;
    v[1]=K?G(v[1]+Y/50,100,0):v[1];
    v[2]=K?v[2]:G(v[2]+X/100,100,0);
    v[3]=K?G(v[3]-X/5000,1,0):v[3];
    
    v.forEach((p,i)=>n.style.setProperty('--nose-'+'HSLA'[i],p+' %% '[i]));
    
},
    
Z={
    'wheel':(e,n,v)=>C(e,n,v,e.wheelDeltaX,e.wheelDeltaY,e.ctrlKey),
        
    'touchstart':e=>m=[e[T][0].pageX,e[T][0].pageY],
        
    'touchmove':(e,n,v)=>
            C(e,n,v,m[0]-e[T][0].pageX,m[1]-e[T][0].pageY,e[T][1])
        
})=>document.querySelectorAll(`[data-nose]:not(script)`).forEach(
        
    N=>{
        
    let v = [0,100,50,1].map((p,i)=>parseFloat(window.getComputedStyle(N).getPropertyValue('--nose-'+'HSLA'[i]))||p);
    
    for(let z in Z){N.addEventListener(z,e=>Z[z](e,N,v))}
    
}))();