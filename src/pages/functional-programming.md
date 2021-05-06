# Functional Programming

## Table of contents

## What is it?

The primary goal of functional programming is to write programs that produce predictable results by pushing all side effects to the edges of the system.

## What are side-effects?

A vast amount of bugs in applications tend to come from unexpected changes to state, also known as side-effects. Examples of these includes:

* Modifying any external variable or object property (e.g., a global variable, or a variable in the parent function scope chain)
* Logging to the console.
* Writing to the screen.
* Writing to a file.
* Writing to the network.
* Triggering any external process.
* Calling any other functions with side-effects.

## Changing state without changing it

### Applications are about data transformation

One universal truth about every application is they always transform data to produce a desired end-state which we can simplify to: 

```javascript
const endState = app(someInputData)
```

### Transformations via pure functions

In mathematical terms a **pure function** should always be produce a consistent output for any given input. The benefit of functional purity is that we always get a predictable result.

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

In order to understand why side-effects can be problematic, lets look at this example where we sum the values with previous state:

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
