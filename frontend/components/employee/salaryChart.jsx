import React from "react";
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

const SalaryChart = ({ salaryHistory, getMonthName }) => {
  const reversedSalaryHistory = [...salaryHistory].reverse(); // Reverse the salaryHistory array

  const data = {
    labels: reversedSalaryHistory?.map(
      (salary) => `${getMonthName(salary.month)} ${salary.year}`
    ),
    datasets: [
      {
        label: "Net Salary",
        data: reversedSalaryHistory?.map((salary) => salary.net_salary),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Allowances",
        data: reversedSalaryHistory?.map((salary) => salary.allowances),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
      {
        label: "Deductions",
        data: reversedSalaryHistory?.map((salary) => salary.deductions),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Salary History Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month/Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SalaryChart;
