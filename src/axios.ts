import axios from 'axios';

const baseURL = `${import.meta.env.VITE_SERVER_URL}`;

const instance = axios.create({
  baseURL,
});

export default instance;
