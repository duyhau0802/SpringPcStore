import React from "react";

const FilterClear = ({ onClear }) => {
  const handleClearAll = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body fw-bold text-uppercase">
        Filter by{" "}
        <button 
          type="button" 
          className="btn btn-sm btn-light"
          onClick={handleClearAll}
        >
          <span aria-hidden="true">&times;</span> Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterClear;
