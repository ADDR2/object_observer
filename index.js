const EventEmitter = require('events');

class Observer {
    constructor(object = {}) {
        this.emitter = new EventEmitter();

        try {
            this.createObserver(object);
        } catch(error) {
            throw error;
        }
    }

    getObject(){ return this.object; }
    rebuild(object = {}){
        try {
            this.createObserver(object);
        } catch(error) {
            throw error;
        }
    }

    subscribe(prop = '', callback = null) {
        if(typeof prop !== 'string' && typeof prop !== 'number') throw new Error('Properties must be numbers or strings');
        if(typeof callback !== 'function') throw new Error('You must provide a function');
        if(`changeOn${prop}` in this.callbacks) this.unsubscribe(prop);

        this.emitter.on(`changeOn${prop}`, callback);
        this.callbacks[`changeOn${prop}`] = callback;
    }

    unsubscribe(prop = '') {
        if(typeof prop !== 'string' && typeof prop !== 'number') throw new Error('Properties must be numbers or strings');
        if(!(`changeOn${prop}` in this.callbacks)) throw new Error(`You haven't subscribed prop ${prop}`);

        this.emitter.removeListener(`changeOn${prop}`, this.callbacks[`changeOn${prop}`]);
        delete this.callbacks[`changeOn${prop}`];
    }

    handle(prop = '', callback = null) {
        if(typeof prop !== 'string' && typeof prop !== 'number') throw new Error('Properties must be numbers or strings');
        if(typeof callback !== 'function') throw new Error('You must provide a function');
        if(`handleOn${prop}` in this.callbacks) this.unhandle(prop);

        const emitterCallback = (value, prop, oldValue, obj) => {
            try {
                const result = callback(value, prop, oldValue, obj);
                if(result) Reflect.set(obj, prop, oldValue);
            } catch(error) {
                throw error;
            }
        };

        this.emitter.on(`handleOn${prop}`, emitterCallback);
        this.callbacks[`handleOn${prop}`] = emitterCallback;
    }

    unhandle(prop = '') {
        if(typeof prop !== 'string' && typeof prop !== 'number') throw new Error('Properties must be numbers or strings');
        if(!(`handleOn${prop}` in this.callbacks)) throw new Error(`You haven't subscribed prop ${prop}`);

        this.emitter.removeListener(`handleOn${prop}`, this.callbacks[`handleOn${prop}`]);
        delete this.callbacks[`handleOn${prop}`];
    }

    createObserver(object = {}) {
        if(typeof object !== 'object') throw new Error(`Observer needs an object to observe, not a ${typeof object}`);

        const handler = {
            set: (obj, prop, value) => {
                try {
                    const oldValue = obj[prop] || null;
                    this.emitter.emit(`changeOn${prop}`, value, prop, oldValue);
                    Reflect.set(obj, prop, value);
                    this.emitter.emit(`handleOn${prop}`, value, prop, oldValue, obj);
                    return true;
                } catch(error) {
                    throw error;
                }
            }
        };

        this.callbacks = {};
        this.emitter.removeAllListeners();
        this.object = new Proxy(object, handler);
    }
}

module.exports = Observer;