'use client'

import { useContext, useEffect, useState } from "react"
import MainContext from "@/utils/context/MainContext"
import axios from "axios"
import useAxios from "@/utils/axios/interceptor"

export default function EmployeeDashboard() {
  const { user } = useContext(MainContext)
  const [employee, setEmployee] = useState(null)
  const api = useAxios()
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(
          `/api/employees/${user.user_id}/`
        )
        setEmployee(response.data)
      } catch (error) {
        console.error("Error fetching employee:", error)
      }
    }

    if (user) {
      fetchEmployee()
    }
  }, [user])

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  const employeeDetails = [
    { label: "Employee ID", value: employee.employee_id },
    { label: "Name", value: employee.user.username },
    { label: "Email", value: employee.user.email },
    { label: "Department", value: employee.department },
    { label: "Position", value: employee.designation },
    { label: "Date Joined", value: employee.date_of_joining }
  ]

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
          </div>
          
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employeeDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                >
                  <p className="text-sm text-gray-500 mb-1">{detail.label}</p>
                  <p className="text-gray-900 font-medium">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}