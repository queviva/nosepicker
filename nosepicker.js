//////////////////////////////////////////////////
// pizzaface
//
// convert wheel-scroll|touch|&c. in to hsla color
//
//////////////////////////////////////////////////

const NosePicker = function () {
    
    const

    DIV = document.createElement('div'), // hakc-DIV
    
    clam = (...x) => x.sort((a, b) => a - b)[1],

    setVals = (nose, x, v) => {
    
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

    // loop through all the nosepicker elements
    document.querySelectorAll('.nosepicker').forEach(n => this[n.id] =
        
        // make an AnonymObject for each one
        new (function(obj) {
        
            let
            
            able = 0,
            
            hsla = {},
            
            evts = {
                input: obj.dataset.noseInputEventName || 'noseinput',
                colorsrc: obj.dataset.noseColorSrc || 'background-color'
                
            },
            
            lizzer = (e, x = e.preventDefault(), v = hsla, [sk, dx, dy] = [e.shiftKey ? 500 : 50, e.wheelDeltaX, e.wheelDeltaY]) =>  obj.dispatchEvent(new CustomEvent(evts.input, {
                
                detail: {
                    vals: [v.h, v.s, v.l, v.a] = e.ctrlKey ? [v.h, clam(v.s + dy / sk, 100, 0), v.l, clam(v.a - dx / sk * 0.01, 1, 0)] : [v.h - dy / sk, v.s, clam(v.l + dx / sk, 100, 0), v.a],
                    hsla: v,
                    value: (this.value = 'hsla(' + v.h + ',' + v.s + '%,' + v.l + '%,' + v.a + ')')
                }
                
            }));
                
            this.value = window.getComputedStyle(obj)[evts.colorsrc];
            
            this.setValue = val => setVals(this, val, hsla);
            
            this.togAbility = v =>  v ? able : obj[((able = (able + 1) % 2) ? 'add' : 'remove') + 'EventListener']('wheel', lizzer, { passive: false });
                
            setVals(this, this.value, hsla);
            
            this.togAbility();
            
        })(n)
        
    );
    
};