## setdefault

Small utility function, which I got used to in Python and miss in JS.
The name is a little misleading, but that's the name in Python.  I
think of it as "get (after setting, if necessary)".

This is useful for that pattern where if a key hasn't been used yet,
you have to first set it to a default value.

In typical JS, you end up either doing the lookup twice, or having
extra variables floating around.

Replace this:
```js
 const results = {}
 for (let p of items) {
    if (!results[p.bucket]) results[p.bucket] = []     // ewwww
    results[p.bucket].push(p)
 }
```

with this:

```js
 const setdefault = require('setdefault')
 // ..
 const results = {}
 for (let p of items) {
    setdefault(results, p.bucket, []).push(p)   // nicer!
 }
```

Works for Object or Maps.

### lazy mode

If the default value is going to be expensive to create, or have a
side effect, there's a variation:

```js
setdefault.lazy(obj, prop, f)

function f () {
  // return some big default value
}
```

We also have pre-defined variations for some common cases, just to make them a tiny bit more efficient (no extra object to garbage collect), maybe.
* setdefault.array == setdefault.lazy( , , () => [])
* setdefault.object == setdefault.lazy( , , () => ({}))
* setdefault.map == setdefault.lazy( , , () => new Map())  
