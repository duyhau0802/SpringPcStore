import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FilterClear = ({ onClear }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClearAll = () => {
    // Navigate to clean URL (no parameters)
    navigate(location.pathname);
    
    // Trigger clear callback
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
