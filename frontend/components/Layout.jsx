"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  CreditCard,
  LayoutDashboard,
  History,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import MainContext from "@/utils/context/MainContext";

const Layout = () => {
  const { user, logout } = useContext(MainContext);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const NavLink = ({ href, icon: Icon, children }) => (
    <Link href={href}>
      <span className="group flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg">
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Mobile Menu Button */}
          {user?.is_staff ? (
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  Salary Management
                </span>
              </Link>
              <button
                className="sm:hidden ml-4 text-gray-600 hover:text-indigo-600 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/employee-dashboard" className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  Salary Management
                </span>
              </Link>
              <button
                className="sm:hidden ml-4 text-gray-600 hover:text-indigo-600 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {user?.is_staff ? (
              <>
                <NavLink href="/employees" icon={Users}>
                  Employees
                </NavLink>
                <NavLink href="/employee-salary" icon={CreditCard}>
                  Salary History
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href="/employee-dashboard" icon={LayoutDashboard}>
                  Employee Profile
                </NavLink>
                <NavLink href="/employee-salary-history" icon={History}>
                  Salary History
                </NavLink>
              </>
            )}
          </div>

          {/* Logout Button */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 space-y-2 pb-4">
            {user?.is_staff ? (
              <>
                <NavLink href="/employees" icon={Users}>
                  Employees
                </NavLink>
                <NavLink href="/employee-salary" icon={CreditCard}>
                  Salary History
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href="/employee-dashboard" icon={LayoutDashboard}>
                  Dashboard
                </NavLink>
                <NavLink href="/employee-salary-history" icon={History}>
                  Salary History
                </NavLink>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full justify-center hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Layout;
