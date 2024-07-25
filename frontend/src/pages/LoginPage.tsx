import { MouseEventHandler, useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { Col, Row } from "react-bootstrap";

const LoginPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const form = showLogin ? <LoginForm /> : <RegisterForm />;
  const switchText = showLogin
    ? "New to our site?"
    : "Already have an account?";
  const switchLinkText = showLogin ? "Register an account" : "Login";
  const switchLinkAction: MouseEventHandler<HTMLAnchorElement> = showLogin
    ? (e) => {
      e.preventDefault();
      setShowLogin(false);
      return false;
    }
    : (e) => {
      e.preventDefault();
      setShowLogin(true);
      return false;
    }

  return (<Row className="justify-content-md-center mt-3">
  <Col md={6} xs={12}>
    <div className="container">
      {form}
      <p className="mt-3">
        {switchText}{" "}
        <a href="#" onClick={switchLinkAction}>
          {switchLinkText}
        </a>
      </p>
    </div></Col>
    </Row>
  );
};

export default LoginPage;
