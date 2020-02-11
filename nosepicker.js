/**
 * @author pizzaface
 * @version 2.0
 */
 
 
const NosePicker = function (selectors = '.nosepicker') {
    
    const
    
    clam = (...x) => x.sort((a, b) => a - b)[1],
    
    setVals = (nose, x, v = nose.hsla) => {
    
        console.log(nose);
        let DIV = document.createElement('div');
    
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

    beMine = (v) => {
        alert(v.h,v.s);
    };
    
    NPO = function (obj) {
    
        let

        prefs = {
            kind: 'touch,wheel', // wheel|touch|swipe|coast|point
            colorsrc: 'background-color',
            loadedEventName: 'noseloaded',
            inputEventName: 'noseinput',
            able: true,
            colorSelf: true,
            transPattern: false,
            sens: { X: 1, Y: 1 }
        },

        dataPrefs = obj.dataset.nose ? JSON.parse(obj.dataset.nose) : {},

        looping = false,

        coastInc = [0, 0],

        prev = { X: 0, Y: 0 },

        lizzer = (e, dx, dy, CTRL, v = this.hsla) => {

            e.stopPropagation();
            e.preventDefault();

            obj.dispatchEvent(new CustomEvent(prefs.inputEventName, {

                detail: {
                    vals: [v.h, v.s, v.l, v.a] =
                        CTRL ? [v.h, clam(v.s + dy, 100, 0), v.l, clam(v.a - dx * 0.01, 1, 0)] : [v.h - dy, v.s, clam(v.l + dx, 100, 0), v.a],
                    hsla: v,
                    value: (this.value = 'hsla(' + v.h + ',' + v.s + '%,' + v.l + '%,' + v.a + ')')

                }

            }));

        },

        wheelLizzer = e => {

            lizzer(
                e,
                prefs.sens.X * ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaX),
                prefs.sens.Y * ((e.shiftKey ? 0.001 : 0.01)) * (e.wheelDeltaY),
                e.ctrlKey
            );

        },

        touchLizzer = e => {

            lizzer(
                e,
                prefs.sens.X * 0.1 * (prev.X - e.touches[0].clientX),
                prefs.sens.Y * 0.1 * (prev.Y - e.touches[0].clientY),
                e.touches[1]
            );

            prev = {
                X: e.touches[0].clientX,
                Y: e.touches[0].clientY
            };

        },

        swipeLizzer = e => {

            lizzer(
                e,
                prefs.sens.X * 0.1 * (prev.X - e.clientX),
                prefs.sens.Y * 0.1 * (prev.Y - e.clientY),
                e.ctrlKey
            );

            prev = {
                X: e.clientX,
                Y: e.clientY
            };

        },

        coastLizzer = e => {

            e.preventDefault();
            e.stopPropagation();

            coastInc = [
                prefs.sens.X * 0.01 * (prev.X - e.touches[0].clientX),
                prefs.sens.Y * 0.10 * (prev.Y - e.touches[0].clientY)
            ];

        },

        coastLooper = e => {
            if (looping) {
                lizzer(e, ...coastInc, e.touches[1]);
                setTimeout(() => coastLooper(e), 50);
            }
        },

        pointLizzer = e => {

            e.preventDefault();
            e.stopPropagation();

            coastInc = [
                prefs.sens.X * 0.01 * (prev.X - e.clientX),
                prefs.sens.Y * 0.10 * (prev.Y - e.clientY)
            ];

        },

        pointLooper = e => {
            if (looping) {
                lizzer(e, ...coastInc, e.ctrlKey);
                setTimeout(() => pointLooper(e), 50);
            }
        }
    
        kindList = {
            wheel: { wheel: wheelLizzer },
            touch: {
                touchmove: touchLizzer,
                touchstart: e => prev = {
                    X: e.touches[0].clientX,
                    Y: e.touches[0].clientY
                }
            },
            swipe: {
                mousedown: e => {
                    window.addEventListener('mousemove', swipeLizzer);
                    window.addEventListener('mouseup', e =>
                        window.removeEventListener('mousemove', swipeLizzer)
                    );
                    prev = {
                        X: e.clientX,
                        Y: e.clientY
                    };
                },
            },
            coast: {
                touchmove: coastLizzer,
                touchend: e => looping = clearTimeout(looping),
                touchstart: e => {
    
                    prev = {
                        X: e.touches[0].clientX,
                        Y: e.touches[0].clientY
                    };
    
                    coastInc = [0, 0];
    
                    looping = setTimeout(() => coastLooper(e), 200);
    
                }
            },
            point: {
                mousedown: e => {
    
                    window.addEventListener('mouseup', e => {
                        window.removeEventListener('mousemove', pointLizzer);
                        looping = clearTimeout(looping);
                    });
    
                    window.addEventListener('mousemove', pointLizzer);
    
                    prev = {
                        X: e.clientX,
                        Y: e.clientY
                    };
    
                    coastInc = [0, 0];
    
                    looping = setTimeout(() => pointLooper(e), 200);
    
                }
            }
        };
    
        for (let i in dataPrefs) {
            if (prefs[i] !== undefined) {
                prefs[i] = dataPrefs[i];
            }
        }
        
        this.hsla = {};
    
        this.value = window.getComputedStyle(obj)[prefs.colorsrc];
    
        //this.setValue = v => setVals(this, v);
    
        this.setAbility = v => {
            prefs.able = v;
            for (let k in prefs.kind) {
                for (let evt in kindList[prefs.kind[k]]) {
                    obj[(v ? 'add' : 'remove') + 'EventListener'](
                        evt,
                        kindList[prefs.kind[k]][evt], { passive: false }
                    );
                }
            }
        };
    
        this.togAbility = () => {
            this.setAbility((prefs.able = prefs.able ? false : true));
        };
    
        this.setKind = v => {
            this.setAbility(false);
            prefs.kind = v.split(',');
            this.setAbility(prefs.able);
        };
    
        this.setSens = v => prefs.sens = v;
    
        if (prefs.colorSelf) {
            obj.addEventListener('noseinput', e => {
                let v = e.detail.hsla;
                obj.style.backgroundColor = e.detail.value
                obj.style.color = v.l > 55 || v.a < 0.85 ? '#000' : '#fff';
            });
        }
    
        if (prefs.transPattern) {
    
            obj.addEventListener('noseinput', e => {
    
                let A = 0.5 - e.detail.hsla.a / 2;
    
                obj.style.backgroundImage = e.detail.hsla.a < 1 ?
                    `repeating-linear-gradient(
                                -45deg,
                                rgba(0,0,0,${ A }),
                                rgba(0,0,0,${ A }) 10px,
                                transparent 10px,
                                transparent 20px
                            )` : '';
    
            });
    
        }
    
        obj.dispatchEvent(new CustomEvent(prefs.loadedEventName, {
            detail: {
                kind: (prefs.kind = prefs.kind.split(',')),
                value: setVals(this, this.value),
                ability: this.setAbility(prefs.able),
                /*
                ,DEBUGG: (console.log(
                    obj.id + ' kind: ' + prefs.kind, '\n',
                    (prefs.loadedEventName)
                ))
                //*/
            }
        }));
    
    };
    
    NPO.prototype.setValue = function(v){ setVals(this, v); };
    NPO.prototype.valentine = function(){ beMine(this.hsla); };
        
    document.querySelectorAll(selectors).forEach(n => this[n.id] =
        
        //new (function(obj) { // 'weird' constructor REQUIRED
        new NPO(n)
        
    );
    
};