import cx from "classnames";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { VISIBILITY_FILTERS } from "../constants";
import { setFilter } from "../redux/actions";

const VisibilityFilters = () => {
  const activeFilter = useSelector(state => ({
    activeFilter: state.visibilityFilter
  }));

  const dispatch = useDispatch();

  return (
    <div className="visibility-filters">
      {Object.keys(VISIBILITY_FILTERS).map(filterKey => {
        const currentFilter = VISIBILITY_FILTERS[filterKey];
        return (
          <span
            key={`visibility-filter-${currentFilter}`}
            className={cx(
              "filter",
              currentFilter === activeFilter && "filter--active"
            )}
            onClick={() => {
              dispatch(setFilter(currentFilter));
            }}
          >
            {currentFilter}
          </span>
        );
      })}
    </div>
  );
};

export default VisibilityFilters;

/**
 * This method declares how the handed in store has to be transformed for
 * this presentational component to work correctly with it when you're not using
 * the React Hooks way of doing it!
 */
// const mapStateToProps = state => {
//   return { activeFilter: state.visibilityFilter };
// };

// You'll need the connect method when you're not using the hooks!
// export default connect(
//   mapStateToProps,
//   { setFilter }
// )(VisibilityFilters);
