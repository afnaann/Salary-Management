"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { backendUrl } from "@/utils/axios/urls";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import MainContext from "@/utils/context/MainContext";

export default function Login() {
  const { setUser, setAuthTokens } = useContext(MainContext);
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${backendUrl}/api/token/`, values);

        const token = response.data;
        localStorage.setItem("authTokens", JSON.stringify(token));
        setAuthTokens(token);
        const user = jwtDecode(token.access);
        setUser(user);
        if (user.is_staff) {
          router.push("/dashboard");
        } else {
          router.push("/employee-dashboard");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setServerError(
              error.response.data.detail || "Login failed. Please try again."
            );
          } else {
            setServerError("Something went wrong. Please try again later.");
          }
        } else {
          setServerError(
            "An unexpected error occurred. Please try again later."
          );
        }
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-t from-indigo-100 to-indigo-200 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-black">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          Sign in
        </h2>

        {serverError && (
          <div className="text-red-500 text-sm mb-4">{serverError}</div>
        )}

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`w-full px-3 py-2 border ${
                formik.errors.username && formik.touched.username
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
              placeholder="Enter your username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.errors.username && formik.touched.username ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.username}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`w-full px-3 py-2 border ${
                formik.errors.password && formik.touched.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-md text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
