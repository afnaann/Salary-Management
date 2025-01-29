"use client";
import axios from "axios";
import dayjs from "dayjs";
import { backendUrl } from "./urls";
import MainContext from "../context/MainContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const baseURL = backendUrl;

const useAxios = () => {
  const { setAuthTokens, setUser } = useContext(MainContext);
  const router = useRouter();

  const authAxios = axios.create({
    baseURL,
    headers:
      typeof window !== "undefined" && localStorage.getItem("authTokens")
        ? {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("authTokens")).access
            }`,
          }
        : {},
  });

  authAxios.interceptors.request.use(
    async (req) => {

      const storedAuthTokens = localStorage.getItem("authTokens");
      if (!storedAuthTokens) {
        router.push("/login");
        return req;
      }

      const authTokens = JSON.parse(storedAuthTokens);
      const user = jwtDecode(authTokens.access);

      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) {
        req.headers.Authorization = `Bearer ${authTokens.access}`;
        return req;
      }

      if (!authTokens.refresh) {
        router.push("/login");
        return Promise.reject(new Error("No refresh token available."));
      }

      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: authTokens.refresh,
        });

        const newAuthTokens = response.data;
        localStorage.setItem("authTokens", JSON.stringify(newAuthTokens));

        setAuthTokens(newAuthTokens);
        setUser(jwtDecode(newAuthTokens.access));

        req.headers.Authorization = `Bearer ${newAuthTokens.access}`;
        return req;
      } catch (error) {
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
        setUser(null);
        router.push("/login");
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error)
  );

  return authAxios;
};

export default useAxios;
