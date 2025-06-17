
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useTests } from "@/hooks/useTests";

interface Test {
  id: number;
  title: string;
  description: string | null;
  passing_score: number | null;
  module_id: number;
}

interface TestQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  order_number: number;
}

interface TestCardProps {
  test: Test;
  attempt?: any;
}

const TestCard = ({ test, attempt }: TestCardProps) => {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { getTestQuestions, submitTestAttempt } = useTests();

  const startTest = async () => {
    try {
      const testQuestions = await getTestQuestions(test.id);
      setQuestions(testQuestions);
      setIsStarted(true);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishTest = () => {
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);
    setShowResults(true);

    // Submit to database
    submitTestAttempt({
      testId: test.id,
      answers,
      score: finalScore,
      totalQuestions: questions.length,
    });
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (attempt && !isStarted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {test.title}
          </CardTitle>
          <CardDescription>{test.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Previous Attempt:</p>
              <div className="flex items-center gap-2 mt-1">
                {attempt.passed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="font-medium">
                  Score: {attempt.score}% {attempt.passed ? '(Passed)' : '(Failed)'}
                </span>
              </div>
            </div>
            <Button onClick={startTest} variant="outline">
              Retake Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const passed = score >= (test.passing_score || 80);
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {test.title} - Results
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            {passed ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-2" />
            )}
            <h3 className="text-2xl font-bold">{score}%</h3>
            <p className="text-gray-600">
              {passed ? 'Congratulations! You passed!' : `You need ${test.passing_score || 80}% to pass`}
            </p>
          </div>
          
          <div className="space-y-2 text-left">
            <h4 className="font-medium">Review:</h4>
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correct_answer;
              return (
                <div key={question.id} className="text-sm p-2 rounded bg-gray-50">
                  <p className="font-medium">Q{index + 1}: {question.question}</p>
                  <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                    Your answer: {userAnswer} {isCorrect ? '✓' : '✗'}
                  </p>
                  {!isCorrect && (
                    <p className="text-green-600">Correct answer: {question.correct_answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isStarted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            {test.title}
          </CardTitle>
          <CardDescription>{test.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Passing Score: {test.passing_score || 80}%</p>
            </div>
            <Button onClick={startTest} className="w-full">
              Start Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p>Loading questions...</p>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{test.title}</CardTitle>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          <RadioGroup
            value={answers[currentQ.id] || ''}
            onValueChange={handleAnswerChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A" id="A" />
              <Label htmlFor="A" className="cursor-pointer">{currentQ.option_a}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="B" id="B" />
              <Label htmlFor="B" className="cursor-pointer">{currentQ.option_b}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="C" id="C" />
              <Label htmlFor="C" className="cursor-pointer">{currentQ.option_c}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="D" id="D" />
              <Label htmlFor="D" className="cursor-pointer">{currentQ.option_d}</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id]}
          >
            {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCard;
