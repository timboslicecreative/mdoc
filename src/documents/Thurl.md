# Thumbor Url Builder
Simple thumbor url builder that supports all adjustments in a single function call and can be used
securely with HMAC or insecurely.


## Installation

Using NPM
```
npm install --save thurl
```

Using Yarn
```
yarn add thurl
```

## Setup
Load the package and create an instance with your base thumbor url and security key if using secure urls.

```javascript
const thurl = new Thurl('<thumbor url>', '<thumbor security key>');
```

### Secure
Use thumbor in secure (hmac) mode by providing the thumbor security key when initialising Thurl.
It is not recommended to use a security key is using this library within the browser as the security key
will be exposed.

> ES6
```javascript
import Thurl from 'thurl';
const thurl = new Thurl('http://thumbor.mydomain.com', 'abcdefghijklmnopqrstuvwxyz123');
```
> CommonJS
```javascript
const Thurl = require('../lib/index.js');
const thurl = new Thurl('http://thumbor.mydomain.com', 'abcdefghijklmnopqrstuvwxyz123');
```
> CommonJS as a one liner
```javascript
const thurl = new (require('../lib/index.js'))('http://thumbor.mydomain.com', 'abcdefghijklmnopqrstuvwxyz123')
```

### Insecure
You can use thumbor in unsafe / insecure mode by omitting the key when initialising Thurl.

>ES6
```javascript
const Thurl = import 'thurl';
const thurl = new Thurl('http://thumbor.mydomain.com');
```
>CommonJS
```javascript
const Thurl = require('../lib/index.js');
const thurl = new Thurl('http://thumbor.mydomain.com');
```


## Usage

All thumbor adjustments are supported in the adjustments object provided to the `build` function.
e.g. `thurl.build('image.jpg', {property: value})`

```javascript
thurl.build('image', {adjustments})
```

### Simple Adjustments

|Property |Type |Default |Usage |
|---|---|---|---|
|trim |Boolean |false |`{trim: true}` |
|crop |Object |null |`{crop: {left: 1, top: 1, right: 1, bottom: 1}}` |
|fit |String |null |`{fit: 'fit-in'}` |
|width |Number |null |`{width: 100}}` |
|height |Number |null |`{height: 100}}` |
|halign |String |null |`{halign: 'center'}}` |
|valign |String |null |`{valign: 'middle'}}` |
|smart |Boolean |false |`{smart: true}` |
|filter* |String or Array |null | *Read filters section |

>Simple Adjustment Examples:
```javascript
// Url: 
const imageUrl = thurl.build('image.jpg')
// imageUrl = 'http://thumbor.mydomain.com/<hmac|unsafe>/image.jpg'

// Resize: 
const thumbnail = thurl.build('image.jpg', {width: 100, height: 100})
// thumbnail = 'http://thumbor.mydomain.com/<hmac|unsafe>/100x100/image.jpg'

// Resize & Crop: 
const thumbnail = thurl.build('image.jpg', {
    crop: { left: 5, top: 10, right: 15, bottom: 20 },
    width: 100, 
    height: 100
})
// thumbnail = 'http://thumbor.mydomain.com/<hmac|unsafe>/5x10:15x20/100x100/image.jpg'
```
See [https://thumbor.readthedocs.io/en/latest/usage.html](https://thumbor.readthedocs.io/en/latest/usage.html) for all adjustments.


### Filters
You can use any thumbor filter by specifying the name and providing the filter properties as a string, number or 
array of properties. 

>Filter Examples: 
```javascript
// Blur: 
const imageUrl = thurl.build('image.jpg', {blur: [12,25]})
// imageUrl = 'http://thumbor.mydomain.com/<hmac|unsafe>/filters:blur(12,25)/image.jpg'

// Blur & Resize: 
const thumbnail = thurl.build('image.jpg', {width: 100, height: 100, blur: '12,25'})
// thumbnail = 'http://thumbor.mydomain.com/<hmac|unsafe>/100x100/filters:blur(12,25)/image.jpg'

// Resize & Watermark
const imageUrl = thurl.build('image.jpg', {width: 1024, watermark: ['http:/www.abc.com/img.png', -10, -11, 15, 25, 20]})
// imageUrl = 'http://thumbor.mydomain.com/<hmac|unsafe>/1024x/filters:watermark(http:/www.abc.com/img.png,-10,-11,15,25,20)/image.jpg'
```

Example `{blur: '12,25'}` `{blur: [12,25]}` `{brightness: -100}` `{brightness: '-100'}` `{brightness: [-100]}` are all valid. 


See [https://thumbor.readthedocs.io/en/latest/filters.html](https://thumbor.readthedocs.io/en/latest/filters.html) form more information about filters.
