import axios from 'axios';
import { IAxiosErrorResponse } from './types';
import { LoaderFunction } from 'react-router-dom';

const fetchWithErrorHandling = async (url: string) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (err) {
        const axiosError = err as IAxiosErrorResponse;
        console.error(axiosError.response?.data?.error || 'An error occurred. Please try again later.');
    }
};

export const sessionLoader: LoaderFunction = () => 
    fetchWithErrorHandling('http://localhost:8000/auth/session/');

export const gameLoader: LoaderFunction = ({ params }) => 
    fetchWithErrorHandling(`http://localhost:8000/api/games/${params.gameId}`);

export const profileLoader: LoaderFunction = ({ params }) => 
  fetchWithErrorHandling(`http://localhost:8000/api/profiles/${params.id}`);
