new (function() {
    
    let
    
    G = (...v) => v.sort((a, b) => a - b)[1],
    
    H = (
        v, [r, g, b, a] = (v).match(/\d+\.*\d*/g).map(z => z /= 255),
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min,
        z = max + min
    ) => ({
        h: d ? 60 * (
            max === g ? (b - r) / d + 2 :
            max === b ? (r - g) / d + 4 :
                        (g - b) / d + (g < b ? 6 : 0)
        ) : 0,
        s: d ? 100 * d / (z > 1 ? (2 - max - min) : z) : 0,
        l: z * 50,
        a: a === undefined ? 1 : a * 255
    }),

    coloredEntrance = (
        e, nose, dx, dy, K, v = nose.hsla,
        z = e.stopPropagation() + e.preventDefault()
    ) => nose.obj.dispatchEvent(new CustomEvent(nose.inputEventName, {
    
        detail: {
    
            value: (nose.value =
                'hsla(' +
                (v.h -= K ? 0 : dy) + ',' +
                (v.s = K ? G(v.s + dy, 100, 0) : v.s) + '%,' +
                (v.l = K ? v.l : G(v.l + dx, 100, 0)) + '%,' +
                (v.a = K ? G(v.a - dx * 0.01, 1, 0) : v.a) +
                ')'
            ),
    
            hsla: v,
    
        },
        
        self: (!nose.noself ? nose.obj.style[nose.src] = nose.value : '')
    
    }));
    
    window.addEventListener('load', e => {
        
        document.querySelectorAll(
            
            '[data-nose]:not(script)'
            
        ).forEach((obj, i) => {
        
            this[obj.id||i] = new (function(
                obj,
                prefs
            ){
                
                for(let k in (r = {
                    obj: obj,
                    src: prefs.src || 'backgroundColor',
                    hsla: H(prefs.col || window.getComputedStyle(obj)[
                            prefs.src || 'backgroundColor'
                    ]),
                    noself: prefs.noself || false,
                    inputEventName: prefs.inputEventName || 'noseinput',
                    prev: [0, 0],
                    sens: [1, 1]
                })){this[k] = r[k]}
                
                for (let k in (r = {
                
                    wheel: e => coloredEntrance(
                        e, this,
                        this.sens[0] * ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaX),
                        this.sens[1] * ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaY),
                        e.ctrlKey
                    ),
                
                    touchmove: e =>
                        coloredEntrance(
                            e, this,
                            this.sens[0] * 0.01 * (this.prev[0] - e.touches[0].clientX),
                            this.sens[1] * 0.01 * (this.prev[1] - e.touches[0].clientY),
                            e.touches[1]
                        ),
                
                    touchstart: e => this.prev = [e.touches[0].pageX, e.touches[0].pageY]
                
                })) {obj.addEventListener(k, r[k], { passive: false })}
                
                obj.dispatchEvent(new CustomEvent('noseload',{detail:this}));
                
            })(
                obj,
                JSON.parse(obj.dataset.nose||'{}')
            )
        
        })
        
        window.dispatchEvent(new CustomEvent('picker',{detail:this}))
        
    });
    
})();