import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { categoryAPI } from "../../services/categoryAPI";

const FilterCategory = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadCategories();
    // Parse current URL to set selected category
    const urlParams = new URLSearchParams(location.search);
    const categoryId = urlParams.get('categoryId');
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    }
  }, [location.search]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to tech categories if API fails
      setCategories([
        { id: 1, name: "Laptops" },
        { id: 2, name: "Desktop PCs" },
        { id: 3, name: "Monitors" },
        { id: 4, name: "Graphics Cards" },
        { id: 5, name: "Processors" },
        { id: 6, name: "Memory (RAM)" },
        { id: 7, name: "Storage (SSD/HDD)" },
        { id: 8, name: "Motherboards" },
        { id: 9, name: "Power Supplies" },
        { id: 10, name: "Computer Cases" },
        { id: 11, name: "Cooling Systems" },
        { id: 12, name: "Gaming Peripherals" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    const newSelectedCategory = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newSelectedCategory);
    
    // Update URL
    const urlParams = new URLSearchParams(location.search);
    if (newSelectedCategory) {
      urlParams.set('categoryId', newSelectedCategory);
    } else {
      urlParams.delete('categoryId');
    }
    
    // Navigate to new URL
    navigate(`${location.pathname}?${urlParams.toString()}`);
    
    // Also trigger filter change
    if (onFilterChange) {
      onFilterChange({ 
        categoryId: newSelectedCategory
      });
    }
  };

  if (loading) {
    return (
      <div className="card mb-3">
        <div className="card-header fw-bold text-uppercase">
          Categories
        </div>
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3 accordion">
      <div
        className="card-header fw-bold text-uppercase accordion-icon-button"
        data-bs-toggle="collapse"
        data-bs-target="#filterCategory"
        aria-expanded="true"
        aria-controls="filterCategory"
      >
        Categories
      </div>
      <ul
        className="list-group list-group-flush show"
        id="filterCategory"
      >
        {categories.map((category) => (
          <li key={category.id} className="list-group-item">
            <button
              className={`btn btn-link text-decoration-none stretched-link w-100 text-start ${
                selectedCategory === category.id ? 'text-primary fw-bold' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="list-group-item text-muted">
            No categories available
          </li>
        )}
      </ul>
    </div>
  );
};

export default FilterCategory;
