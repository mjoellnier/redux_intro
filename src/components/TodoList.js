import React from "react";
import { useSelector } from "react-redux";
import { getTodosByVisibilityFilter } from "../redux/selectors";
import Todo from "./Todo";

/**
 * This component is implemented as a functional component.
 */
const TodoList = () => {
  /**
   * The main advantage of using the hook api is that useSelector
   * does not have to return an entire object. It instead can also
   * return just a single value!
   */
  const { todos } = useSelector(state => {
    const { visibilityFilter } = state;
    const todos = getTodosByVisibilityFilter(state, visibilityFilter);
    return { todos };
  });

  return (
    <ul className="todo-list">
      {todos && todos.length
        ? todos.map((todo, index) => {
            return <Todo key={`todo-${todo.id}`} todo={todo} />;
          })
        : "No todos, yay!"}
    </ul>
  );
};

/**
 * This method declares how the handed in store has to be transformed for
 * this presentational component to work correctly with it when you're not using
 * the React Hooks way of doing it!
 */
// const mapStateToProps = state => {
//   const { visibilityFilter } = state;
//   const todos = getTodosByVisibilityFilter(state, visibilityFilter);
//   return { todos };
// };

export default TodoList;
