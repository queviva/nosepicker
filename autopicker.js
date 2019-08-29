/**
 * @author pizzaface
 * @version 1.0
 *
 * @fileOverview NosePicker object/namespace that
 *     holds values for all the elements in the page
 *     that you want to be nosepickers - access
 *     them through their html id, and listen for
 *     either the <i>noseinput</i> event [or specify
 *     some custom event name] - scroll UP|DOWN to
 *     set the hue, scroll LEFT|RIGHT to set the saturation,
 *     CTRL+scroll LEFT|RIGHT sets the transparency
 *     CTRL+scroll UP|DOWN set the luminocity
 *     holding the SHIFT key will increase the sensitivity
 *
 * @typedef {Object} nosepicker - hsla picker from scroll|wheelies
 *
 */
 
 /**
  * @example
  *
  * <div id="picker"></div>
  *
  * <svg><g><ellipse
  *     id="svgPicker"
  *     class="svgShape"
  *     data-nose-color-src="fill"
  *     data-nose-input-event-name="picked"
  *     cx="100" cy="100" rx="100" ry="100"
  * /></g></svg>
  *
  * <script>
  *
  * // makes nosepickers out of elements that have
  * // the id <i>picker</i>, or are <i>ellipse</i>
  * // children of an svg <i>g</i> element
  * const NP = new NosePicker('#picker, g > ellipse');
  *
  * // picker is a default example
  * // handle its <i>noseinput</i> event
  * picker.addEventListener('noseinput', e => {
  *     document.body.style.color = NP.picker.value;
  * });
  *
  * // svgPicker is customized
  * // its <i>fill</i> value gets used to set the nosepicker value
  * // handle its custome <i>picked</i> event
  * svgPicker.addEventListener('picked', e => {
  *
  *     // set a color from the nosepicker obj's value
  *     someDiv.style.backgroundColor = NP.svgPicker.value;
  *
  *     // or from the event's detail value
  *     otherDiv.style.color = e.detail.value;
  *
  *     // access the individual hsla values from .hsla
  *     someDiv.style.color = NP.svgPicker.hsla.l > 50 ? '#000' : '#fff';
  *
  *
  * });
  *
  * </script>
  *

/**
 * @constructor
 * @param {string} [selectors=.nosepicker] a valid
 *     css selector string listing everything that
 *     will be converted into a nosepicker
 */
