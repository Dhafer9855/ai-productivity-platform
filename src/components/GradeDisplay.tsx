
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, ExternalLink, CheckCircle } from "lucide-react";
import { useGrades } from "@/hooks/useGrades";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTests } from "@/hooks/useTests";
import { useCourseData } from "@/hooks/useCourseData";
import { useState } from "react";
import GradeDetailTable from "./GradeDetailTable";

const GradeDisplay = () => {
  const { userProfile, currentGrade } = useGrades();
  const { progress } = useUserProgress();
  const { attempts, tests } = useTests();
  const { modules } = useCourseData();
  const [showDetailTable, setShowDetailTable] = useState(false);

  // Count passed tests by checking test attempts that are marked as passed
  // and cross-reference with actual test scores >= 80
  const passedTestsCount = (() => {
    if (!attempts || !tests || !progress) return 0;
    
    let count = 0;
    const moduleTestMap = new Map();
    
    // Create a map of module_id to test attempts
    if (tests) {
      tests.forEach(test => {
        const attempt = attempts.find(a => a.test_id === test.id);
        if (attempt && attempt.passed) {
          moduleTestMap.set(test.module_id, true);
        }
      });
    }
    
    // Also check progress data for test scores >= 80
    if (progress) {
      progress.forEach(p => {
        if (p.module_id && p.test_score !== null && p.test_score >= 80) {
          moduleTestMap.set(p.module_id, true);
        }
      });
    }
    
    return moduleTestMap.size;
  })();
  
  const totalModulesCount = modules?.length || 7;

  console.log('=== GRADE DISPLAY DEBUG ===');
  console.log('Attempts:', attempts);
  console.log('Tests:', tests);
  console.log('Progress with test scores:', progress?.filter(p => p.test_score !== null));
  console.log('Calculated passed tests:', passedTestsCount);

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
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="text-lg font-semibold text-gray-700">
                  Passed {passedTestsCount} of {totalModulesCount}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Module tests completed successfully
              </div>
            </div>

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
