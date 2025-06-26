
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useCourseData } from "@/hooks/useCourseData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTests } from "@/hooks/useTests";

interface GradeDetailTableProps {
  isOpen: boolean;
  onClose: () => void;
}

const GradeDetailTable = ({ isOpen, onClose }: GradeDetailTableProps) => {
  const { modules } = useCourseData();
  const { progress } = useUserProgress();
  const { tests, attempts } = useTests();

  // Create a map of module progress data
  const moduleProgressMap = new Map();
  if (progress) {
    progress.forEach(p => {
      if (p.module_id) {
        const existing = moduleProgressMap.get(p.module_id);
        if (!existing || (p.test_score !== null && existing.test_score === null)) {
          moduleProgressMap.set(p.module_id, p);
        }
      }
    });
  }

  // Create a map of test attempts by module
  const testAttemptsMap = new Map();
  if (attempts && tests) {
    attempts.forEach(attempt => {
      const test = tests.find(t => t.id === attempt.test_id);
      if (test) {
        testAttemptsMap.set(test.module_id, attempt);
      }
    });
  }

  const getStatusBadge = (moduleId: number) => {
    const moduleProgress = moduleProgressMap.get(moduleId);
    const testAttempt = testAttemptsMap.get(moduleId);
    
    if (moduleProgress?.test_score !== null && moduleProgress?.test_score !== undefined) {
      const passed = testAttempt?.passed || moduleProgress.test_score >= 80;
      return passed ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Passed
        </Badge>
      ) : (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Not Started
      </Badge>
    );
  };

  const getGradeDisplay = (moduleId: number) => {
    const moduleProgress = moduleProgressMap.get(moduleId);
    if (moduleProgress?.test_score !== null && moduleProgress?.test_score !== undefined) {
      return `${moduleProgress.test_score}%`;
    }
    return "N/A";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detailed Grade Report</DialogTitle>
          <DialogDescription>
            Your test performance for each module
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules?.map((module) => {
                const moduleProgress = moduleProgressMap.get(module.id);
                const testAttempt = testAttemptsMap.get(module.id);
                
                return (
                  <TableRow key={module.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{module.title}</div>
                        <div className="text-sm text-gray-500">Module {module.order}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getGradeDisplay(module.id)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(module.id)}
                    </TableCell>
                    <TableCell>
                      {testAttempt?.completed_at 
                        ? new Date(testAttempt.completed_at).toLocaleDateString()
                        : "N/A"
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeDetailTable;
