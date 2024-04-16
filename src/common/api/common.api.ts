import axios from "axios";

const settings = {
  withCredentials: true,
  headers: {
   "API-KEY": process.env.REACT_APP_API_KEY,
  },
};
export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  ...settings,
});
