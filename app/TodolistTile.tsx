import { useAppState } from "@/state/AppStateProvider";

type TodoListTitleProps = {};
export const TodolistTitle = ({}: TodoListTitleProps) => {
  const [state, actions] = useAppState();
  return (
    <h1
      contentEditable={true}
      className="text-4xl tracking-tight outline-none mb-4 xl:mb-10"
      defaultValue={state.todoTitle}
      onBlur={(e) => actions.changeTodoTitle(e.currentTarget.innerText)}
      suppressContentEditableWarning={true}
    >
      {state.todoTitle}
    </h1>
  );
};
