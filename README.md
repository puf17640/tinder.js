<div align="center">
	<h1>Tinder.JS</h1>
	<strong><i>JavaScript Wrapper for the Tinder API</i></strong><br><br>
	<h4>Documentation coming soon...</h4>
	<small>This project was inspired by <a href="https://github.com/Kaktushose/tinder.py">tinder.py</a></small>
</div>


# Usage

~~~js
// Once the package is published on npm
const Tinder = require('tinder.js')
// Your x-auth-token can be found with devtools
// in the network tab. It's sent with every request
const tinder = new Tinder("X-AUTH-TOKEN")

// To adjust the caching behaviour, pass in an options object like so:
// for even more control, scroll down to the "Caching" section
const tinder = new Tinder("X-AUTH-TOKEN", { 
    // amount of items you want to keep in cache
    maxItems: 500, 
    // time an item will be kept in cache (in ms)
    maxAge: 10000
})
~~~
Now that we have our tinder client ready, lets get some recommendations(swipes) and start swiping!
~~~js
// Since tinder sends us a random set of recommendations on every request
// we have to queue the swipes that are sent and only request some new ones
// once our queue is empty
const queue = []
const fetchRecs = (async () => {
    queue.push(...(await tinder.getSwipes()))
	console.log(queue)
	// will print an array of your swipe recommendations
	
})();
~~~

# Caching

If you don't want to risk getting ratelimited or even banned, it is always a good idea to cache API responses.
This library already caches all the relevant responses by default, but if you want to have more control over the caching behaviour, you can pass your own CacheManager. It has to be a constructable class that gets passed an object from us with the keys `max` and `maxAge`.

```js
// instantiate the client with custom cache/cache manager, if omitted, fallback cache will be used
const tinder = new Tinder("X-AUTH-TOKEN", { cache: myCustomCache })
```
The options object we are passing looks like this:
```js
const options = {
    maxItems: 500,           // max amount of items in cache
    maxAge: 1000 * 60 * 60   // max livetime in milliseconds
}
```
Make sure your cache manager has the following methods available:
```js
// key will always be a string
cache.get(key)

// value will be a JSON.strigified object
cache.set(key, value)

// exptected to return a boolean
cache.has(key)

// delete the given key and its value from cache
cache.del(key)

// reset and empty the entire cache
cache.reset()
```

# Logging

There are really not that much console.log statements in this lib but still we wanted to offer the option to pass in a custom logger, because we know the pain of libraries writing to console when you wanted to use a custom logger.

Pass your custom logger like so:
```js
const tinder = new Tinder("X-AUTH-TOKEN", { 
    logger: myCustomLogger,
    // this is optional
    debug: false
})
```
Your logger has to be constructable and will be passed a boolean from us to determine if you want debug output or not. The following methods are required:
```js
myCustomLogger.log()

myCustomLogger.info()

myCustomLogger.warn()

myCustomLogger.error()

myCustomLogger.debug()
```
