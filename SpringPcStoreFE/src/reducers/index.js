import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "../redux/reducers/authReducer";
import productReducer from "../redux/reducers/productReducer";
import productDetailReducer from "../redux/reducers/productDetailReducer";
import reviewReducer from "../redux/reducers/reviewReducer";

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  products: productReducer,
  productDetail: productDetailReducer,
  reviews: reviewReducer,
});
