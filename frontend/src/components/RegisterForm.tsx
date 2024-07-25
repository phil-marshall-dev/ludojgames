
'use client';

import { useState } from 'react';
import { useFormInput } from '../hooks';
import { IRegisterCredentials } from '../types';
import { Form, useActionData } from 'react-router-dom';

interface RegisterActionData {
  error?: string;
}

const RegisterForm = () => {
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
        <label htmlFor="formBasicEmail" className="form-label">
          Email address (optional)
        </label>
        <input
          type="email"
          className="form-control"
          id="formBasicEmail"
          name="email"
          placeholder="Email address (optional)"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="formBasicPassword1" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="formBasicPassword1"
          name="password1"
          placeholder="Password"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="formBasicPassword2" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          className="form-control"
          id="formBasicPassword2"
          name="password2"
          placeholder="Confirm Password"
        />
      </div>
      {actionData && actionData.error && (
        <div className="alert alert-danger" role="alert">
          {actionData.error}
        </div>
      )}
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </Form>
  );
};

export default RegisterForm;
