/**
 * @author pizzaface
 * @version 1.0
 */
 
 
const AutoPicker = function (selectors='.nosepicker') {
    
    const
    
    DIV = document.createElement('div'),
    
    clam = (...x) => x.sort((a, b) => a - b)[1],
    
    setVals = (nose, x, v=nose.hsla) => {
    
        nose.value = DIV.style.color = x;
        
        let
        
        [r,g,b,a] = DIV.style.color.match(/\d+\.*\d*/g).map(v => v /= 255),
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min,
        dX = d !== 0;//,
        //v = nose.hsla;
        
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
            
            able = 0, prev = { X: 0, Y: 0 },
            
            msgs = {
                loaded: obj.dataset.noseLoadedEventName || 'noseloaded',
                input: obj.dataset.noseInputEventName || 'noseinput',
                colorsrc: obj.dataset.noseColorSrc || 'background-color'
            },

            lizzer = (
                e,
                //x = e.preventDefault(),
                v = this.hsla,
                [dx, dy] = [
                    (2.5/(e.shiftKey ? 500 : 50)) * (prev.X - e.touches[0].pageX),
                    (5/(e.shiftKey ? 500 : 50)) * (prev.Y - e.touches[0].pageY),
                ]
            ) => {
                prev = { X: e.touches[0].pageX, Y: e.touches[0].pageY };
                e.stopPropagation();
                e.preventDefault();
                obj.dispatchEvent(new CustomEvent(msgs.input, {
            
                    detail: {
                        vals: [v.h, v.s, v.l, v.a] =
                            e.touches[1] ?
                                [v.h, clam(v.s + dy, 100, 0), v.l, clam(v.a - dx * 0.01, 1, 0)]
                            :
                                [v.h - dy, v.s, clam(v.l + dx, 100, 0), v.a],
                        hsla: v,
                        value: (this.value = 'hsla(' + v.h + ',' + v.s + '%,' + v.l + '%,' + v.a + ')')
            
                    }
            
                }));
            };
            
            obj.addEventListener('touchstart', e => {
                
                prev = {
                    X : e.touches[0].pageX,
                    Y : e.touches[0].pageY
                }
                
            }, {passive: false});
                
            this.hsla = {};
            
            this.value = window.getComputedStyle(obj)[msgs.colorsrc];
            
            this.setValue = val => setVals(this, val);
            
            this.togAbility = v => v ? able : (obj[((able = (able + 1) % 2) ? 'add' : 'remove') + 'EventListener']('touchmove', lizzer, { passive: false }), able);
                
            obj.dispatchEvent(new CustomEvent(msgs.loaded, {
                detail: {
                    value: setVals(this, this.value),
                    ability: this.togAbility()
                    ,DEBUGG: //(console.log(
                        obj.id + ' loaded ' +  obj.getBoundingClientRect()
                    //)
                }
            }));
            
        })(n)
        
    );
    
};