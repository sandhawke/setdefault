'use strict'
/*

 Dereference, unless the key is missing, in which case we return the
 default value, after setting it as the current value.  Works for objects
 being used as maps or proper Map objects.

 This is very convenient sometimes:

 const results = {}
 for (let p of items) {
    if (!results[p.bucket]) results[p.bucket] = []     // ewwww
    results[p.bucket].push(p)
 }

 ===>

 const results = {}
 for (let p of items) {
    setdefault(results, p.bucket, []).push(p)
 }

 The name comes from Python, which has this function.

 */

function setdefault (obj, key, val) {
  if (obj instanceof Map) {
    const old = obj.get(key)
    if (old === undefined) {
      obj.set(key, val)
      return val
    }
    return old
  }

  const old = obj[key]
  if (old === undefined) {
    obj[key] = val
    return val
  }
  return old
}

function setdefaultLazy (obj, key, valfunc) {
  if (obj instanceof Map) {
    const old = obj.get(key)
    if (old === undefined) {
      const val = valfunc()
      console.log('create val=', val)
      obj.set(key, val)
      return val
    }
    return old
  }

  const old = obj[key]
  if (old === undefined) {
    const val = valfunc()
    obj[key] = val
    return val
  }
  return old
}

setdefault.lazy = setdefaultLazy

setdefault.array = (a, b) => setdefaultLazy(a, b, () => [])
setdefault.object = (a, b) => setdefaultLazy(a, b, () => ({}))
setdefault.map = (a, b) => setdefaultLazy(a, b, () => new Map())

module.exports = setdefault
