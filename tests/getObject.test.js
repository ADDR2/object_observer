const { expect } = require('chai');

const Observer = require('../index.js');

describe('Observer getObject', () => {
    
    it('should return the Proxy of your original object', () => {
        const objectsToTest = [
            {},
            {a: 1, b: 2},
            [],
            [1, 2, 3]
        ];

        objectsToTest.forEach(object => {
            const observer = new Observer(object);
            const proxyObject = observer.getObject();

            expect(proxyObject).to.deep.eq(object);
            expect(Object.keys(proxyObject)).to.have.lengthOf(Object.keys(object).length);
            expect(Object.values(proxyObject)).to.have.lengthOf(Object.values(object).length);
            
            object.a = 3;
            expect(proxyObject.a).to.eq(3);
            expect(proxyObject.a).to.eq(object.a);
        });
    });

    it('should not create the observer and be undefined when not an object passed as argument', () => {
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
            let observer;
            try {
                observer = new Observer(value);
            } catch(error) {
                expect(error).to.be.an.instanceOf(Error);
                expect(error.message).to.eq(`Observer needs an object to observe, not a ${typeof value}`);
                expect(observer).to.not.exist;
            }
        });
    });
    
});