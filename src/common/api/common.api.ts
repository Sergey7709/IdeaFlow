import axios from "axios";

const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "b333b582-9a3b-4255-a036-8f36df44f2db",
  },
};
export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings,
});
