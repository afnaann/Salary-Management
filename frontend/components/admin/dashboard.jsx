"use client";
import Layout from "@/components/Layout";
import useAxios from "@/utils/axios/interceptor";
import { ArrowUp, Users, DollarSign, Briefcase, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const api = useAxios();
  const [salaryData, setSalaryData] = useState([]);
  const [overviewData, setOverviewData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    averageSalary: 0,
    departments: 0,
  });

  const fetchData = async () => {
    const res = await api.get("/api/salary-stats/");
    setSalaryData(res.data.salary_overview);
    setDashboardStats({
      totalEmployees: res.data.total_employees,
      averageSalary: res.data.average_salary,
      departments: res.data.departments,
    });
    setOverviewData({
      labels: res.data.salary_overview.map(
        (item) => `${item.year}-${item.month}`
      ),
      datasets: [
        {
          label: "Total Salary Paid",
          data: res.data.salary_overview.map((item) => item.total_salary_paid),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
        },
      ],
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Employees */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Employees
            </h3>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardStats.totalEmployees}
          </p>

        </div>

        {/* Average Salary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Average Salary
            </h3>
            <DollarSign className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${dashboardStats.averageSalary}
          </p>

        </div>

        {/* Total Departments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Departments</h3>
            <Briefcase className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardStats.departments}
          </p>

        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Salary Overview
        </h3>
        {overviewData && (
          <Line
            data={overviewData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Salary Overview (Total Paid Salary)",
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return `$${value}`;
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
