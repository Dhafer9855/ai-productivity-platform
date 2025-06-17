
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { useAssignments } from "@/hooks/useAssignments";

interface Assignment {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  max_score: number | null;
}

interface AssignmentCardProps {
  assignment: Assignment;
  submission?: any;
}

const AssignmentCard = ({ assignment, submission }: AssignmentCardProps) => {
  const [submissionText, setSubmissionText] = useState(submission?.submission_text || '');
  const [submissionUrl, setSubmissionUrl] = useState(submission?.submission_url || '');
  const { submitAssignment } = useAssignments();

  const handleSubmit = () => {
    submitAssignment({
      assignmentId: assignment.id,
      submissionText,
      submissionUrl,
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {assignment.title}
            </CardTitle>
            <CardDescription>{assignment.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {submission && (
              <Badge variant={submission.score ? "default" : "secondary"}>
                {submission.score ? `Score: ${submission.score}/${assignment.max_score}` : submission.status}
              </Badge>
            )}
            {assignment.due_date && (
              <Badge variant={isOverdue ? "destructive" : "outline"}>
                <Calendar className="h-3 w-3 mr-1" />
                Due: {formatDate(assignment.due_date)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Submission Text</label>
          <Textarea
            placeholder="Enter your assignment submission..."
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Submission URL (optional)</label>
          <Input
            placeholder="https://..."
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={!submissionText.trim()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {submission ? 'Update Submission' : 'Submit Assignment'}
        </Button>

        {submission?.feedback && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">Instructor Feedback:</h4>
            <p className="text-sm text-gray-700">{submission.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
