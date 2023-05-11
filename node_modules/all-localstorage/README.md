All-LocalStorage
==================================================

Interact with Browser localStorage and NodeJS in-Memory with more additional features.

[![npm version][npm-badge]][npm]
[![Rate on Openbase](https://badges.openbase.com/js/rating/all-localstorage.svg)](https://openbase.com/js/all-localstorage?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

[npm]: https://www.npmjs.org/package/all-localstorage
[npm-badge]: https://img.shields.io/npm/v/all-localstorage.svg?style=flat-square


## Features

* Set, Get, Clear data: Already the case with the native APIs.
* Single and concise API to interact with all type of storage.
* Support all Javascript Types of data: String, Number, Object, Array, ... No need to JSON.stringify() before to store object, neither to parse the data when retreived.
* Auto-select the Storage depending on the environment.
* Encrypt and Decrypt data stored in the localstorage.
* Save flash data: Temporary hold data and delete after retreived.
* Map stored data by prefixing attributes/keys for grouping fetch and targeted flush delete.

## Installation

Install using npm:

```shell
$ npm install all-localstorage
```
then import it into your code

```javascript
const Storage = require('all-localstorage');

// or 

import Storage from 'all-localstorage';
```

Via HTML `<script>` tag with the CDN source:

```HTML
<script src="https://cdn.jsdelivr.net/npm/all-localstorage@1.0.1/all-localstorage.min.js" type="text/javascript"></script>
```

Or download `localstorage.js` or `localstorage.min.js` files from the repository into your project.

```HTML
<script src="/localstorage.min.js" type="text/javascript"></script>
```


## Usage

Create new instance.

```javascript
const options = {
    prefix: 'my_',
    storage: 'in-memory',
    encrypt: true,
    // ...
}

const store = new Storage( options );
```


## Options

* **prefix**: `String` Prefix of attributes in the store. **Important** during flush data process.

* **storage**: `String` Targeted storage: **localStorage**, **in-memory**, ... Default: `localStorage`

* **encrypt**: `Boolean` Define whether data should be encrypted before to be stored. Default: `false`

* **token**: `String` Specify a unique token to use to encrypt the data



## Methods

### `set(attribute, data)`

Insert data to the storage

```javascript
const data = "hello";

store.set('greeting', data );
```

### `get(attribute)`

Retreive stored data. Return `false` when the attribute of data specify does not exist.

```javascript
const data = store.get('greeting');

console.log( data ); // Hello
```

### `flash(attribute, data)`

Insert temporary a data to the storage. The stored data get deleted immediately when `get()` method is called to retreive the data. Useful for saving flash data. To not confund with `flush()` described below.

```javascript
const data = { foo: 'bar' };
store.flash('attr', data);

const data2 = store.get('attr');
console.log( data2 ); // { foo: 'bar' }

// Data stored calling `flash` method can only be `get` once
console.log( store.get('attr') ); // undefined
```

### `update(attribute, data, [action])`

Update stored. This method is useful to make changes on Array or Object data without re-inserting the whole data set like we normally do with the conventional localstorage APIs. It accepts three arguments, the `attribute`, `data`, and `action` (Optional)
- When the stored data is an array, use the `action` argument to specify what to do: `push`, `shift`, `pop` ...
- When the stored data is an Object, the only use of the `action` argument is to delete a field. If `action` argument is not set, `data` will be merge with the existing stored object so it must also be an object.
    **Note**: Specify array of fields (`data` argument) to delete multiple fields of as store data Object.

Return `false` if the update failed


**Example with Array Data**

```javascript
const data = [ 'foo' ];
store.set('attr', data);

// Example with Array Data
store.update('attr', 'bar', 'push') // add new value to the Array
console.log( store.get('attr') ) // [ 'foo', 'bar' ]
```

**Example with Object Data**

```javascript

const data = { foo: 'bar' };
store.set('attr', data );

const data1 = { bar: 'foo' }
store.update('attr', data1) // The new object will be merge with the existing stored data
console.log( store.get('attr') ) // { foo: 'bar', bar: 'foo' }

// Update by deleting object field: The second argument c
store.update('attr', 'foo', 'delete');
console.log( store.get('attr') ); // { bar: 'foo' } : the `foo` field is deleted
```

### `clear(attributes)`

Clear single or multiple store set.

```javascript
// Clear single set
store.clear('greeting');

// Clear multiple set
store.clear([ 'greeting', 'attr' ]);
```

### `flush([prefix])`

Clear all stored set with the attribute prefix specify in the options. *Most important use case of the prefix*

```javascript
store.flush('my_');
```

## Additional feature

Sometimes, when using a View rendering engine like `handlebars`, `twig`, ... for instance, the injected scope data, instead of being hold in a global variable, can be immediately stored in one of the localstorage once the DOM get loaded. Use case example:

```handlebars
<body>
    <!-- UserData is injected: Eg. Using handlebar view engine -->
    <div data-store="profile" data-store-type="set" data-store-value="{{ UserData }}">

    <script src="/localstorage.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        var store = new Storage()

        // Display the content of `UserData` injected
        console.log( store.get('profile') )
    </script>
</body>
```

These HTML attributes can be use anywhere in the document to trigger this feature.

- **data-store** Specify the attribute of the store
- **data-store-type** Specify the method to use for storing the data. Only `set`, `flash`, `update` can be use for now.
- **data-store-value** Payload of the data to store (Must be a String)

    ### Note:
    The various HTML tag attributes must be set before to initialize the `Storage`, otherwise, it won't works


That's it!



Feedback & Contribution
-------

You know the say: No one is whole alone! So, feedbacks and the smallest contributions you can think of are all welcome. Kindly report any encounted [Issues here][] and I'll be glad to work on it right away. Thank you.


License
-------

This software is free to use under the MIT license. See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/fabrice8/all-localstorage/blob/master/LICENSE
[Issues here]: https://github.com/fabrice8/all-localstorage/issues