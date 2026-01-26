import { lazy } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "../../redux/actions/authActions";

const SingUpForm = lazy(() => import("../../components/account/SignUpForm"));

const SignUpView = ({ register }) => {
  const onSubmit = async (values) => {
    const userData = {
      username: values.username,
      email: values.email,
      password: values.password,
      fullName: `${values.firstName} ${values.lastName}`,
      phoneNumber: values.phoneNumber || '',
    };
    
    const result = await register(userData);
    if (result.success) {
      alert('Registration successful! Please sign in.');
      window.location.href = '/account/signin';
    } else {
      alert(result.error);
    }
  };
  return (
    <div className="container my-3">
      <div className="row border">
        <div className="col-md-6 bg-light bg-gradient p-3 d-none d-md-block">
          <Link to="/">
            <img
              src="../../images/banner/Dell.webp"
              alt="..."
              className="img-fluid"
            />
          </Link>
          <Link to="/">
            <img
              src="../../images/banner/Laptops.webp"
              alt="..."
              className="img-fluid"
            />
          </Link>
        </div>
        <div className="col-md-6 p-3">
          <h4 className="text-center">Sign Up</h4>
          <SingUpForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default connect(null, { register })(SignUpView);
