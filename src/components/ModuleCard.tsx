
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, BookOpen } from "lucide-react";
import ProgressBar from "./ProgressBar";
import LessonItem from "./LessonItem";
import { useNavigate } from "react-router-dom";

interface Lesson {
  id: number;
  title: string;
  type: "video" | "text" | "quiz";
  duration?: string;
  completed?: boolean;
}

interface ModuleCardProps {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  estimatedTime: string;
  isLocked?: boolean;
}

const ModuleCard = ({ 
  moduleNumber, 
  title, 
  description, 
  lessons, 
  progress, 
  estimatedTime,
  isLocked = false 
}: ModuleCardProps) => {
  const navigate = useNavigate();
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  
  const handleCardClick = () => {
    if (!isLocked && lessons.length > 0) {
      // Navigate to the first lesson of this module
      navigate(`/lesson/${moduleNumber}/${lessons[0].id}`);
    }
  };

  const handleLessonClick = (lessonId: number) => {
    if (!isLocked) {
      navigate(`/lesson/${moduleNumber}/${lessonId}`);
    }
  };
  
  return (
    <Card className={`p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      isLocked ? "opacity-60" : "cursor-pointer"
    }`} onClick={handleCardClick}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                Module {moduleNumber}
              </div>
              {progress === 100 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              )}
              {isLocked && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  Locked
                </Badge>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
          
          <ChevronRight className={`h-5 w-5 text-gray-400 flex-shrink-0 ${
            isLocked ? "opacity-50" : ""
          }`} />
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {completedLessons} of {lessons.length} lessons completed
            </span>
            <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Meta info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{lessons.length} lessons</span>
          </div>
        </div>

        {/* Lessons Preview */}
        {!isLocked && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-900">Lessons:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {lessons.slice(0, 3).map((lesson) => (
                <div key={lesson.id} onClick={(e) => {
                  e.stopPropagation();
                  handleLessonClick(lesson.id);
                }}>
                  <LessonItem
                    title={lesson.title}
                    type={lesson.type}
                    duration={lesson.duration}
                    completed={lesson.completed}
                  />
                </div>
              ))}
              {lessons.length > 3 && (
                <p className="text-xs text-gray-500 px-3 py-1">
                  +{lessons.length - 3} more lessons
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ModuleCard;
