import React from 'react';
import { Form } from 'react-router-dom';

const FormPage = () => {
  return (
    <div>
      <h1>Submit Your Information</h1>
      <Form method="post">
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default FormPage;