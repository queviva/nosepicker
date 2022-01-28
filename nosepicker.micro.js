((
    dset = document.currentScript.dataset,
    
    T = 'touches',
    
    G = (...v) => v.sort((a, b) => a - b)[1],
    
    Q = 'hsla %% ',
    
    P = Object.assign(
        { selector: 'nose' },
        JSON.parse(Object.values(dset)[0] || '{}')
    ),
    
    R = P.selector,
    
    liz = (
        e, n, X, Y, K,
        v = n.hsla,
        z = e.stopPropagation() + e.preventDefault()
    ) =>
        n.root.dispatchEvent(new CustomEvent(R + '-input', { detail:
        
            [
                ...v,
        
`hsla(${v[0]-=K?0:Y},${v[1]=K?G(v[1]+Y,100,0):v[1]}%,${v[2]=K?v[2]:G(v[2]+X,100,0)}%,${v[3]=K?G(v[3]-X*0.01,1,0):v[3]})`
        
            ].forEach((k, i) =>
        
                n.root.style.setProperty(
                    `--${R}-${i<4?Q[i]:'hsla'}`,i<4?v[i]+Q[i+4]:z=k
                )
        
            )
        
        === undefined ? z : ''}))
    
) => window.addEventListener('load', () =>

    document.querySelectorAll(

        `[data-${R}]:not(script)`

    ).forEach(obj =>

        new (function(
            
            prefs = Object.assign({},P,JSON.parse(obj.dataset[R]||'{}')),
            
            prev = [0, 0],
            
            r = {
            
                root: document.getElementById(prefs.root) || obj,
            
                hsla:
                    (
                        prefs.hsla ||
                        window.getComputedStyle(obj)
                        .getPropertyValue(`--${R}-hsla`) ||
                        '0,100,50,1'
                    )
                    .match(/[\d\.]+/g)
                    .map(v => Number(v)),
            
                wheel: e => liz(
                    e, this,
                    (e.shiftKey ? 0.001 : 0.01) * e.wheelDeltaX,
                    (e.shiftKey ? 0.001 : 0.01) * e.wheelDeltaY,
                    e.ctrlKey
                ),
            
                touchmove: e => liz(
                    e, this,
                    0.01 * (prev[0] - e[T][0].pageX),
                    0.01 * (prev[1] - e[T][0].pageY),
                    e[T][1]
                ),
            
                touchstart: e => prev = [e[T][0].pageX, e[T][0].pageY]
            
            }
        ) {

            for (let k in r) {
            
                k.match(/root|hsla/) ?
                this[k] = r[k] :
                obj.addEventListener(k, r[k], { passive: false })
            
            }
            
            if (prefs.pattern) {
            
                obj.addEventListener(`${R}-input`,
                (e, A = 0.5 - parseFloat(e.detail.split(',')[3]) / 2) =>
                    
                    this.root.style.backgroundImage = A > 0 ?
                        `repeating-linear-gradient(
                            -45deg,
                            rgba(0,0,0,${A}),
                            rgba(0,0,0,${A}) 10px,
                            transparent 10px,
                            transparent 20px
                        )` : ''
            
                );
            
            }

        })()
    
    )

)

)();