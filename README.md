# object_observer

This is a simple observer which listen to changes on any object. This changes can only be asignations like the following:

```js
const objectToObserve = {
    a: 1
};

objectToObserve.a = 2;
```

## Dependencies

    Only depends on ``events`` node module, which does not need to be installed. And ES6 support.

## To run

```sh
npm start
```

## To test

```sh
npm test
```

## Examples of use

```js
const Observer = require('object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);
const resultObject = observer.getObject(); // { a: 1 } Same object

observer.subscribe('a', (newValue, propName) => {
    console.log(`Prop ${propName} just changed from ${objectToObserve.a} to ${newValue}`);
});

resultObject.a = 3;

// Prop a just changed from 1 to 3
```