import { json, redirect, ActionFunction } from 'react-router-dom';
import axios from 'axios';

const loginAction = async ({ request, formData }: {
  request: Request;
  formData: FormData;
}) => {
  console.log('login action begin')
  console.log('login action begin')

  const loginCredentials = {
    username: formData.get('username'),
    password: formData.get('password'),
  };
  console.log('posting2')

  try {
    console.log('posting3')
    const response = await axios.post('http://localhost:8000/auth/login/', loginCredentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log(response.data)
    if (response.status === 200) {
      console.log('this is running')

      return redirect('/');
    } else {
      console.log('this is running')
      return json({ error: 'Login failed' }, { status: 400 });
    }
  } catch (err) {
    console.log('second is running')
    return json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}

const registerAction = async ({ request, formData }: {
  request: Request;
  formData: FormData;
}) => {
  const registrationData = {
    username: formData.get('username'),
    password1: formData.get('password1'),
    password2: formData.get('password2'),
    email: formData.get('email'),
  };

  try {
    const response = await axios.post('http://localhost:8000/auth/register/', registrationData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    if (response.status === 201) {
      return redirect('/');
    } else {
      return json({ error: 'Registration failed' }, { status: 400 });
    }
  } catch (err) {
    return json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
  }
};

export const authAction: ActionFunction<any> = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === 'login') {
    return await loginAction({ request, formData })
  } else {
    return await registerAction({ request, formData })
  }
}

export const logoutAction = async () => {
  try {
    await axios.post('http://localhost:8000/auth/logout/', {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return { success: true, error: '' };
  } catch (error) {
    return { success: false, error: 'Logout failed' };
  }
};