import React from 'react';
import { CardIcon } from '../card/CardIcon';

const ProductCarousel = ({ iconProducts, components }) => {
  const rows = [...Array(Math.ceil(iconProducts.length / 4))];
  const productRows = rows.map((row, idx) =>
    iconProducts.slice(idx * 4, idx * 4 + 4)
  );

  return productRows.map((row, idx) => (
    <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
      <div className="row g-3">
        {row.map((product, productIdx) => {
          const ProductImage = components[product.img];
          return (
            <div key={productIdx} className="col-md-3">
              <CardIcon
                title={product.title}
                text={product.text}
                tips={product.tips}
                to={product.to}
              >
                <ProductImage className={product.cssClass} width="80" height="80" />
              </CardIcon>
            </div>
          );
        })}
      </div>
    </div>
  ));
};

export default ProductCarousel;
