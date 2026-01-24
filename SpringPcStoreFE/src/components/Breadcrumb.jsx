import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = ({ categoryId, categoryName }) => {
  const location = useLocation();
  
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const urlParams = new URLSearchParams(location.search);
    const categoryIdParam = urlParams.get('categoryId');
    
    const items = [
      { name: 'Home', path: '/' }
    ];

    // Add category page
    if (location.pathname.includes('/category')) {
      items.push({ name: 'PC Components', path: '/category' });
      
      // Add filtered category if exists
      if (categoryIdParam || categoryId) {
        const activeCategoryId = categoryIdParam || categoryId;
        const activeCategoryName = categoryName || `Category ${activeCategoryId}`;
        items.push({ 
          name: activeCategoryName, 
          path: `/category?categoryId=${activeCategoryId}`,
          active: true 
        });
      } else {
        items.push({ name: 'All Products', path: location.pathname, active: true });
      }
    }
    // Add product detail page
    else if (location.pathname.includes('/product/detail')) {
      items.push({ name: 'PC Components', path: '/category' });
      items.push({ name: 'Product Details', path: location.pathname, active: true });
    }
    // Add cart page
    else if (location.pathname.includes('/cart')) {
      items.push({ name: 'Shopping Cart', path: location.pathname, active: true });
    }
    // Add account pages
    else if (location.pathname.includes('/account')) {
      items.push({ name: 'My Account', path: '/account' });
      const pageName = pathSegments[pathSegments.length - 1];
      items.push({ 
        name: pageName.charAt(0).toUpperCase() + pageName.slice(1), 
        path: location.pathname, 
        active: true 
      });
    }
    // Default for home
    else if (location.pathname === '/') {
      items.push({ name: 'PC Store', path: '/', active: true });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb rounded-0">
        {breadcrumbItems.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.active ? (
              item.name
            ) : (
              <Link to={item.path} title={item.name}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
