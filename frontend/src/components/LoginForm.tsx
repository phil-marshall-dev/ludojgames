
import { Form, useActionData } from "react-router-dom";
interface RegisterActionData {
  error?: string;
}

const LoginForm = () => {
  const actionData = useActionData() as RegisterActionData;

  return (
    <Form method="post">
      <div className="mb-3">
        <label htmlFor="formBasicUsername" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="formBasicUsername"
          name="username"
          placeholder="Username"

        />
      </div>
      <div className="mb-3">
        <label htmlFor="formBasicPassword" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="formBasicPassword"
          name="password"
          placeholder="Password"
        />
      </div>
      {actionData && actionData.error && (
        <div className="alert alert-danger" role="alert">
          {actionData.error}
        </div>
      )}
      <button type="submit" className="btn btn-primary" name="intent" value="login">
        Login
      </button>
    </Form>
  );
};

export default LoginForm;
