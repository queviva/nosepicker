////////////////////////////////////////////////////////////
// pizzaface
//
////////////////////////////////////////////////////////////

const AutoPicker = function (selectors='.autopicker') {
    
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
            
            // DEBUGG!!!
            count = 0;
            
            able = 0,
            
            xinc = 0, yinc = 0, sens = n.dataset.sensitivity || 0.34,
            
            looping = false;
            
            msgs = {
                loaded: obj.dataset.noseLoadedEventName || 'noseloaded',
                input: obj.dataset.noseInputEventName || 'noseinput',
                colorsrc: obj.dataset.noseColorSrc || 'background-color'
            },
            
            pointMover = e => {
                
                let bbox = obj.getBoundingClientRect();

                xinc = ((e.touches[0].pageX - bbox.left) / (bbox.width  / 2 )) - 1;
                yinc = ((e.touches[0].pageY - bbox.top ) / (bbox.height / 2 )) - 1;
                
                e.stopPropagation();
                e.preventDefault();
                
            },
            
            lizzer = (
                e,
                x = e.preventDefault(),
                v = this.hsla,
                //[sk, dx, dy] = [e.shiftKey ? 500 : 50, e.wheelDeltaX, e.wheelDeltaY]
                [sk, dx, dy] = [
                    e.shiftKey ? 500 : 50,
                    (Math.abs(xinc) < sens ? 0 : -400) *
                    ((Math.abs(xinc) - sens) / (1 - sens)) * Math.sign(xinc),
                    (Math.abs(yinc) < sens ? 0 : -400) *
                    ((Math.abs(yinc) - sens) / (1 - sens)) * Math.sign(yinc),
                ]
            ) => {
                obj.dispatchEvent(new CustomEvent(msgs.input, {
            
                    detail: {
                        vals: [v.h, v.s, v.l, v.a] = e.touches[1]? [v.h, clam(v.s + dy / sk, 100, 0), v.l, clam(v.a - dx / sk * 0.01, 1, 0)] : [v.h - dy / sk, v.s, clam(v.l + dx / sk, 100, 0), v.a],
                        hsla: v,
                        value: (this.value = 'hsla(' + v.h + ',' + v.s + '%,' + v.l + '%,' + v.a + ')')
            
                    }
            
                }));
            },
            
            anim = (e) => {
                if(looping) {
                    obj.innerHTML = (
                        'x% ' + xinc + '\ny% ' + yinc +
                        '<br> ' + count++
                    );
                    lizzer(e);
                    looping = setTimeout(() => anim(e), 100);
                }
            }
                
            this.hsla = {};
            
            this.value = window.getComputedStyle(obj)[msgs.colorsrc];
            
            this.setValue = val => setVals(this, val);
            
            this.togAbility = v =>  v ? able : (obj[((able = (able + 1) % 2) ? 'add' : 'remove') + 'EventListener']('wheel', lizzer, { passive: false }), able);
            
            obj.addEventListener('touchstart', e => {
                
                console.log('touch starting');
                obj.addEventListener('touchmove', pointMover, {passive: false});
                looping = setTimeout(() => anim(e), 500);
                
            }, { passive: false });
            
            obj.addEventListener('touchend', e => {
                console.log('stopping');
                obj.removeEventListener('touchmove', pointMover);
                looping = (clearTimeout(looping));
                console.log('looping', looping ? 'yes' : 'no')
            });
                
            obj.dispatchEvent(new CustomEvent(msgs.loaded, {
                detail: {
                    value: setVals(this, this.value),
                    ability: 1//this.togAbility()
                }
            }));
            
        })(n)
        
    );
    
};