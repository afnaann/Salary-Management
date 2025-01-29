'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center">

        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome to Salary Management
        </h1>
        <p className="text-gray-600 mt-2 mb-6">
          Manage salaries efficiently and effortlessly.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 text-lg rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