const AutoPicker = function (selectors='.autopicker') {
    
    const
    
    /** @constant - hakc div for retrieving converted color strings */
    DIV = document.createElement('div'),
    
    /**
     * will gate a value between specified min|max values
     * @param {number[]} destructured array of three values
     *     you can pass more than three values, but that
     *     will not produce the desired result
     */
    clam = (...x) => x.sort((a, b) => a - b)[1],
    
    /**
     * @desc NosePicker's own way of computing and assigning
     *     color values to a nosepicker object
     *
     * @param {nosepicker} nose - the obj whose value should be set
     * @param {string} x - any valid css color string
     *
     */
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

    // loop through all the nosepicker elements
    document.querySelectorAll(selectors).forEach(n => this[n.id] =
        
        /**
         * @constructor make an AnonymObject for each element
         *     this slash-quote <i>weird</i> quothe slathsch
         *     construction IS, infact, necessary
         */
        new (function(obj) {
        
            let
            
            // DEBUGG!!!
            count = 0;
            
            /** @type {number} zero|one; is the picker enabled? */
            able = 0,
            
            xinc = 0, yinc = 0,
            
            looping = false;
            
            /**
             * @type {object}
             * @property {string} [loaded=noseloaded] the load event name
             * @property {string} [input=noseinput] the input event name
             * @property {string} [colorsrc=background-color] where
             *     NosePicker should retrieve the initial value from;
             *     if you want the text color or the fill color, or
             *     the stroke color, for example
            */
            msgs = {
                loaded: obj.dataset.noseLoadedEventName || 'noseloaded',
                input: obj.dataset.noseInputEventName || 'noseinput',
                colorsrc: obj.dataset.noseColorSrc || 'background-color'
            },
            
            pointMover = e => {
                
                let bbox = obj.getBoundingClientRect();

                xinc = ((e.clientX - bbox.left) / (bbox.width  / 2 )) - 1;
                yinc = ((e.clientY - bbox.top ) / (bbox.height / 2 )) - 1;
                
                e.stopPropagation();
                e.preventDefault();
                
            },
            
            /**
             * @desc the scroll|wheelie event listener
             * @returns {object} e.detail - this is a CustomEvent
             *     dispatching handler - the event's name is
             *     either <i>noseinput</i> or set in the html
             *     data-nose-input-event-name="customeName"
             *     attribute
             */
            lizzer = (
                e,
                x = e.preventDefault(),
                v = this.hsla,
                [sk, dx, dy] = [e.shiftKey ? 500 : 50, e.wheelDeltaX, e.wheelDeltaY]
            ) => {
                obj.dispatchEvent(new CustomEvent(msgs.input, {
            
                    /**
                     * @type {object} event's .detail value
                     * @property {object} vals - h.s.l.a values
                     * @property {object} hsla - the h.s.l.a values again
                     * @property {string} value - a css valid hsla() color
                    */
                    detail: {
                        vals: [v.h, v.s, v.l, v.a] = e.ctrlKey ? [v.h, clam(v.s + dy / sk, 100, 0), v.l, clam(v.a - dx / sk * 0.01, 1, 0)] : [v.h - dy / sk, v.s, clam(v.l + dx / sk, 100, 0), v.a],
                        hsla: v,
                        value: (this.value = 'hsla(' + v.h + ',' + v.s + '%,' + v.l + '%,' + v.a + ')')
            
                    }
            
                }));
            },
            
            anim = () => {
                if(looping) {
                    obj.innerHTML = (
                        'x% ' + xinc ** 3 + '\ny% ' + yinc ** 3 +
                        '<br> ' + count++
                    );
                    looping = setTimeout(anim, 500);
                }
            }
                
            /** @type {object} exposed holder for individual h.s.l.a values */
            this.hsla = {};
            
            /** @type {string} exposed css color string value */
            this.value = window.getComputedStyle(obj)[msgs.colorsrc];
            
            /**
             * @desc exposed method for directly setting the nosepicker's
             *     color value
             * @param {string} val - takes any valid css color value
             */
            this.setValue = val => setVals(this, val);
            
            /**
             * @desc toggles the disability of the nosepicker
             *
             * @param {string|number|boolean} v - if any value gets
             *     passed in, which can be evaluated to <i>true</i>
             *     from "v ?" then the current ability will be
             *     returned - ELSE the current ability will be
             *     toggled between zero|one, and then the ability's
             *     state returned
             * @returns {int|boolean} zero|one; is the picker abled?
             *
             * @example
             *
             * NP.picker0.togAbility('anything'); // returns 0|1
             * NP.picker0.togAbility(); // toggles picker0's ability
             *
             */
            this.togAbility = v =>  v ? able : (obj[((able = (able + 1) % 2) ? 'add' : 'remove') + 'EventListener']('wheel', lizzer, { passive: false }), able);
            
            // debuGG
            obj.innerHTML = 'lArded';
                
            obj.addEventListener('mousedown', e => {
                console.log('starting');
                obj.addEventListener('mousemove', pointMover, {passive: false});
                looping = setTimeout(anim, 500);
            });
            
            obj.addEventListener('mouseup', e => {
                console.log('stopping');
                obj.removeEventListener('mousemove', pointMover);
                looping = (clearTimeout(looping));
                console.log(looping, looping ? 'yes' : 'no')
            });
            
            obj.dispatchEvent(new CustomEvent(msgs.loaded, {
                /**
                 * @type {object} the event's .detail from the
                 *     loading event - default name is <i>noseload</i>
                 *     can bet set using the html data-attribute
                 *     data-nose-loaded="customeLoadName"
                 * @property {undefined} value - sets the picker's value
                 * @property {int|boolean} ability - 0|1 ; is the picker able?
                 */
                detail: {
                    value: setVals(this, this.value),
                    ability: 1//this.togAbility()
                }
            }));
            
        })(n)
        
    );
    
};