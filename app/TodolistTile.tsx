import { useAppState } from "@/AppStateProvider";

type TodoListTitleProps = {};
export const TodolistTitle = ({}: TodoListTitleProps) => {
  const [state, actions] = useAppState();
  return (
    <h1
      contentEditable={true}
      className="text-4xl tracking-tight outline-none mb-10"
      aria-placeholder={"Your todo list title"}
      defaultValue={state.todoTitle}
      onChange={(e) => actions.changeTodoTitle(e.currentTarget.innerText)}
      suppressContentEditableWarning={true}
    >
      {state.todoTitle}
    </h1>
  );
};
