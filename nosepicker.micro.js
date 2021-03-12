((
    G = (...v) => v.sort((a, b) => a - b)[1],
    
    Q = 'hsla %% ',
    
    liz = (
        e, n, X, Y, K,
        v = n.hsla,
        z = e.stopPropagation() + e.preventDefault()
    ) => {
        
        n.root.style.setProperty(
            '--nose-hsla',
            `hsla(
                ${v[0]-=K?0:Y},
                ${v[1]=K?G(v[1]+Y,100,0):v[1]}%,
                ${v[2]=K?v[2]:G(v[2]+X,100,0)}%,
                ${v[3]=K?G(v[3]-X*0.01,1,0):v[3]}
        )`)
        
        v.forEach((k, i) => {
            n.root.style.setProperty('--nose-' + Q[i], v[i] + Q[i+4])
        })
            
        
    }
    
) => window.addEventListener('load', e =>

    document.querySelectorAll(

        '[data-nose]:not(script)'

    ).forEach((obj, i) =>

        
        new(function(
            obj,
            prefs = JSON.parse(obj.dataset.nose || '{}'),
            prev = [0, 0]
        ) {
    
            for (const k in (r = {
    
                    root: document.getElementById(prefs.root) ||
                        document.documentElement,
    
                    hsla:
                        (
                            prefs.hsla ||
                            window.getComputedStyle(obj)
                            .getPropertyValue('--nose-hsla')
                        )
                        .replace(/[^\d,.]/g, '')
                        .split(',')
                        .map(v => Number(v))
    
                })) { this[k] = r[k] }
    
            for (const k in (r = {
    
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
    
                })) { obj.addEventListener(k, r[k], { passive: false }) }
    
        })(obj)
        
    
    )

)

)();
