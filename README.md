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

// Prop >> b << just changed from >> 2 << to >> 3 <<

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

To overwrite the change after it happened:

```js
const Observer = require('@addr/object_observer');
 
const objectToObserve = {
    a: 1
};
 
const observer = new Observer(objectToObserve);
const resultObject = observer.getObject(); // { a: 1 } Same object
 
observer.handle('a', (newValue, propName, oldValue, object) => {
    console.log(`Prop >> ${propName} << has >> ${object[propName]} << and before it had >> ${oldValue} <<`);
    object[propName] = 4;
});
 
observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${objectToObserve[propName]} << to >> ${newValue} <<`);
});
 
resultObject.a = 3;
// Prop >> a << just changed from >> 1 << to >> 3 <<
// Prop >> a << has >> 3 << and before it had >> 1 <<
 
console.log(resultObject, objectToObserve);
// { a: 4 } { a: 4 }
```

To rollback the change after it happened:

```js
const Observer = require('@addr/object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);
const resultObject = observer.getObject(); // { a: 1 } Same object

observer.handle('a', (newValue, propName, oldValue, object) => {
    console.log(`Prop >> ${propName} << just changed from >> ${object[propName]} << to >> ${newValue} <<`);
    return true;
});

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${objectToObserve[propName]} << to >> ${newValue} <<`);
});

resultObject.a = 3;
// Prop >> a << just changed from >> 1 << to >> 3 <<
// Prop >> a << just changed from >> 3 << to >> 3 <<

console.log(resultObject);
// { a: 1 }
```

To remove handle listener:

```js
const Observer = require('@addr/object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);
const resultObject = observer.getObject(); // { a: 1 } Same object

observer.handle('a', (newValue, propName, oldValue, object) => {
    console.log(`Prop >> ${propName} << just changed from >> ${object[propName]} << to >> ${newValue} <<`);
    return true;
});

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${objectToObserve[propName]} << to >> ${newValue} <<`);
});

observer.unhandle('a');

resultObject.a = 3;
// Prop >> a << just changed from >> 1 << to >> 3 <<

console.log(resultObject);
// { a: 3 }
```

## Complex examples

You can build the observer without any object and after that use the object given by the observer.
And the ``oldValue`` parameter will be null because the attribute was created at the change moment.

```js
const Observer = require('@addr/object_observer');

const observer = new Observer();
const resultObject = observer.getObject(); // {}

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${oldValue} << to >> ${newValue} <<`);
});

resultObject.a = 3;

// Prop >> a << just changed from >> null << to >> 3 <<
```

In order to avoid infinite loop, don't use the object given by observer directly like this.

```js
const Observer = require('@addr/object_observer');

const objectToObserve = {
    a: 1
};

const observer = new Observer(objectToObserve);
const resultObject = observer.getObject(); // { a: 1 } Same object

observer.handle('a', (newValue, propName, oldValue, object) => {
    console.log(`Prop >> ${propName} << current value at object >> ${object[propName]} << newValue parameter >> ${newValue} <<`);
    resultObject[propName] = 4;
});

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << is about to change from >> ${objectToObserve[propName]} << to >> ${newValue} <<`);
});

resultObject.a = 3;
// Prop >> a << is about to change from >> 1 << to >> 3 <<
// Prop >> a << current value at object >> 3 << newValue parameter >> 3 <<
// Prop >> a << is about to change from >> 3 << to >> 4 <<
// Prop >> a << current value at object >> 4 << newValue parameter >> 4 <<
// Prop >> a << is about to change from >> 4 << to >> 4 <<
// Prop >> a << current value at object >> 4 << newValue parameter >> 4 <<
// Prop >> a << is about to change from >> 4 << to >> 4 <<
// Prop >> a << current value at object >> 4 << newValue parameter >> 4 <<
// Prop >> a << is about to change from >> 4 << to >> 4 <<
// Until it breaks

console.log(resultObject);
```

Instead, use the ``object`` parameter given at handle's callback.

Also, don't try to re-assign some value to your ``resultObject`` because you won't be able to listen to any changes.

```js
const Observer = require('@addr/object_observer');

const observer = new Observer();
let resultObject = observer.getObject(); // {}

observer.subscribe('a', (newValue, propName, oldValue) => {
    console.log(`Prop >> ${propName} << just changed from >> ${oldValue} << to >> ${newValue} <<`);
});

resultObject = {
    a: 1
};

resultObject.a = 3;

// Nothing gets printed
```