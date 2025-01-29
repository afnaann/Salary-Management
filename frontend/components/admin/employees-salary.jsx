"use client";
import useAxios from "@/utils/axios/interceptor";
import { SalaryForm } from "./salaryForm";
import { SalaryTable } from "./salaryTable";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EmployeeSalary = () => {
  const api = useAxios();
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newSalary, setNewSalary] = useState({
    employee: "",
    month: "",
    year: "",
    allowances: "",
    deductions: "",
  });

  const [selectedBasicSalary, setSelectedBasicSalary] = useState("");
  const [netSalaryPreview, setNetSalaryPreview] = useState("");

  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];
  const fetchData = async () => {
    try {
      const [salariesRes, employeesRes] = await Promise.all([
        api.get("/api/salaries/"),
        api.get("/api/employees/"),
      ]);
      setSalaries(salariesRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateNetSalaryPreview = (name, value) => {
    const basic = parseFloat(selectedBasicSalary) || 0;
    const allowances =
      name === "allowances"
        ? parseFloat(value)
        : parseFloat(newSalary.allowances) || 0;
    const deductions =
      name === "deductions"
        ? parseFloat(value)
        : parseFloat(newSalary.deductions) || 0;
    setNetSalaryPreview((basic + allowances - deductions).toFixed(2));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSalary({ ...newSalary, [name]: value });
    updateNetSalaryPreview(name, value);
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    const selectedEmployee = employees.find((emp) => emp.id == employeeId);

    if (selectedEmployee) {
      setNewSalary({
        ...newSalary,
        employee: employeeId,
      });
      const basicSalary = selectedEmployee.basic_salary || "0.00";
      setSelectedBasicSalary(basicSalary);
      updateNetSalaryPreview("basic_salary", basicSalary);
    } else {
      setSelectedBasicSalary("");
      setNetSalaryPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript

    // Get the selected year and month
    const selectedYear = parseInt(newSalary.year);
    const selectedMonth = parseInt(newSalary.month);

    // Find the selected employee
    const selectedEmployee = employees.find(
      (emp) => emp.id == newSalary.employee
    );

    if (!selectedEmployee) {
      toast.error("Please select a valid employee.");
      return;
    }

    // Get the employee's date of joining
    const dateOfJoining = new Date(selectedEmployee.date_of_joining);
    const joiningYear = dateOfJoining.getFullYear();
    const joiningMonth = dateOfJoining.getMonth() + 1;

    // Validate if the selected year and month are in the future
    if (
      selectedYear > currentYear ||
      (selectedYear === currentYear && selectedMonth > currentMonth)
    ) {
      toast.error("Salary date cannot be in the future.");
      return;
    }

    // Validate if the selected year and month are before the date of joining
    if (
      selectedYear < joiningYear ||
      (selectedYear === joiningYear && selectedMonth < joiningMonth)
    ) {
      toast.error(
        "Salary date cannot be before the employee's date of joining."
      );
      return;
    }

    // Proceed with the salary submission
    const formattedSalary = {
      ...newSalary,
      allowances: parseFloat(newSalary.allowances) || 0,
      deductions: parseFloat(newSalary.deductions) || 0,
      month: selectedMonth,
      year: selectedYear,
    };

    try {
      const response = await api.post("/api/salaries/", formattedSalary);
      fetchData();
      toast.success("Successfully Added Salary");
      setNewSalary({
        employee: "",
        month: "",
        year: "",
        allowances: "",
        deductions: "",
      });
      setSelectedBasicSalary("");
      setNetSalaryPreview("");
    } catch (error) {
      console.error("Error adding salary:", error);
      toast.error(
        error?.response?.data?.non_field_errors[0] ||
          "Something went wrong! Try Again"
      );
    }
  };
  return (
    <div className="bg-white shadow rounded-lg p-6 text-black">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Employee Salary
      </h1>
      <SalaryForm
        newSalary={newSalary}
        employees={employees}
        months={months}
        basicSalary={selectedBasicSalary}
        netSalaryPreview={netSalaryPreview}
        handleInputChange={handleInputChange}
        handleEmployeeChange={handleEmployeeChange}
        handleSubmit={handleSubmit}
      />
      <SalaryTable salaries={salaries} months={months} />
    </div>
  );
};

export default EmployeeSalary;
