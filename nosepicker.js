/**
 * @author pizzaface
 * @version 2.0
 */

// window load closure
window.addEventListener('load', () => { new (function () {
    
    const opts = JSON.parse(((document.querySelector(
         'script[src*="nosepicker"][src$=".js"]'
    ) || {}).dataset || {}).nose|| '{}');
    
    const defPrefs = {
        selector : 'nosepicker',
        makeRef : false,
        kind: 'touch,wheel', // wheel|touch|swipe|coast|point
        colorsrc: 'background-color',
        loadedEventName: 'noseloaded',
        inputEventName: 'noseinput',
        able: true,
        colorSelf: true,
        transPattern: false,
        sens: { X: 1, Y: 1 },
        lizzList: {}
    };

    for (let p in opts) { // set any default prefs passed in
        if(defPrefs[p] !== undefined) defPrefs[p] = opts[p];
    }
    
    const //{
    
    clam = (...x) => x.sort((a, b) => a - b)[1],
    
    lizzer = (e, nose, dx, dy, CTRL, v = nose.hsla) => {
    
        e.stopPropagation();
        e.preventDefault();
    
        nose.obj.dispatchEvent(new CustomEvent(nose.prefs.inputEventName, {
    
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
        
    };

    //}
    
    const NPO = function (obj) {
        
        this.prefs = {};
        
        let dataPrefs = obj.dataset.nose ? JSON.parse(obj.dataset.nose) : {};
        
        // if any valid prefs were given, set them
        for (let p in defPrefs) {
            this.prefs[p] = dataPrefs[p] ? dataPrefs[p] : defPrefs[p];
        }
 
        this.obj = obj;

        this.hsla = {};

        this.looping = false,

        this.coastInc = [0, 0],

        this.prev = { X: 0, Y: 0 };
        
        this.value = window.getComputedStyle(obj)[this.prefs.colorsrc];
        
        if (this.prefs.colorSelf) {
            obj.addEventListener(this.prefs.inputEventName, e => {
                let v = e.detail.hsla;
                obj.style.backgroundColor = e.detail.value
                obj.style.color = v.l > 55 || v.a < 0.85 ? '#000' : '#fff';
            });
        }
    
        if (this.prefs.transPattern) {
    
            obj.addEventListener(this.prefs.inputEventName, e => {
    
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
    
        if (this.prefs.makeRef) {
            obj[this.prefs.makeRef] = this;
        }
        
        obj.dispatchEvent(new CustomEvent(this.prefs.loadedEventName, {
            detail: {
                value: this.setValue(this.value),
                kind: this.setKind(this.prefs.kind)
            }
        }));
        
    };

    //protos{
    NPO.prototype.setValue= function (v) {
    
        let
        
        // this hack allows hsla conversion of ANY valid css color
        DIV = document.createElement('div');
        DIV.style.color = v;
        this.value = DIV.style.color;
        
        [r,g,b,a] = (this.value).match(/\d+\.*\d*/g).map(v => v /= 255),
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min,
        dX = d !== 0;
        
        this.hsla =
        {
            h: dX ? (max === r ? (g - b) / d : max === g ? 2 + ((b - r) / d) : 4 + ((r - g) / d)) * 60 : 0,
            s: dX ? 100 * (v.l > 50 ? d / (2 - max - min) : d / (max + min)) : 0,
            l: 50 * (max + min),
            a: a === undefined ? 1 : a * 255
        };
    
    };
    NPO.prototype.setKind = function (v) {
    
        let oldAble = this.prefs.able;
        
        this.setAble(false);
        
        this.prefs.lizzList = {};
        
        this.prefs.kind = v.split(',');
    
        for (let k in this.prefs.kind) {
            for (let evt in (K = kindList(this,[this.prefs.kind[k]]))) {
                this.prefs.lizzList[evt] = K[evt];
            }
        }
        
        this.setAble(oldAble);
    
    };
    NPO.prototype.setAble = function (v) {
    
        for (let evt in this.prefs.lizzList) {
            this.obj[((this.prefs.able = v) ? 'add' : 'remove') + 'EventListener'](
                evt,
                this.prefs.lizzList[evt], { passive: false }
            );
        }
    
    };
    NPO.prototype.togAble = function ( ) {
        this.setAble(this.prefs.able ? false : true);
    };
    NPO.prototype.setSens = function (v) {
        this.prefs.sens = v;
    };
    //}
    
    document.querySelectorAll(defPrefs.selector).forEach(obj => {
    
        new NPO(obj);
        
    });
    
})()});