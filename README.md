This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Nearly all information in this Readme are taken from the official docs from [React](https://reactjs.org/docs/getting-started.html) and [Redux](https://redux.js.org/introduction/getting-started!

# Intro

_Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as live code editing combined with a time traveling debugger._ This is stated in the official Redux docs. As I want to understand this and get my hands dirty I created this Redux intro project to wrap my head around it! Maybe it helps you as well as it will hopefully help myself understanding Redux.

# Get an idea

## Basic wording

According to the official docs: _The whole state of your app is stored in an object tree inside a single store. The only way to change the state tree is to emit an action, an object describing what happened. To specify how the actions transform the state tree, you write pure reducers._ Okay wow, there is a lot to tackle here:

- **Store**: used to _store_ the entire state of the app as an object tree
- **Action**: an object to call to change the _Store_. This is the only way how the _Store_ can be changed! It describes what just happened
- **Reducers**: These describe _how_ the Action changes the _Store_

## Core Concepts ([official Docs](https://redux.js.org/introduction/core-concepts))

Imagine your todo app has the following _Store_:

```javascript
{
  "todos": [
    {
      "text": "Eat food",
      "completed": true
    },
    {
      "text": "Exercise",
      "completed": false
    }
  ],
  "visibilityFilter": "SHOW_COMPLETED"
}
```

To change this _Store_ you need _Actions_. As stated above these are plain JavaScript objects that describe what is happening. Here are three _Actions_:

```javascript
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }

```

The main advantage of these _Actions_ is that is clear what happened and why it changes the _Store_. According to the docs _Actions_ are like "breadcrumbs". To bring _Actions_ and _Store_ together the _Reducers_ are used. To put things simple you can see it like this: a _Reducer_ gets the current _Store_ and the _Action_ and knows what to do with this. The _Reducer_ returns the new and updated _Store_. For our small example (which is also taken from the official docs!) the _reducers_ can be implemented like this:

```javascript
function visibilityFilter(state = "SHOW_ALL", action) {
  if (action.type === "SET_VISIBILITY_FILTER") {
    return action.filter;
  } else {
    return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([{ text: action.text, completed: false }]);
    case "TOGGLE_TODO":
      return state.map((todo, index) =>
        action.index === index
          ? { text: todo.text, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
}

//This method/reducer manages the complete state of the app by calling the other two reducers
// which for themself manage smaller portions of the app
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
}
```

This describes the core idea behind Redux. For my personal note I have to say that I'm positively surprised by how "basic" the code is. There seems to be no magic so far.

## Three basic principles (taken from the docs)

### Single source of truth

**The state of your whole application is stored in an object tree within a single store.** This makes it easy to create universal apps, as the state from your server can be serialized and hydrated into the client with no extra coding effort. A single state tree also makes it easier to debug or inspect an application; it also enables you to persist your app's state in development, for a faster development cycle.

### State is read-only

**The only way to change the state is to emit an action, an object describing what happened.** This ensures that neither the views nor the network callbacks will ever write directly to the state. Instead, they express an intent to transform the state. Because all changes are centralized and happen one by one in a strict order, there are no subtle race conditions to watch out for. As actions are just plain objects, they can be logged, serialized, stored, and later replayed for debugging or testing purposes.

### Changes are made with pure functions

**To specify how the state tree is transformed by actions, you write pure reducers.** Reducers are just pure functions that take the previous state and an action, and return the next state. Remember to return new state objects, instead of mutating the previous state. You can start with a single reducer, and as your app grows, split it off into smaller reducers that manage specific parts of the state tree. Because reducers are just functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for common tasks such as pagination.

# The doing

As I primary use React for my webapps I also want to use Redux together with React. For that a special distribution of Redux exists: [React Redux](https://react-redux.js.org/introduction/quick-start) The following is according to their docs! I adjusted the code base a bit to make also use of React Hooks.

## Installation

I personally use NPM and with this Redux is installed via

```
npm install redux react-redux --save
```

Something important to note: Redux is also offering an out of the box solution for easy starts: [Redux Starter Kit](https://redux-starter-kit.js.org/). I felt tempted to easily use this but my fear is that I don't get the undestanding I want out of this. So we'll continue the "hard" way here. Stay with me 😎

## Provider

The `Provider` is used to make the Redux store available to the app. So it is called on root level, in my case it is `index.js`:

```javascript
import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "./store";

import TodoApp from "./TodoApp";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  rootElement
);
```
