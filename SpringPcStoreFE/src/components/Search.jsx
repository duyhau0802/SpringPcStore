import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSearch} className="search">
      <div className="input-group">
        <input
          id="search"
          name="search"
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleInputChange}
          aria-label="Search products"
        />
        <label className="visually-hidden" htmlFor="search">Search</label>
        <button
          className="btn btn-primary text-white"
          type="submit"
          aria-label="Search"
        >
          <i className="bi bi-search"></i>
        </button>
      </div>
    </form>
  );
};

export default Search;
