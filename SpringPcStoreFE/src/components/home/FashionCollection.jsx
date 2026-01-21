import React from 'react';
import { Link } from 'react-router-dom';

const FashionCollection = () => {
  const categories = [
    {
      name: "Men's Clothing",
      image: "../../images/category/male.webp",
      to: "/"
    },
    {
      name: "Women's Clothing", 
      image: "../../images/category/female.webp",
      to: "/"
    },
    {
      name: "Smartwatch",
      image: "../../images/category/smartwatch.webp", 
      to: "/"
    },
    {
      name: "Footwear",
      image: "../../images/category/footwear.webp",
      to: "/"
    }
  ];

  return (
    <>
      <div className="bg-info bg-gradient p-3 text-center mb-3">
        <h4 className="m-0">Explore Fashion Collection</h4>
      </div>
      <div className="container">
        <div className="row">
          {categories.map((category, index) => (
            <div key={index} className="col-md-3">
              <Link to={category.to} className="text-decoration-none">
                <img
                  src={category.image}
                  className="img-fluid rounded-circle"
                  alt={category.name}
                />
                <div className="text-center h6">{category.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FashionCollection;
