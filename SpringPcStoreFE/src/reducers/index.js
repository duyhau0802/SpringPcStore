import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "../redux/reducers/authReducer";
import productReducer from "../redux/reducers/productReducer";
import productDetailReducer from "../redux/reducers/productDetailReducer";

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  products: productReducer,
  productDetail: productDetailReducer,
});
