import React, { Suspense } from 'react';
import { Carousel } from '../carousel/Carousel';
import { Support } from '../Support';
import { CardLogin } from '../card/CardLogin';
import { CardImage } from '../card/CardImage';
import ProductCarousel from './ProductCarousel';

const MainContent = ({ iconProducts, components }) => {
  return (
    <div className="container-fluid bg-light mb-3">
      <div className="row g-3">
        <div className="col-md-9">
          <Carousel id="elect-product-category" className="mb-3">
            <ProductCarousel iconProducts={iconProducts} components={components} />
          </Carousel>
          <Suspense fallback={<div>Loading Support...</div>}>
            <Support />
          </Suspense>
        </div>
        <div className="col-md-3">
          <Suspense fallback={<div>Loading Login...</div>}>
            <CardLogin className="mb-3" />
          </Suspense>
          <Suspense fallback={<div>Loading Banner...</div>}>
            <CardImage src="../../images/banner/Watches.webp" to="promo" />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
