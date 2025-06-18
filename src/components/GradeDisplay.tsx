
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star } from "lucide-react";
import { useGrades } from "@/hooks/useGrades";

const GradeDisplay = () => {
  const { userProfile, currentGrade } = useGrades();

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  // Use current grade if available, fallback to profile grade
  const displayGrade = currentGrade?.grade || userProfile?.overall_grade;
  const hasGrade = displayGrade !== null && displayGrade !== undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Your Grade
        </CardTitle>
        <CardDescription>Overall course performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasGrade ? (
            <div className="text-center">
              <div className={`text-4xl font-bold ${getGradeColor(displayGrade)}`}>
                {displayGrade.toFixed(1)}%
              </div>
              <div className="text-lg text-gray-600">
                Grade: {getGradeLetter(displayGrade)}
              </div>
              {currentGrade?.completedModules && (
                <div className="text-sm text-gray-500 mt-2">
                  Based on {currentGrade.completedModules} completed module{currentGrade.completedModules !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Complete a module test to see your grade
            </div>
          )}

          {userProfile?.certificate_earned && (
            <div className="flex items-center justify-center gap-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-800">Certificate Earned!</div>
                <div className="text-sm text-yellow-600">
                  Issued on {new Date(userProfile.certificate_issued_at!).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Maintain 80% or higher in all modules to earn your certificate
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeDisplay;
