# Functional Programming

## Table of contents

## Why functional?

The primary goal of functional programming is to write predictable programs by pushing all side effects towards the edges of the system.

## Tradeoffs

Like many programming patterns, functional programming has its own set of tradeoffs:

* can be slower than direct mutation
* can require more memory

Keep in mind, when practiced in a principled manner, we can substantially mitigate these tradeoffs.

## What are side effects?

A vast amount of bugs in applications tend to come from unexpected changes to state, also known as **side effects**.

Examples of side effects include:

* Mutating a variable or object property
* Logging to the console.
* Writing to the screen.
* Writing to a file.
* Writing to the network.
* Triggering any external process.
* Calling any other functions with side-effects.

## Thinking functionally

### All about data transformation

The ultimate goal of every application is to transform data to a desired end-state, and use that end-state to generate side-effects. Consider a simple ui application that responds to user input:

```javascript
const run = (state) => {
  // side-effect
  render(state)

  onInput((event) => {
    const newState = transformData(state, event)
    // continue cycle
    run(newState)
  })
}

run({})
```

### Transformations via pure functions

In mathematical terms a **pure function** should always be produce a consistent output for any given input.

```javascript
function sum(x, y) {
  return x + y
}

assert.equal(
  sum(1, 1), // 2
  sum(1, 1)  // 2
) // true
```

### Side effects break purity

In order to understand why side-effects can be problematic, let us consider this example where we sum up values with previous state:

```javascript
let state = 0

function sumWithPreviousState(x, y) {
  const result = x + y + state
  // side-effect
  state = result
  return result
}

assert.equal(
  sum(1, 1), // 2
  sum(1, 1)  // 4
) // false
```

Notice how in this example, we called the `sum` function with the exact same inputs, yet we got a different result each time. That occurred because each call to `sum` was also modifying an external variable `state`. So how might we fix this?

### State as a snapshot of change over time

We can think of the state of an application as a snapshot in time. Lets rewrite `sumWithPreviousState` using this approach:

```javascript
function sumWithPreviousState(state, x, y) {
  return x + y + state
}

const stateA = 0
const stateB = sumWithPreviousState(stateA, 1, 1)

assert.equal(
  sum(stateA, 1, 1), // 2
  sum(stateA, 1, 1)  // 2
) // true

assert.equal(
  sum(stateB, 1, 1), // 4
  sum(stateB, 1, 1)  // 4
) // true
```

Notice how we were able to change state while maintaining functional purity. Now we have a predictable and testable method!

### Transforming objects and arrays

Working with objects and arrays in an immutable way takes a bit more finesse. A simple way to think of it is to to always make a new copy of the data with the new changes applied. Javascript has a number methods and convenient syntax for a functional programming style. In particular, `map`, `filter`, and `reduce` all provide you a nice clean functional way of transforming arrays. In fact, you can accomplish nearly all forms of data transformation using just these methods.

Here are some examples on how we might work with an array:

```javascript
// push
const listA = [1, 2, 3]
const listB = [...listA, 4]

// remove by index
const listA = [1, 2, 3]
const indexToRemove = 1
const listB = listA
  .filter((_, i) => i === indexToRemove)

// insert at index
const listA = [1, 2, 3]
const indexToInsert = 1
const listB = [
  ...listA.slice(0, indexToInsert),
  itemToInsert,
  ...listB.slice(indexToInsert + 1)
]
```

This definitely isn't as convenient to write as `array.push` or `array.splice`. Thankfully, a library called [immer](https://www.npmjs.com/package/immer) allows us to use native array and object mutation methods and it handles all the immutable copying for us. Here's an example of how powerful and simple this library is:

```javascript
import { produce } from 'immer'

const todos1 = [
  {
    text: 'get the milk',
    done: false
  }
]

const todos2 = produce(todos1, (draft) => {
  draft[0].done = false 
})

assert.equal(
  todos1,
  todos2
) // true

assert.equal(
  todos1[0],
  todos2[0]
) // true

const todos3 = produce(todos2, (draft) => {
  draft[0].done = true 
})

assert.equal(
  todos1,
  todos2
) // false
```

### Structural sharing for high-performance transformations

Copying the entire object each time we want to make a new change has an `O(N)` time complexity, meaning it takes `n` operations to complete, where `n` is the number of items for that object. Structural sharing can reduce this time significantly by copying only parts of the object that need changing.

> "It’s kind of similar to the way git manages multiple versions of your source code: git doesn’t copy all the files on each commit. Instead, the files that are not changed by a commit are shared with previous commits." - [Yehonathan Sharvit on structural sharing](https://blog.klipse.tech/javascript/2021/02/26/structural-sharing-in-javascript.html)

#### Persistent immutable data structures

**Todo**: We could talk about HAMT and how languages like Clojure and libraries like immutablejs use this to do efficient immutable updates.

## Managing side effects

### Push side effects to the edges

**Todo**: need to finish this section up

Anytime you would want do a side effect, consider if you can move it further up the function chain. Some examples of how we might do this:

### React is pure, Vue and Angular are partially pure

**Todo**: We could talk about how frontend libraries like React and Vue make state management vastly simpler by eliminating hand-written DOM manipulation. We would also talk about the difference with how they manage state, where React never mutates, and Vue is all about mutation. We can also talk about how both libraries do side-effect free rendering.

## Additional resources

### Popular functional javascript libraries

* [React](https://reactjs.org)
* [Redux](https://redux.js.org/)
* [Immer](https://immerjs.github.io/immer/)
* [Ramda](https://www.npmjs.com/package/ramda)
* [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide)

### Functional languages

* [Elm](https://elm-lang.org/)
* [ReasonML](https://reasonml.github.io/)
* [Clojure](https://clojurescript.org/)
* [Scala](https://www.scala-lang.org/)
* [Haskell](https://www.haskell.org/)
* [F#](https://fsharp.org/)
* [Elixir](https://elixir-lang.org/learning.html)

### Functional databases
* [Datomic](https://www.datomic.com/)
