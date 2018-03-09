# object_observer

This is a simple observer which listens to changes on any object. These changes can only be asignations like the following:

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

To add a listener for changes on a property do the following:

```js
const Observer = require('@addr/object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);
const resultObject = observer.getObject(); // { a: 1 } Same object

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${oldValue} << to >> ${newValue} <<`);
});

resultObject.a = 3;

// Prop >> a << just changed from >> 1 << to >> 3 <<
```

To remove a listener:

```js
const Observer = require('@addr/object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);
const resultObject = observer.getObject(); // { a: 1 } Same object

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${oldValue} << to >> ${newValue} <<`);
});

resultObject.a = 3;

// Prop >> a << just changed from >> 1 << to >> 3 <<

observer.unsubscribe('a');

resultObject.a = 4;

//Nothing gets printed
```

To create a different observer with the same instance:

```js
const Observer = require('@addr/object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);

observer.rebuild({ b: 2 });
observer.subscribe('b', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${oldValue} << to >> ${newValue} <<`);
});

const resultObject = observer.getObject(); // { b: 2 }

resultObject.b = 3;

// Prop >> b << just changed from >> 1 << to >> 3 <<

console.log(objectToObserve);

// { a: 1 }
```

Also, to remove all listeners:

```js
const Observer = require('@addr/object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${oldValue} << to >> ${newValue} <<`);
});

observer.rebuild(objectToObserve);

const resultObject = observer.getObject(); // { a: 1 }


resultObject.a = 3;

// Nothing gets printed
```