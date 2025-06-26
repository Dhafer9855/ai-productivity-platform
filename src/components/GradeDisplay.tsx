
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, ExternalLink } from "lucide-react";
import { useGrades } from "@/hooks/useGrades";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useState } from "react";
import GradeDetailTable from "./GradeDetailTable";

const GradeDisplay = () => {
  const { userProfile, currentGrade } = useGrades();
  const { progress } = useUserProgress();
  const [showDetailTable, setShowDetailTable] = useState(false);

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

  // Count modules with test scores from progress data
  const modulesWithTestScores = new Set();
  if (progress) {
    progress.forEach(p => {
      if (p.test_score !== null && p.test_score !== undefined && p.module_id) {
        modulesWithTestScores.add(p.module_id);
      }
    });
  }
  const completedTestsCount = modulesWithTestScores.size;

  // Use current grade if available, fallback to profile grade
  const displayGrade = currentGrade?.grade || userProfile?.overall_grade;
  const hasGrade = displayGrade !== null && displayGrade !== undefined;

  return (
    <>
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
                <div className="text-sm text-gray-500 mt-2">
                  Based on {completedTestsCount} completed test{completedTestsCount !== 1 ? 's' : ''}
                </div>
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

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowDetailTable(true)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Detailed Grades
            </Button>

            <div className="text-xs text-gray-500 text-center">
              Maintain 80% or higher in all modules to earn your certificate
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetailTable && (
        <GradeDetailTable 
          isOpen={showDetailTable} 
          onClose={() => setShowDetailTable(false)} 
        />
      )}
    </>
  );
};

export default GradeDisplay;
