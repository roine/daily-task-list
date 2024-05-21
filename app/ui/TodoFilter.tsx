import { useAppState, useFilter } from "@/state/AppStateProvider";
import classNames from "classnames";
import { CloseIcon } from "@/icons/Close";

export const TodoFilter = () => {
  const { getFilter, clearFilter } = useFilter();
  const [state] = useAppState();

  const filter = getFilter();

  const tagColor = state.todoLists[0].tags?.[filter!]?.color;

  return (
    <div
      className={classNames("py-2 print:hidden flex items-center gap-1", {
        invisible: !filter,
      })}
    >
      <span
        className={classNames("text-sm text-base-content/75 font-semibold", {
          invisible: !filter,
        })}
      >
        Filter by:
      </span>
      <button
        className="badge badge-outline badge-sm"
        onClick={() => clearFilter()}
        aria-label={`Clear filter by ${filter}`}
      >
        <CloseIcon />
        <span
          className={`bg-gradient-to-br from-${tagColor}-300 to-${tagColor}-500 text-transparent bg-clip-text px-1 font-semibold text-xs`}
        >
          {filter}
        </span>
      </button>
    </div>
  );
};
