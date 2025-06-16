
import { Play, CheckCircle, FileText, Video } from "lucide-react";

interface LessonItemProps {
  title: string;
  type: "video" | "text" | "quiz";
  duration?: string;
  completed?: boolean;
}

const LessonItem = ({ title, type, duration, completed = false }: LessonItemProps) => {
  const getIcon = () => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-500" />;
    
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "text":
        return <FileText className="h-4 w-4 text-gray-500" />;
      case "quiz":
        return <Play className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
      completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-blue-300"
    }`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${
          completed ? "text-green-800" : "text-gray-900"
        }`}>
          {title}
        </p>
        {duration && (
          <p className="text-xs text-gray-500 mt-1">{duration}</p>
        )}
      </div>
      
      {!completed && (
        <Play className="h-3 w-3 text-gray-400 flex-shrink-0" />
      )}
    </div>
  );
};

export default LessonItem;
