import React from "react";
import { SalaryFormFields } from "./salaryFormFields";

export const SalaryForm = ({
  newSalary,
  employees,
  months,
  basicSalary,
  netSalaryPreview,
  handleInputChange,
  handleEmployeeChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee
          </label>
          <select
            name="employee_id"
            value={newSalary.employee_id}
            onChange={handleEmployeeChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.employee_id} value={employee.id}>
                {employee.user?.username || employee.employee_id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Basic Salary
          </label>
          <input
            type="number"
            name="basic_salary"
            value={basicSalary}
            readOnly
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <SalaryFormFields
          newSalary={newSalary}
          months={months}
          handleInputChange={handleInputChange}
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-700">
          Total Salary Would Be:{" "}
          <span className="font-semibold">${netSalaryPreview}</span>
        </p>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Salary
      </button>
    </form>
  );
};
