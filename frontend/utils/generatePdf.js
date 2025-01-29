import { jsPDF } from "jspdf"
import "jspdf-autotable"

export const generateSalarySlipPDF = (salary, username) => {
  const doc = new jsPDF()
  console.log(salary)
  doc.setFontSize(20)
  doc.text("MY COMPANY", 105, 20, { align: "center" })
  doc.setFontSize(10)
  doc.text("Calicut, Kerala, India", 105, 30, { align: "center" })

  // Add salary slip title
  doc.setFontSize(16)
  doc.text("Salary Slip", 105, 45, { align: "center" })

  // Add employee details
  doc.setFontSize(12)
  doc.text(`Employee ID: ${salary.employee.employee_id}`, 20, 60)
  doc.text(`Name: ${username}`, 20, 70)
  doc.text(`Department: ${salary.employee.department}`, 20, 80)
  doc.text(`Position: ${salary.employee.designation}`, 20, 90)

  const monthNames = [
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
  ]
  doc.text(`Pay Period: ${monthNames[salary.month - 1]} ${salary.year}`, 20, 110)
  doc.text(`Pay Date: ${salary.pay_date}`, 20, 120)

  const tableData = [
    ["Description", "Amount"],
    ["Allowances", `$${Number.parseFloat(salary.allowances).toFixed(2)}`],
    ["Deductions", `$${Number.parseFloat(salary.deductions).toFixed(2)}`],
    ["Net Salary", `$${Number.parseFloat(salary.net_salary).toFixed(2)}`],
  ]

  doc.autoTable({
    startY: 130,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: "grid",
    headStyles: { fillColor: [100, 100, 100] },
  })

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text("This is a computer-generated document. No signature is required.", 105, 290, { align: "center" })
    doc.text(`Page ${i} of ${pageCount}`, 105, 295, { align: "center" })
  }

  return doc
}

