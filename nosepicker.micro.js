((
    G = (...v) => v.sort((a, b) => a - b)[1],
    
    Q = 'hsla %% ',
    
    R = JSON.parse((document.currentScript.dataset || {}).nose || '{}').selector || 'nose',
    
    liz = (
        e, n, X, Y, K,
        v = n.hsla,
        z = e.stopPropagation() + e.preventDefault()
    ) =>
        
        [
            ...v,
            
            `hsla(
                ${v[0]-=K?0:Y},
                ${v[1]=K?G(v[1]+Y,100,0):v[1]}%,
                ${v[2]=K?v[2]:G(v[2]+X,100,0)}%,
                ${v[3]=K?G(v[3]-X*0.01,1,0):v[3]}
            )`
            
        ].forEach((k, i) =>
            
            /*
            n.root.dispatchEvent(new CustomEvent(
                R + '-input',
                {
                    detail :
                    */
                    
                    n.root.style.setProperty(
                        `--${R}-${i<4?Q[i]:'hsla'}`,i<4?v[i]+Q[i+4]:k
                    )
                    /*
                    === undefined ? v : '',
                }
            ))
            */
            
    )
    
    
) => window.addEventListener('load', e =>

    document.querySelectorAll(

        `[data-${R}]:not(script)`

    ).forEach((obj, i) =>

        new (function(
            obj,
            prefs = JSON.parse(obj.dataset[R] || '{}'),
            prev = [0, 0]
        ) {

            for (const k in (r = {
                
                    root: document.getElementById(prefs.root) ||
                        document.documentElement,
    
                    hsla:
                        (
                            prefs.hsla ||
                            window.getComputedStyle(obj)
                            .getPropertyValue(`--${R}-hsla`)
                        )
                        .match(/(\d*\.?\d+)/g)
                        .map(v => Number(v)),
                        
                    wheel: e => liz(
                        e, this,
                        (e.shiftKey ? 0.001 : 0.01) * e.wheelDeltaX,
                        (e.shiftKey ? 0.001 : 0.01) * e.wheelDeltaY,
                        e.ctrlKey
                    ),
    
                    touchmove: e => liz(
                        e, this,
                        0.01 * (prev[0] - e.touches[0].clientX),
                        0.01 * (prev[1] - e.touches[0].clientY),
                        e.touches[1]
                    ),
    
                    touchstart: e => prev = [e.touches[0].pageX, e.touches[0].pageY]
    
                })) {
                    
                    k.match(/root|hsla/) ?
                    this[k] = r[k] :
                    obj.addEventListener(k, r[k], {passive: false})
                    
                }
    
        })(obj)
        
    
    )

)

)();