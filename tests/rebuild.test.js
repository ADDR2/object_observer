const { expect } = require('chai');
const { sandbox } = require('sinon');
const EventEmitter = require('events');

const Observer = require('../index.js');

describe('Observer rebuild', () => {
    
    describe('After constructor went well', function() {

        beforeEach(() => {
            this.observer = new Observer({ a: 1 });
        });

        it('should create a new Proxy and remove the old change listeners if any', () => {
            const newObject = {
                a: 2
            };
            this.observer.subscribe('a', () => {
                throw new Error('This should not be called');
            });

            this.observer.rebuild(newObject);
            const resultObject = this.observer.getObject();

            resultObject.a = 3;
            expect(resultObject).to.deep.eq(newObject);
            expect(resultObject).to.have.all.keys('a');
            expect(resultObject.a).to.eq(3);
            expect(this.observer.callbacks).to.deep.eq({});
            expect(this.observer.emitter.eventNames()).to.have.lengthOf(0);
        });

        it('should create a new Proxy as well when nothing passed as argument', () => {
            this.observer.subscribe('a', () => {
                throw new Error('This should not be called');
            });

            this.observer.rebuild();
            const resultObject = this.observer.getObject();

            resultObject.a = 3;
            expect(resultObject).to.have.all.keys('a');
            expect(resultObject.a).to.eq(3);
            expect(this.observer.callbacks).to.deep.eq({});
            expect(this.observer.emitter.eventNames()).to.have.lengthOf(0);
        });

        it('should create a new Proxy as well when undefined passed as argument', () => {
            this.observer.subscribe('a', () => {
                throw new Error('This should not be called');
            });

            this.observer.rebuild(undefined);
            const resultObject = this.observer.getObject();

            resultObject.a = 3;
            expect(resultObject).to.have.all.keys('a');
            expect(resultObject.a).to.eq(3);
            expect(this.observer.callbacks).to.deep.eq({});
            expect(this.observer.emitter.eventNames()).to.have.lengthOf(0);
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
                NaN
            ];

            valuesToTest.forEach(value => {
                try {
                    this.observer.rebuild(value);
                } catch(error) {
                    expect(error).to.be.an.instanceOf(Error);
                    expect(error.message).to.eq(`Observer needs an object to observe, not a ${typeof value}`);
                }
            });
        });

    });

    describe('After constructor went wrong', function() {

        beforeEach(() => {
            try {
                this.observer = new Observer(true);
            } catch(error) {
                //continue
            }
        });

        it('should not be defined because there is no instace of observer', () => {
            try {
                this.observer.rebuild({ a: 1 });
            } catch(error) {
                expect(error).to.be.an.instanceOf(Error);
                expect(error.message).to.eq("Cannot read property 'rebuild' of undefined");
            }
        });

    });
});