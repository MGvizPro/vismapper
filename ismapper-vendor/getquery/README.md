# GetQuery.js

Easy way to handling query string parameters.


## Installation

First, you must add GetQuery.js to your HTML document:

```html
<script type="text/javascript" src="path/getquery.js"></script>
```

You can create an array with the query string parameters:

```javascript
//For example, if the url is: http://www.some.com/index.html?lang=en
//Get an array with the query
var get = GetQuery();

//Access to the parameters
alert(get['lang']); // -> Prints 'en'
```


## License

**GetQuery.js** is under the [MIT License](LICENSE).

[jm.juanes.xyz](http://jm.juanes.xyz/).

:)
