import React, { Suspense } from 'react';
import { CardDealsOfTheDay } from '../card/CardDealsOfTheDay';
import { Carousel } from '../carousel/Carousel';
import ProductCarousel from './ProductCarousel';

const DealsSection = ({ iconProducts, components }) => {
  return (
    <div className="container-fluid bg-light mb-3">
      <div className="row">
        <div className="col-md-12">
          <Suspense fallback={<div>Loading Deals...</div>}>
            <CardDealsOfTheDay
              endDate={Date.now() + 1000 * 60 * 60 * 14}
              title="Deals of the Day"
              to="/"
            >
              <Carousel id="elect-product-category1">
                <ProductCarousel iconProducts={iconProducts} components={components} />
              </Carousel>
            </CardDealsOfTheDay>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DealsSection;
