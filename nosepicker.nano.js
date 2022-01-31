((T='touches',G=(...v)=>v.sort((a,b)=>a-b)[1],m=[0,0],

S=(v,n)=>[...v,'hsla('+v.map((p,i)=>p+' %% '[i])+')']
.forEach((p,i)=>n.style.setProperty(
    '--nose-'+('HSLA'[i]||'hsla'),p+' %%  '[i]
)),

C=(e,n,v,X,Y,K)=>{
    
    e.stopPropagation();e.preventDefault();

    K?(v[1]=G(v[1]+Y/50,100,0),v[3]=G(v[3]-X/5000,1,0)):(v[0]-=Y/50,v[2]=G(v[2]+X/100,100,0));
    
    S(v,n);
    
},
    
)=>document.querySelectorAll('[data-nose]').forEach(
        
    (N,v
    ,J
    
    )=>{

J=document.getElementById(N.dataset.nose)||N;
        
    S(v=(window.getComputedStyle(J).getPropertyValue('--nose-hsla')||'0,100,50,1').match(/[\d\.]+/g).map(p=>Number(p)),J);
    
    let Z = {
        'wheel':e=>C(e,J,v,e.wheelDeltaX,e.wheelDeltaY,e.ctrlKey),
        'touchstart':e=>m=[e[T][0].pageX,e[T][0].pageY],
        'touchmove':e=>C(e,J,v,m[0]-e[T][0].pageX,m[1]-e[T][0].pageY,e[T][1])
    };
    
    for(let z in Z){N.addEventListener(z,Z[z])}
    
}))();

const xModByM = (x, M) => ((x % M) + M) % M;

console.log(
    (3 - 20) % 100,
    xModByM(3-20, 100)
);