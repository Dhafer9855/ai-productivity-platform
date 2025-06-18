
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import CourseContent from "@/components/CourseContent";
import ProjectStatus from "@/components/ProjectStatus";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}!
            </h1>
            <p className="text-gray-600">
              Continue your AI productivity journey. You're making great progress!
            </p>
          </div>

          <DashboardStats />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Course Progress</h2>
            <CourseContent />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Project</h2>
            <ProjectStatus />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
