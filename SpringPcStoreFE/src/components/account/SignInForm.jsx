import React from "react";
import { Field, reduxForm } from "redux-form";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../redux/actions/authActions";
import renderFormGroupField from "../../helpers/renderFormGroupField";
import {
  required,
  maxLength20,
  minLength8,
} from "../../helpers/validation";
import { ReactComponent as IconEnvelope } from "bootstrap-icons/icons/envelope.svg";
import { ReactComponent as IconShieldLock } from "bootstrap-icons/icons/shield-lock.svg";

const SignInForm = ({ handleSubmit, submitting, onSubmit, submitFailed, login, auth }) => {
  const handleFormSubmit = async (values) => {
    console.log('Submitting login with values:', values);
    
    const loginData = {
      usernameOrEmail: values.email, // Send email as usernameOrEmail
      password: values.password,
    };
    
    console.log('Login data being sent:', loginData);
    
    const result = await login(loginData);
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, redirecting...');
      window.location.href = '/';
    } else {
      console.error('Login failed:', result.error);
      alert(result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`needs-validation ${submitFailed ? "was-validated" : ""}`}
      noValidate
    >
      <Field
        name="email"
        type="text"
        label="Email or Username"
        component={renderFormGroupField}
        placeholder="Enter your email or username"
        icon={IconEnvelope}
        validate={[required]}
        required={true}
        className="mb-3"
      />
      <Field
        name="password"
        type="password"
        label="Your password"
        component={renderFormGroupField}
        placeholder="******"
        icon={IconShieldLock}
        validate={[required, maxLength20, minLength8]}
        required={true}
        maxLength="20"
        minLength="8"
        className="mb-3"
      />
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary mb-3"
          disabled={submitting || auth.loading}
        >
          {auth.loading ? 'Signing In...' : 'Log In'}
        </button>
      </div>
      <Link className="float-start" to="/account/signup" title="Sign Up">
        Create your account
      </Link>
      <Link
        className="float-end"
        to="/account/forgotpassword"
        title="Forgot Password"
      >
        Forgot password?
      </Link>
      <div className="clearfix"></div>
      <hr></hr>
      <div className="row">
        <div className="col- text-center">
          <p className="text-muted small">Or you can join with</p>
        </div>
        <div className="col- text-center">
          <Link to="/" className="btn btn-light text-white bg-twitter me-3">
            <i className="bi bi-twitter-x" />
          </Link>
          <Link to="/" className="btn btn-light text-white me-3 bg-facebook">
            <i className="bi bi-facebook mx-1" />
          </Link>
          <Link to="/" className="btn btn-light text-white me-3 bg-google">
            <i className="bi bi-google mx-1" />
          </Link>
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { login }),
  reduxForm({
    form: "signin",
  })
)(SignInForm);
