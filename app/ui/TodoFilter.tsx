import { useAppState } from "@/state/AppStateProvider";
import classNames from "classnames";
import { CloseIcon } from "@/icons/Close";
import { useFilter } from "@/hook/useFilter";

export const TodoFilter = () => {
  const { getFilter, clearFilter } = useFilter();
  const [state] = useAppState();

  const filter = getFilter();

  const tagColor = state.todoLists[0].tags?.[filter!]?.color;

  return (
    <div
      className={classNames(
        "flex items-center gap-1 px-3 py-3 lg:py-4 print:hidden",
        {
          invisible: !filter,
        },
      )}
    >
      <span
        className={classNames("text-sm font-semibold text-base-content/75", {
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
          className={`bg-gradient-to-br from-${tagColor}-300 to-${tagColor}-500 bg-clip-text px-1 text-xs font-semibold text-transparent`}
        >
          {filter}
        </span>
      </button>
    </div>
  );
};
