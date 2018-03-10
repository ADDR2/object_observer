const { expect } = require('chai');
const { sandbox } = require('sinon');

const Observer = require('../index.js');

describe('Observer handle', () => {

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

    it('should add a handle listener to the observer and create an entry for the callbacks object', done => {
        const callback = (newValue, propName, oldValue, object) => {
            expect(newValue).to.eq(this.objectToObserve.a);
            expect(oldValue).to.not.eq(this.objectToObserve.a);
            expect(propName).to.eq('a');
            expect(object).to.deep.eq(this.objectToObserve);
            done();
        };

        this.observer.handle('a', callback);

        const resultObject = this.observer.getObject();
        const events = this.observer.emitter.eventNames();
        expect(events).to.have.lengthOf(1);
        expect(events[0]).to.eq('handleOna');
        expect(Object.keys(this.observer.callbacks)).to.have.lengthOf(1);
        expect(this.observer.callbacks).to.have.all.keys('handleOna');
        expect(this.observer.callbacks['handleOna']).to.not.deep.eq(callback);

        resultObject.a = 2;
    });

    it('should overwrite any listener with the same name', done => {
        const callback = (newValue, propName, oldValue, object) => {
            expect(newValue).to.eq(this.objectToObserve.a);
            expect(oldValue).to.not.eq(this.objectToObserve.a);
            expect(propName).to.eq('a');
            expect(object).to.deep.eq(this.objectToObserve);
            done();
        };

        const fakeCallback = () => {
            throw new Error('Should never enter here');
        };

        this.observer.handle('a', fakeCallback);
        this.observer.handle('a', callback);

        const resultObject = this.observer.getObject();
        const events = this.observer.emitter.eventNames();
        expect(events).to.have.lengthOf(1);
        expect(events[0]).to.eq('handleOna');
        expect(Object.keys(this.observer.callbacks)).to.have.lengthOf(1);
        expect(this.observer.callbacks).to.have.all.keys('handleOna');
        expect(this.observer.callbacks['handleOna']).to.not.deep.eq(callback);

        resultObject.a = 2;
    });

    it('should throw error if not valid prop', () => {
        try {
            this.observer.handle(true, () => {});
        } catch(error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.eq('Properties must be numbers or strings');
        }
    });

    it('should throw error if not valid callback', () => {
        const valuesToTest = [
            1,
            true,
            2.890,
            "String",
            'String',
            `String`,
            NaN,
            undefined,
            null,
            {},
            [],
            new Error()
        ];

        valuesToTest.forEach(value => {
            try {
                this.observer.handle(1, value);
            } catch(error) {
                expect(error).to.be.an.instanceOf(Error);
                expect(error.message).to.eq('You must provide a function');
            }
        });
    });
    
    it('should throw error if callback not passed as argument', () => {
        try {
            this.observer.handle(1);
        } catch(error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.eq('You must provide a function');
        }
    });

    it('should behave normally if not passed a prop', () => {

        this.observer.handle(undefined, () => {});

        const resultObject = this.observer.getObject();
        const events = this.observer.emitter.eventNames();
        expect(events).to.have.lengthOf(1);
        expect(events[0]).to.eq('handleOn');
        expect(Object.keys(this.observer.callbacks)).to.have.lengthOf(1);
        expect(this.observer.callbacks).to.have.all.keys('handleOn');
    });

});