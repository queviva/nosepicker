//////////////////////////////////////////////////
// pizzaface
//
// convert wheel-scroll|touch|&c. in to hsla color
//
//////////////////////////////////////////////////

const NosePicker = function () {

    const

    clam = (...x) => x.sort((a, b) => a - b)[1],

    setVals = (nose, x) => {
    
        nose.value = nose.DIV.style.color = x;
        
        let
        v = nose.v,
        [r,g,b,a] = nose.DIV.style.color.match(/\d+\.*\d*/g).map(v => v /= 255),
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min,
        dX = d !== 0;
        
        [v.h, v.s, v.l, v.a] =
        [
            dX ? (max == r ? (g - b) / d : max == g ? 2 + ((b - r) / d) : 4 + ((r - g) / d)) * 60 : 0,
            dX ? 100 * (v.l > 50 ? d / (2 - max - min) : d / (max + min)) : 0,
            50 * (max + min),
            a === undefined ? 1 : a * 255
        ];
    
    },
    
    NoseLizzer = function(nose) {
        
        return (e, x = e.preventDefault()) => {
            
            let v = nose.v,
            [sk, dx, dy] = [e.shiftKey ? 500 : 50, e.wheelDeltaX, e.wheelDeltaY];
            
            [v.h, v.s, v.l, v.a] = e.ctrlKey ?
            [v.h,clam(v.s+dy/sk,100,0),v.l,clam(v.a-dx/sk*0.01,1,0)] :
            [v.h-dy/sk,v.s,clam(v.l+dx/sk,100,0),v.a];
            
            nose.obj.dispatchEvent(new CustomEvent(nose.eNames.input, {
                detail: (nose.value = 'hsla(' + v.h + ',' + v.s + '%,' + v.l + '%,' + v.a + ')')
            }));
    
        };
        
    };
    
    // loop through all the nosepicker elements
    document.querySelectorAll('.nosepicker').forEach(n => this[n.id] =
        
        // make an AnonymObject for each one
        new (function(obj) {
        
            this.DIV = document.createElement('div'); // hakc-DIV
        
            this.obj = obj;
            
            this.v = {};
            
            this.value = window.getComputedStyle(obj)['background-color'];
            
            this.setValue = val => setVals(this, val);
            
            setVals(this, this.value);
            
            this.eNames = {
                input: obj.dataset.noseInputEventName || 'noseinput',
                change: obj.dataset.noseChangeEventName || 'nosechange',
            };
            
            let lizzer = new NoseLizzer(this), able = 0;
            
            this.togAbility = (v) =>  v ? able : obj[((able = (able + 1) % 2) ? 'add' : 'remove') + 'EventListener']('wheel', lizzer, { passive: false });
                
            this.togAbility();

            obj.addEventListener('click', e => able ? obj.dispatchEvent(new Event(this.eNames.change)) : 0);
            
        })(n)
        
    );
    
};