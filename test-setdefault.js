'use strict'

const test = require('tape')
const setdefault = require('./setdefault')

test(t => {
  const a = {}
  setdefault(a, 'p1', 1)
  t.equal(a.p1, 1)
  t.end()
})

test(t => {
  const a = {}
  t.deepEqual(a.p1, undefined)
  setdefault(a, 'p1', []).push(10)
  t.deepEqual(a.p1, [10])
  setdefault(a, 'p1', []).push(20)
  t.deepEqual(a.p1, [10, 20])
  t.end()
})

test(t => {
  const a = new Map()
  setdefault(a, 'p1', 1)
  t.equal(a.get('p1'), 1)
  t.end()
})

test(t => {
  const a = new Map()
  t.deepEqual(a.get('p1'), undefined)
  setdefault(a, 'p1', []).push(10)
  t.deepEqual(a.get('p1'), [10])
  setdefault(a, 'p1', []).push(20)
  t.deepEqual(a.get('p1'), [10, 20])
  t.end()
})

test('lazy 1', t => {
  const a = {}
  const f = () => 1
  setdefault.lazy(a, 'p1', f)
  t.equal(a.p1, 1)
  t.end()
})

test('lazy array', t => {
  const a = {}
  const f = () => []
  t.deepEqual(a.p1, undefined)
  setdefault.lazy(a, 'p1', f).push(10)
  t.deepEqual(a.p1, [10])
  setdefault.lazy(a, 'p1', f).push(20)
  t.deepEqual(a.p1, [10, 20])
  t.end()
})

test('lazy 1 map', t => {
  const a = new Map()
  const f = () => 1
  setdefault.lazy(a, 'p1', f)
  t.equal(a.get('p1'), 1)
  t.end()
})

test('lazy array map', t => {
  const a = new Map()
  const f = () => []
  t.deepEqual(a.get('p1'), undefined)
  setdefault.lazy(a, 'p1', f).push(10)
  t.deepEqual(a.get('p1'), [10])
  setdefault.lazy(a, 'p1', f).push(20)
  t.deepEqual(a.get('p1'), [10, 20])
  t.end()
})

test('lazy with side effect', t => {
  let counter = 0
  const f = () => [++counter]
  {
    const a = new Map()
    t.deepEqual(a.get('p1'), undefined)
    setdefault.lazy(a, 'p1', f).push(10)
    t.deepEqual(a.get('p1'), [1, 10])
    setdefault.lazy(a, 'p1', f).push(20)
    t.deepEqual(a.get('p1'), [1, 10, 20])
  }
  {
    const a = new Map()
    t.deepEqual(a.get('p1'), undefined)
    setdefault.lazy(a, 'p1', f).push(10)
    t.deepEqual(a.get('p1'), [2, 10])   // <-- difference is the "2" here
    setdefault.lazy(a, 'p1', f).push(20)
    t.deepEqual(a.get('p1'), [2, 10, 20])  // and here
  }

  t.end()
})

test('.array', t => {
  const a = new Map()
  t.deepEqual(a.get('p1'), undefined)
  setdefault.array(a, 'p1').push(10)
  t.deepEqual(a.get('p1'), [10])
  setdefault.array(a, 'p1').push(20)
  t.deepEqual(a.get('p1'), [10, 20])
  t.end()
})

test('.object', t => {
  const a = new Map()
  t.deepEqual(a.get('p1'), undefined)
  setdefault.object(a, 'p1').x = 100
  t.deepEqual(a.get('p1'), {x: 100})
  setdefault.object(a, 'p1').y = 200
  t.deepEqual(a.get('p1'), {x: 100, y: 200})
  t.end()
})

test('.map', t => {
  const a = new Map()
  t.deepEqual(a.get('p1'), undefined)
  setdefault.map(a, 'p1').set('x', 100)
  t.deepEqual(a.get('p1').get('x'), 100)
  setdefault.map(a, 'p1').set('y', 200)
  t.deepEqual(a.get('p1').get('x'), 100)
  t.deepEqual(a.get('p1').get('y'), 200)
  t.end()
})
