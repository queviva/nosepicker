/**
 * @author pizzaface
 * @version 1.0
 */
 
 
const NosePicker = function (selectors = '.nosepicker') {
    
    const
    
    DIV = document.createElement('div'),
    
    clam = (...x) => x.sort((a, b) => a - b)[1],
    
    setVals = (nose, x, v = nose.hsla) => {
    
        nose.value = DIV.style.color = x;
        
        let
        
        [r,g,b,a] = DIV.style.color.match(/\d+\.*\d*/g).map(v => v /= 255),
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min,
        dX = d !== 0;
        
        [v.h, v.s, v.l, v.a] =
        [
            dX ? (max === r ? (g - b) / d : max === g ? 2 + ((b - r) / d) : 4 + ((r - g) / d)) * 60 : 0,
            dX ? 100 * (v.l > 50 ? d / (2 - max - min) : d / (max + min)) : 0,
            50 * (max + min),
            a === undefined ? 1 : a * 255
        ];
    
    };

    document.querySelectorAll(selectors).forEach(n => this[n.id] =
        
        new (function(obj) {
        
            let
            
            prefs = {
                kind: 'touch', // touch|wheel|coast
                colorsrc: 'background-color',
                loadedEventName: 'noseloaded',
                inputEventName: 'noseinput',
            },
    
            nosePrefs = obj.dataset.nose ? JSON.parse(obj.dataset.nose) : {},
    
            able = 1,
    
            prev = { X: 0, Y: 0 },
    
            looping = false,
    
            lizzer = (e, [dx, dy], CTRL, v = this.hsla) => {
    
                e.stopPropagation();
                e.preventDefault();
    
                obj.dispatchEvent(new CustomEvent(prefs.inputEventName, {
    
                    detail: {
                        vals: [v.h, v.s, v.l, v.a] =
                            CTRL ? [v.h, clam(v.s + dy, 100, 0), v.l, clam(v.a - dx * 0.01, 1, 0)] :
                            [v.h - dy, v.s, clam(v.l + dx, 100, 0), v.a],
                        hsla: v,
                        value: (this.value = 'hsla(' + v.h + ',' + v.s + '%,' + v.l + '%,' + v.a + ')')
    
                    }
    
                }));
    
            },
    
            wheelLizzer = e => {
    
                lizzer(
                    e,
                    [
                        ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaX),
                        ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaY),
                    ],
                    e.ctrlKey
                );
    
            },
    
            touchLizzer = e => {
                
                lizzer(
                    e,
                    [
                        0.1 * (prev.X - e.touches[0].pageX),
                        0.1 * (prev.Y - e.touches[0].pageY)
                    ],
                    e.touches[1]
                );
    
                prev = {
                    X: e.touches[0].pageX,
                    Y: e.touches[0].pageY
                };
    
            },
    
            coastInc = [0, 0],
            
            coastLizzer = e => {
                coastInc = [
                    0.01 * (prev.X - e.touches[0].pageX),
                    0.05 * (prev.Y - e.touches[0].pageY)
                ];
                
                e.preventDefault();
                e.stopPropagation();
            },
            
            coastLooper = e => {
                if (looping) {
    
                    lizzer(e, coastInc, e.touches[1]);
                    setTimeout(() => coastLooper(e), 50);
    
                }
    
            },
            
            kindList = {
                wheel : { wheel : wheelLizzer },
                touch : {
                    touchmove : touchLizzer,
                    touchstart : e => prev = {
                        X: e.touches[0].pageX,
                        Y: e.touches[0].pageY
                    }
                },
                coast : {
                    touchmove : coastLizzer,
                    touchend : e => looping = clearTimeout(looping),
                    touchstart : e => {
                    
                        prev = {
                            X: e.touches[0].pageX,
                            Y: e.touches[0].pageY
                        };
                    
                        looping = setTimeout(() => coastLooper(e), 200);
                    
                    }
                }
            };
            
            for (let i in nosePrefs) {
                if (prefs[i]) {
                    prefs[i] = nosePrefs[i];
                }
            }
            
            this.hsla = {};
            
            this.value = window.getComputedStyle(obj)[prefs.colorsrc];
            
            this.setValue = val => setVals(this, val);
            
            this.togAbility = (
                v = ['add','remove'][(able = (able + 1) % 2)]
            ) => {
            
                for (let evt in kindList[prefs.kind]) {
                    obj[v + 'EventListener'](
                        evt,
                        kindList[prefs.kind][evt],
                        { passive: false }
                    );
                }
            
            };
            
            obj.dispatchEvent(new CustomEvent(prefs.loadedEventName, {
                detail: {
                    value: setVals(this, this.value),
                    ability: this.togAbility()
                    /*
                    ,DEBUGG: (console.log(
                        obj.id + ' kind: ' + prefs.kind, '\n',
                        (prefs.loadedEventName)
                    ))
                    //*/
                }
            }));
            
        })(n)
        
    );
    
};