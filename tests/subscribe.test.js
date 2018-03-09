const { expect } = require('chai');
const { sandbox } = require('sinon');
const Observer = require('../index.js');

describe('Observer subscribe', () => {

    before(() => {
        this.objectToObserve = { a: 1 };
    });
    
    beforeEach(() => {
        this.oldObject = { ...this.objectToObserve };
        this.observer = new Observer(this.objectToObserve);
    });

    afterEach(() => {
        this.objectToObserve = { ...this.oldObject };
    });

    it('should add a listener to the observer and create an entry for the callbacks object', done => {
        const callback = (newValue, propName, oldValue) => {
            expect(newValue).to.not.eq(this.objectToObserve.a);
            expect(oldValue).to.eq(this.objectToObserve.a);
            expect(propName).to.eq('a');
            done();
        };

        this.observer.subscribe('a', callback);

        const resultObject = this.observer.getObject();
        const events = this.observer.emitter.eventNames();
        expect(events).to.have.lengthOf(1);
        expect(events[0]).to.eq('changeOna');
        expect(Object.keys(this.observer.callbacks)).to.have.lengthOf(1);
        expect(this.observer.callbacks).to.have.all.keys('changeOna');
        expect(this.observer.callbacks['changeOna']).to.deep.eq(callback);

        resultObject.a = 2;
    });

    it('should overwrite any listener with the same name', done => {
        const callback = (newValue, propName, oldValue) => {
            expect(newValue).to.not.eq(this.objectToObserve.a);
            expect(oldValue).to.eq(this.objectToObserve.a);
            expect(propName).to.eq('a');
            done();
        };

        const fakeCallback = () => {
            throw new Error('Should never enter here');
        };

        this.observer.subscribe('a', fakeCallback);
        this.observer.subscribe('a', callback);

        const resultObject = this.observer.getObject();
        const events = this.observer.emitter.eventNames();
        expect(events).to.have.lengthOf(1);
        expect(events[0]).to.eq('changeOna');
        expect(Object.keys(this.observer.callbacks)).to.have.lengthOf(1);
        expect(this.observer.callbacks).to.have.all.keys('changeOna');
        expect(this.observer.callbacks['changeOna']).to.deep.eq(callback);
        expect(this.observer.callbacks['changeOna']).to.not.deep.eq(fakeCallback);

        resultObject.a = 2;
    });

    it('should throw error if not valid prop', () => {
        try {
            this.observer.subscribe(true, () => {});
        } catch(error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.eq('Properties must be numbers or strings');
        }
    });
    
});