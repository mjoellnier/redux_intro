import React from "react";
import { useDispatch } from "react-redux";
import cx from "classnames";
import { toggleTodo } from "../redux/actions";

const Todo = params => {
  const dispatch = useDispatch();

  return (
    <li
      className="todo-item"
      onClick={() => dispatch(toggleTodo(params.todo.id))}
    >
      {params.todo && params.todo.completed ? "👌" : "👋"}{" "}
      <span
        className={cx(
          "todo-item__text",
          params.todo && params.todo.completed && "todo-item__text--completed"
        )}
      >
        {params.todo.content}
      </span>
    </li>
  );
};

export default Todo;
