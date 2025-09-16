import NavBar from "@/components/NavBar";

export default function DashboardPage() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <h1 className="text-4xl text-white">Dashboard Page</h1>
      </div>
    </>
  );
}