
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

  // Count passed tests - only count modules where tests are actually passed
  const passedTestsCount = (() => {
    if (!progress || !tests || !attempts) return 0;
    
    const passedModules = new Set();
    
    // Check each module's test status using the same logic as the detail table
    modules?.forEach(module => {
      // Create a map of module progress data (same as in GradeDetailTable)
      const moduleProgress = progress.find(p => p.module_id === module.id && p.test_score !== null);
      
      // Find test attempt for this module
      const test = tests.find(t => t.module_id === module.id);
      const testAttempt = test ? attempts.find(a => a.test_id === test.id) : null;
      
      // Check if test is passed (same logic as getStatusBadge in GradeDetailTable)
      if (moduleProgress?.test_score !== null && moduleProgress?.test_score !== undefined) {
        const passed = testAttempt?.passed || moduleProgress.test_score >= 80;
        if (passed) {
          passedModules.add(module.id);
        }
      }
    });
    
    return passedModules.size;
  })();
  
  const totalModulesCount = modules?.length || 7;

  console.log('=== GRADE DISPLAY DEBUG ===');
  console.log('Modules:', modules);
  console.log('Progress with test scores:', progress?.filter(p => p.test_score !== null));
  console.log('Test attempts:', attempts);
  console.log('Calculated passed tests (final):', passedTestsCount);

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
