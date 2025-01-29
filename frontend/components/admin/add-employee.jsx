"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Badge,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  Scan,
} from "lucide-react";
import useAxios from "@/utils/axios/interceptor";

const validationSchema = Yup.object({
  username: Yup.string()
    .matches(/^\S*$/, "Username must not contain spaces")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  employee_id: Yup.string().required("Employee ID is required"),
  department: Yup.string().required("Department is required"),
  position: Yup.string().required("Position is required"),
  date_joined: Yup.date().required("Date joined is required"),
  base_salary: Yup.number()
    .required("Base Salary is required")
    .typeError("Salary Should be a number"),
  upi_id: Yup.string().required("UPI ID is required"),
});

export default function AddEmployee() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const api = useAxios();

  const handleSubmit = async (values) => {
    try {
      const data = {
        user: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
        employee_id: values.employee_id,
        designation: values.position,
        department: values.department,
        date_of_joining: values.date_joined,
        basic_salary: values.base_salary,
        upi_id: values.upi_id,
        is_active: true,
      };

      const response = await api.post("/api/employees/", data);

      if (response.status === 201) {
        toast.success("Added Employee Successfully!");
        router.push("/employees");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        "There was an error while submitting the form. Please try again."
      );
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Add New Employee
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>{error}</strong>
        </div>
      )}
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          employee_id: "",
          department: "",
          position: "",
          date_joined: "",
          base_salary: "",
          upi_id: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              <User className="inline-block mr-2 h-5 w-5" /> Username
            </label>
            <Field
              type="text"
              name="username"
              id="username"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              <Mail className="inline-block mr-2 h-5 w-5" /> Email
            </label>
            <Field
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              <Lock className="inline-block mr-2 h-5 w-5" /> Password
            </label>
            <Field
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="employee_id"
              className="block text-sm font-medium text-gray-700"
            >
              <Badge className="inline-block mr-2 h-5 w-5" /> Employee ID
            </label>
            <Field
              type="text"
              name="employee_id"
              id="employee_id"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="employee_id"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              <Building className="inline-block mr-2 h-5 w-5" /> Department
            </label>
            <Field
              type="text"
              name="department"
              id="department"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="department"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              <Briefcase className="inline-block mr-2 h-5 w-5" /> Position
            </label>
            <Field
              type="text"
              name="position"
              id="position"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="position"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="date_joined"
              className="block text-sm font-medium text-gray-700"
            >
              <Calendar className="inline-block mr-2 h-5 w-5" /> Date Joined
            </label>
            <Field
              type="date"
              name="date_joined"
              id="date_joined"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="date_joined"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="base_salary"
              className="block text-sm font-medium text-gray-700"
            >
              <DollarSign className="inline-block mr-2 h-5 w-5" /> Base Salary
            </label>
            <Field
              type="text"
              name="base_salary"
              id="base_salary"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="base_salary"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="space-y-2">
            <label
              htmlFor="upi_id"
              className="block text-sm font-medium text-gray-700"
            >
              <Scan className="inline-block mr-2 h-5 w-5" /> UPI ID
            </label>
            <Field
              type="text"
              name="upi_id"
              id="upi_id"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <ErrorMessage
              name="upi_id"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Employee
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
