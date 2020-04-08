@shiftby/config

Can read options from ENV variables or files.

Example:
```js
const requiredOptions = ['SECRET_KEY'];
// File path can be provided in SECRET_KEY_FILE env
// Will fallback to SECRET_KEY env if SECRET_KEY_FILE is not set

const options = new Options(requiredOptions);
await options.initialize();

const key = options.get('SECRET_KEY');
```
