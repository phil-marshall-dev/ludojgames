import axios from 'axios';
import { IAxiosErrorResponse } from './models';

export const sessionLoader = async () => {
    try {
        console.log('getting session')
        const response = await axios.get('http://localhost:8000/auth/session/', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });

        if (response.status === 200) {
          console.log(response.data)
          return response.data
      }
      } catch (err) {
        console.log(err)
        const axiosError = err as IAxiosErrorResponse;
  
        if (axiosError.response && axiosError.response.data) {
          console.log(axiosError.response.data.error || 'Session fetch failed');
        } else {
          console.log('An error occurred. Please try again later.');
        }
      }
  
};
