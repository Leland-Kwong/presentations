# Functional Programming

## What is it?

The primary idea behind functional programming is to keep side-effects to an absolute minimum by keeping pushing state changes to the edges of an application.

## Types of side-effects

* Modifying any external variable or object property (e.g., a global variable, or a variable in the parent function scope chain)
* Logging to the console.
* Writing to the screen.
* Writing to a file.
* Writing to the network.
* Triggering any external process.
* Calling any other functions with side-effects.

## What is wrong with side effects?

A vast amount of bugs in our applications tend to come from unexpected changes to state which include: database updates, DOM changes (web browser) or local app state. These changes in external state create unpredictability and cause those, **"it works on Mondays, and sometimes on Tuesdays"**, situations.

## Changing state without changing it

### Applications are about data transformation

One universal truth about every application is that they take input data and transform it to produce a desired end-state. We can represent this as: 

```javascript
const app = (input) => {
  return transformInput(input) 
}
const endState = app(someData)
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

In order to understand why side-effects can be problematic, lets introduce a new function called `sumWithPreviousState`:

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

Notice how in this example, we called the `sum` function with the exact same inputs, yet we got a different result each time? That is due to the fact that each call to `sum` was also modifying an external variable `state`.

### State as a snapshot of change over time

So how do we represent state changes without side effects? We can think of the state of an application as a snapshot in time. Lets rewrite `sumWithPreviousState` following this approach:

```javascript
const stateA = 0

function sumWithPreviousState(state, x, y) {
  return x + y + state
}

assert.equal(
  sum(stateA, 1, 1), // 2
  sum(stateA, 1, 1)  // 2
) // true

const stateB = sumWithPreviousState(stateA, 1, 1)

assert.equal(
  sum(stateB, 1, 1), // 4
  sum(stateB, 1, 1)  // 4
) // true
```

Notice how we were able to change state while maintaining functional purity. Now we have a predictable and testable method!
