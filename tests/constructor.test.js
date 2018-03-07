const { expect } = require('chai');
const { sandbox } = require('sinon');
const EventEmitter = require('events');

const Observer = require('../index.js');

describe('Observer constructor', () => {
    let Sandbox = null;

    before(() => {
        Sandbox = sandbox.create();
    });

    it('should return the Observer instance of any object with an emitter, a callbacks object and the proxy object', () => {
        const objectsToTest = [
            {},
            {a: 1, b: 2},
            new Error("I'm the error"),
            new Promise((resolve, reject) => resolve()),
            new Promise((resolve, reject) => reject()),
            []
        ];

        objectsToTest.forEach(object => {
            expect(typeof object).to.eq('object');

            const observer = new Observer(object);

            expect(Object.keys(observer)).to.have.lengthOf(3);
            expect(observer).to.have.all.keys('emitter', 'callbacks', 'object');
            expect(observer.emitter).to.exist;
            expect(observer.callbacks).to.exist;
            expect(observer.object).to.exist;
            expect(observer).to.be.an.instanceOf(Observer);
            expect(observer.emitter).to.be.an.instanceOf(EventEmitter);
            expect(observer.callbacks).to.deep.eq({});
            expect(typeof observer.object).to.eq('object');
        });
    });

    it('should throw error if not an object passed as argument', () => {
        const valuesToTest = [
            1,
            true,
            2.890,
            "String",
            'String',
            `String`,
            function (){},
            () => {},
            undefined,
            NaN
        ];

        valuesToTest.forEach(value => {
            try {
                new Observer(value);
            } catch(error) {
                expect(error).to.be.an.instanceOf(Error);
                expect(error.message).to.eq(`Observer needs an object to observe, not a ${typeof value}`);
            }
        });
    });

    it('should call the createObserver function', () => {
        const objectsToTest = [
            {},
            {a: 1, b: 2},
            new Error("I'm the error"),
            new Promise((resolve, reject) => resolve()),
            new Promise((resolve, reject) => reject()),
            []
        ];

        const createObserverSpy = Sandbox.spy(Observer.prototype, 'createObserver');

        objectsToTest.forEach(object => {
            expect(typeof object).to.eq('object');

            const observer = new Observer(object);

            expect(createObserverSpy.callCount).to.eq(1);
            expect(createObserverSpy.getCall(0).args[0]).to.deep.eq(object);

            createObserverSpy.reset();
        });
    });
});