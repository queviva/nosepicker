////////////////////////////////////////////////////////////{
// pizzaface - MCMLXXXVIII
//
////////////////////////////////////////////////////////////}

// expiration check {
//new Date() < new Date('2023-10-13') &&
//}

((

    // prefs {
    default_prefs = {
        
        selector: 'nose',
        kind: 'touch,wheel', // wheel|touch|swipe|coast|point
        colorsrc: 'background-color',
        loaded: 'nose-loaded',
        input: 'nose-input',
        able: true,
        colorSelf: true,
        colorText: true,
        pattern: true,
        sens: { X: 1, Y: 1 }

    },
    
    // prefs set in script tag data-param
    param_prefs = JSON.parse(Object.values(
        document.currentScript.dataset
    )[0] || '{}'),
    
    // over-rite default prefs with script tag data-params
    prefs = Object.assign({}, default_prefs, param_prefs),
    
    //}
    
    // award-winning method to gate a value {
    clam = (...x) => x.sort((a, b) => a - b)[1]
    //}
  
// run on window load because getting computed styles
) => window.addEventListener('load', () => new (function() {
    
    // lizzers {
    const
    lizzer = (e, nose, dx, dy, CTRL, v = nose.hsla) => {

        e.stopPropagation();
        e.preventDefault();

        nose.obj.dispatchEvent(new CustomEvent(nose.prefs.input, {

            detail: {
                vals: [v.h, v.s, v.l, v.a] = CTRL ? [
                    v.h,
                    clam(v.s + dy, 100, 0),
                    v.l,
                    clam(v.a - dx * 0.01, 1, 0)
                ] : [
                    v.h - dy,
                    v.s,
                    clam(v.l + dx, 100, 0),
                    v.a
                ],

                hsla: v,

                value: (nose.value =
                    'hsla(' +
                    v.h + ',' +
                    v.s + '%,' +
                    v.l + '%,' +
                    v.a +
                    ')')

            }

        }));

    },
    
    wheelLizzer = (e, nose) => {

        lizzer(
            e, nose,
            nose.prefs.sens.X * ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaX),
            nose.prefs.sens.Y * ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaY),
            e.ctrlKey
        );

    },

    touchLizzer = (e, nose) => {

        lizzer(
            e, nose,
            nose.prefs.sens.X * 0.1 * (nose.prev.X - e.touches[0].clientX),
            nose.prefs.sens.Y * 0.1 * (nose.prev.Y - e.touches[0].clientY),
            e.touches[1]
        );

        nose.prev = {
            X: e.touches[0].clientX,
            Y: e.touches[0].clientY
        };

    },

    swipeLizzer = (e, nose) => {

        lizzer(
            e, nose,
            nose.prefs.sens.X * 0.1 * (nose.prev.X - e.clientX),
            nose.prefs.sens.Y * 0.1 * (nose.prev.Y - e.clientY),
            e.ctrlKey
        );

        nose.prev = {
            X: e.clientX,
            Y: e.clientY
        };

    },

    coastLizzer = (e, nose) => {

        e.preventDefault();
        e.stopPropagation();

        nose.coastInc = [
            nose.prefs.sens.X * 0.01 * (nose.prev.X - e.touches[0].clientX),
            nose.prefs.sens.Y * 0.10 * (nose.prev.Y - e.touches[0].clientY)
        ];

    },

    coastLooper = (e, nose) => {

        e.preventDefault();
        e.stopPropagation();

        if (nose.looping) {
            lizzer(e, nose, ...nose.coastInc, e.touches[1]);
            setTimeout(() => coastLooper(e, nose), 50);
        }

    },

    pointLizzer = (e, nose) => {

        e.preventDefault();
        e.stopPropagation();

        nose.coastInc = [
            nose.prefs.sens.X * 0.01 * (nose.prev.X - e.clientX),
            nose.prefs.sens.Y * 0.10 * (nose.prev.Y - e.clientY)
        ];

    },

    pointLooper = (e, nose) => {

        e.preventDefault();
        e.stopPropagation();

        if (nose.looping) {
            lizzer(e, nose, ...nose.coastInc, e.ctrlKey);
            nose.looping = setTimeout(() => pointLooper(e, nose), 50);
        }

    },

    //}
    
    // kinds of lizzers {
    kindList = (nose, k) => {

        return {
            wheel: {
                wheel: e => wheelLizzer(e, nose)
            },
            touch: {
                touchmove: e => touchLizzer(e, nose),
                touchstart: e => nose.prev = {
                    X: e.touches[0].clientX,
                    Y: e.touches[0].clientY
                }
            },
            swipe: {
                mousedown: e => {

                    let slizzer = e => swipeLizzer(e, nose);

                    window.addEventListener('mousemove', slizzer);
                    window.addEventListener('mouseup', e =>
                        window.removeEventListener('mousemove', slizzer)
                    );

                    nose.prev = {
                        X: e.clientX,
                        Y: e.clientY
                    };

                },
            },
            coast: {
                touchmove: e => coastLizzer(e, nose),
                touchend: e => nose.looping = clearTimeout(nose.looping),
                touchstart: e => {

                    nose.prev = {
                        X: e.touches[0].clientX,
                        Y: e.touches[0].clientY
                    };

                    nose.coastInc = [0, 0];

                    nose.looping = setTimeout(() => coastLooper(e, nose), 200);

                }
            },
            point: {
                mousedown: e => {

                    let plizzer = e => pointLizzer(e, nose);

                    window.addEventListener('mousemove', plizzer);

                    window.addEventListener('mouseup', e => {
                        window.removeEventListener('mousemove', plizzer);
                        nose.looping = clearTimeout(nose.looping);
                    });

                    nose.prev = {
                        X: e.clientX,
                        Y: e.clientY
                    };

                    nose.coastInc = [0, 0];

                    nose.looping = setTimeout(() => pointLooper(e, nose), 200);

                }
            }
        }[k];

    }
    //}

    // dispatcheries {
    const dispatchers = {
        
       value : (n, v) => {
           
           // this hack allows hsla conversion of ANY valid css color
           let DIV = document.createElement('div');
           DIV.style.color = v;
           n.value = DIV.style.color;
       
           let
       
           [r, g, b, a] = (n.value).match(/\d+\.*\d*/g).map(v => v /= 255),
               max = Math.max(r, g, b),
               min = Math.min(r, g, b),
               d = max - min,
               dX = d !== 0;
       
           n.hsla = {
               h: dX ? (max === r ? (g - b) / d : max === g ? 2 + ((b - r) / d) : 4 + ((r - g) / d)) * 60 : 0,
               s: dX ? 100 * (v.l > 50 ? d / (2 - max - min) : d / (max + min)) : 0,
               l: 50 * (max + min),
               a: a === undefined ? 1 : a * 255
           };
           
           if (n.prefs.colorSelf) {
               n.obj.style[n.prefs.colorsrc] = n.value;
               if (n.prefs.colorText) n.obj.style.color = n.hsla.l > 55 || n.hsla.a < 0.85 ? '#000' : '#fff';
           }
           
       },
       
       kind  : (n, v) => {
       
           let oldAble = n.prefs.able;
       
           n.set_able(n, false);
       
           n.prefs.lizzList = {};
       
           try { n.prefs.kind = v.split(','); }
           catch (T) {}
       
           for (let k in n.prefs.kind) {
               let K = kindList(n, [n.prefs.kind[k]]);
               for (let evt in K) {
                   n.prefs.lizzList[evt] = K[evt];
               }
           }
       
           n.set_able(n, oldAble);
           
       },
       
       able  : (n, v) => {
           
            for (let evt in n.prefs.lizzList || {}) {
            
                n.obj[((n.prefs.able = v) ? 'add' : 'remove') + 'EventListener'](
                    evt,
                    n.prefs.lizzList[evt], { passive: false }
                );
            }
       
       },
       
       sens  : (n, v) => {
        
            n.prefs.sens = v;
           
       }
    
    };
    //}
       
    // loop through all data-selector objects {
    document.querySelectorAll(
            
        // that are NOT a script tag
        `[data-${prefs.selector}]:not(script)`
            
    // make each one a nosepicker object
    ).forEach(obj => this[obj.id] = new (function(){
    
        this.prefs = Object.assign({ lizzList: {} }, prefs,
            JSON.parse(obj.dataset[prefs.selector] || '{}')
        );
    
        this.obj = obj;
    
        this.hsla = {};
    
        this.looping = false;
    
        this.coastInc = [0, 0];
    
        this.prev = { X: 0, Y: 0 };
    
        this.value = window.getComputedStyle(obj)[this.prefs.colorsrc] || '#000';
    
        for (let d in dispatchers) {
    
            this['set_' + d] = dispatchers[d];
    
            obj.addEventListener(
                `${prefs.selector}-set-${d}`, e => {
                    dispatchers[d](this, e.detail)
                }
            );
    
        }
    
        if (this.prefs.colorSelf) {
            obj.addEventListener(this.prefs.input, e => {
                let v = e.detail.hsla;
                obj.style[this.prefs.colorsrc] = e.detail.value;
                if (this.prefs.colorText) obj.style.color = e.detail.hsla.l > 55 || e.detail.hsla.a < 0.85 ? '#000' : '#fff';
    
            });
        }
    
        if (this.prefs.pattern) {
    
            obj.addEventListener(this.prefs.input, e => {
    
                let A = 0.5 - e.detail.hsla.a / 2;
    
                obj.style.backgroundImage = A > 0 ?
                    `repeating-linear-gradient(
                       -45deg,
                       rgba(0,0,0,${ A }),
                       rgba(0,0,0,${ A }) 10px,
                       transparent 10px,
                       transparent 20px
                    )` : '';
    
            });
    
        }
    
        this.set_value(this, this.value);
        this.set_kind(this, this.prefs.kind);
    

        
    })());
    //}
    
    // send patchooli with loaded event
    console.log(prefs.loaded);
    window.dispatchEvent(new CustomEvent(prefs.loaded, {detail:(j,e,v)=>{
        (typeof j === 'object' ? j : document.getElementById(j))
        .dispatchEvent(new CustomEvent(e, { detail: v }));
    }}));
        
})()))();

// expiration message {
//=== undefined || (console.log('eXp!red'));
//}

