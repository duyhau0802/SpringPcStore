import { Field, reduxForm } from "redux-form";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "../../redux/actions/authActions";
import renderFormGroupField from "../../helpers/renderFormGroupField";
import renderFormField from "../../helpers/renderFormField";
import {
  required,
  maxLength20,
  minLength8,
  maxLength50,
  minLength3,
  email,
  name,
} from "../../helpers/validation";
import { ReactComponent as IconEnvelope } from "bootstrap-icons/icons/envelope.svg";
import { ReactComponent as IconShieldLock } from "bootstrap-icons/icons/shield-lock.svg";

const SignUpForm = ({ handleSubmit, submitting, onSubmit, submitFailed, register, auth }) => {
  const handleFormSubmit = async (values) => {
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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`needs-validation ${submitFailed ? "was-validated" : ""}`}
      noValidate
    >
      <div className="row mb-3">
        <div className="col-md-6">
          <Field
            name="username"
            type="text"
            label="Username"
            component={renderFormField}
            placeholder="Username"
            validate={[required, minLength3, maxLength50]}
            required={true}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="email"
            type="email"
            label="Email"
            component={renderFormField}
            placeholder="Email"
            validate={[required, email]}
            required={true}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <Field
            name="firstName"
            type="text"
            label="First Name"
            component={renderFormField}
            placeholder="First Name"
            validate={[name]}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="lastName"
            type="text"
            label="Last Name"
            component={renderFormField}
            placeholder="Last Name"
            validate={[name]}
          />
        </div>
      </div>
      <Field
        name="phoneNumber"
        type="tel"
        label="Phone Number (Optional)"
        component={renderFormGroupField}
        placeholder="Phone number"
        icon={IconEnvelope}
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
          {auth.loading ? 'Creating Account...' : 'Create'}
        </button>
      </div>
      <Link className="float-start" to="/account/signin" title="Sign In">
        Sing In
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
  connect(mapStateToProps, { register }),
  reduxForm({
    form: "signup",
  })
)(SignUpForm);
