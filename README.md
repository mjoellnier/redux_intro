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

## The Redux part of the app

All the stuff that has directly to do with Redux (Store, Actions and Reducers) are in a special folder `redux`. This separates the redux _configuration_ from the rest of the app. So you end up with the following structure:

```
src/
L components/
L redux/
  L reducers/
      index.js
      todos.js
      visibilityFilters.js
  actions.js
  actionTypes.js
  selectos.js
  store.js
index.js
...
```

The **Store** is initialized in the `store.js` file on the root redux level via the `createStore` method. It takes several arguments but here only one is needed: the location of the reducers. As there is an `index.js` file in the location, it takes whatever this returns. This allows us to create multiple different reducers in their own files and export them as one. For more information check out the [createStore api docs](https://redux.js.org/api/createstore)

The **Actions** are declared in their own file as well. As Actions are simple JavaScript objects they always contain a `type`. It is considered good practice to define the types in constants which can be declared in an own file when the app becomes large enough. This allows for more structure. The rest of the action object is up to you and how you implement the reducers. In this example there is always a payload declared which is used in the reducers.

The **Reducer** are in their own subfolder. This allows us to create multiple reducer files that handle differend portions of the state manipulation and export them combined for the store creation (see notes above). Each reducer is created with the same structure: there is an initial state and a function that manipulates the given state. The method should accept two parameter: `state` and `action`. It should be considered good practice to pass the `initialState` as default parameter to the state parameter. The method should take the `action` parameter to decide what to do with the given `state`. This is best done via a `switch/case`. To export multiple `reducer` you can make use of the `combineReducer` method and declare that in an `index.js`. The `combineReducers` method is not bound to the top level you can call it also in between to combine reducers for structural reasons. For more information check the [official docs for the method](https://redux.js.org/api/combinereducers!

In this example you also find a `selectors.js` file in the redux part. This is a convenience class to easily access the redux store items.

## Work with Redux in the app

We're nearly there - the last step is to access and work with the Redux items from within the app source. For this I made use of the **Hook API** that React-Redux implements from version `7.1.0` on. I left some of the code as comments in the files how you can use Redux without Hooks, but as I'm a fan of the Hooks API I implemented them in the Redux calls.

**To access the redux store** you can make use of the `useSelector` hook. It takes a selector function and is able to return either a single value or an object from the redux state. For a deeper dive into this hook check out the [official docs](https://react-redux.js.org/next/api/hooks).

**To call an action** you can make use of the `useDispatch` hook. With it you can call the action method:

```javascript
const dispatch = useDispatch();
return (
  <button onClick={() => dispatch(importedActionMethod(params)}>
    Action Button
  </button>
);
```

# Conclusion

I needed definatly some time to wrap my head around the idea and the ways how to work with Redux. But especially the option to work with hooks made it very easy to get into it! I absolutely recommend to you to take yourself time to get the core ideas and the doing right! As I scrolled through the docs I also saw that this is just scratching the surface. But it's a good start and you can get going with it!

When you find any error or you want to contribute to this guide feel free to! I'm looking forward to each PR 😊

**And that's it folks - happy coding!**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Nearly all information in this Readme are taken from the official docs from [React](https://reactjs.org/docs/getting-started.html) and [Redux](https://redux.js.org/introduction/getting-started)!
