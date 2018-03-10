const { expect } = require('chai');
const { sandbox } = require('sinon');

const Observer = require('../index.js');

describe('Observer unhandle', () => {

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

    it('should remove handle listener when prop is valid and found', () => {
        const callback = (newValue, propName, oldValue, object) => {
            throw new Error('This should not be called');
        };

        this.observer.handle('a', callback);

        const resultObject = this.observer.getObject();
        let events = this.observer.emitter.eventNames();
        expect(events).to.have.lengthOf(1);
        expect(events[0]).to.eq('handleOna');
        expect(Object.keys(this.observer.callbacks)).to.have.lengthOf(1);
        expect(this.observer.callbacks).to.have.all.keys('handleOna');
        expect(this.observer.callbacks['handleOna']).to.not.deep.eq(callback);

        this.observer.unhandle('a');
        events = this.observer.emitter.eventNames();
        expect(events).to.have.lengthOf(0);
        expect(Object.keys(this.observer.callbacks)).to.have.lengthOf(0);

        resultObject.a = 2;
    });

    it('should throw error if prop not found in observers listeners', () => {
        const propNotFound = 'Not in there';

        try {
            this.observer.unhandle('Not in there', () => {});
        } catch(error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.eq(`You haven't subscribed prop ${propNotFound}`);
        }
    });

    it('should throw error if not valid prop', () => {
        const valuesToTest = [
            true,
            null,
            {},
            [],
            new Error(),
            function() {},
            () => {}
        ];

        valuesToTest.forEach(value => {
            try {
                this.observer.unhandle(value);
            } catch(error) {
                expect(error).to.be.an.instanceOf(Error);
                expect(error.message).to.eq('Properties must be numbers or strings');
            }
        });
    });

});