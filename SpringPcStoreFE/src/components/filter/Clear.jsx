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
      <div className="card-body fw-bold text-uppercase d-flex justify-content-between align-items-center">
        <span>Filter by</span>
        <button 
          type="button" 
          className="btn btn-sm btn-outline-danger"
          onClick={handleClearAll}
          title="Clear all filters"
        >
          <i className="bi bi-x-circle me-1"></i> Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterClear;
