"use client";

import { useState, useEffect, useContext } from "react";
import { generateSalarySlipPDF } from "@/utils/generatePdf";
import MainContext from "@/utils/context/MainContext";
import useAxios from "@/utils/axios/interceptor";
import SalaryChart from "./salaryChart";

export default function EmployeeSalaryHistory() {
  const api = useAxios();
  const { user } = useContext(MainContext);
  const [salaryHistory, setSalaryHistory] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/salaries/${user.user_id}/`);
      setSalaryHistory(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDownloadPDF = (salary) => {
    const doc = generateSalarySlipPDF(salary, user.username);
    doc.save(`salary_slip_${salary.year}_${salary.month}.pdf`);
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1];
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Salary History
      </h1>

      {/* Wrapper div for horizontal scroll on smaller screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month/Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allowances
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deductions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salaryHistory.map((salary) => (
              <tr key={salary.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getMonthName(salary.month)} {salary.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {salary.pay_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${Number.parseFloat(salary.allowances).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${Number.parseFloat(salary.deductions).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${Number.parseFloat(salary.net_salary).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDownloadPDF(salary)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add the SalaryChart component here */}
      <div className="mt-8">
        <SalaryChart
          salaryHistory={salaryHistory}
          getMonthName={getMonthName}
        />
      </div>
    </div>
  );
}
