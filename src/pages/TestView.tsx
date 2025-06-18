
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle, XCircle, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const TestView = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const { data: test, isLoading: testLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*, modules(*)')
        .eq('id', parseInt(testId!))
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['test-questions', testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_questions')
        .select('*')
        .eq('test_id', parseInt(testId!))
        .order('order_number');

      if (error) throw error;
      return data;
    },
    enabled: !!testId,
  });

  // Timer effect - 5 minutes per question
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion(); // Auto-advance when time runs out
          return 300; // Reset timer for next question
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isCompleted]);

  const submitTestMutation = useMutation({
    mutationFn: async ({ finalScore, totalQuestions }: { finalScore: number; totalQuestions: number }) => {
      if (!user?.id || !testId || !test) {
        throw new Error('Missing required data for test submission');
      }

      console.log('Starting test submission:', { 
        testId: parseInt(testId), 
        userId: user.id, 
        score: finalScore, 
        totalQuestions,
        moduleId: test.module_id
      });

      // Insert test attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('test_attempts')
        .insert({
          test_id: parseInt(testId),
          user_id: user.id,
          answers,
          score: finalScore,
          total_questions: totalQuestions,
        })
        .select()
        .single();

      if (attemptError) {
        console.error('Test attempt insertion error:', attemptError);
        throw new Error(`Failed to save test attempt: ${attemptError.message}`);
      }

      console.log('Test attempt saved successfully:', attemptData);

      // Update user progress with test score
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: test.module_id,
          test_score: finalScore,
        }, {
          onConflict: 'user_id,module_id'
        });

      if (progressError) {
        console.error('Progress update error:', progressError);
        throw new Error(`Failed to update progress: ${progressError.message}`);
      }

      console.log('Progress updated successfully');
      return finalScore;
    },
    onSuccess: (finalScore) => {
      console.log('Test submission successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['test_attempts'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      queryClient.invalidateQueries({ queryKey: ['current_grade'] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      
      toast({
        title: "Test Completed Successfully!",
        description: `You scored ${finalScore}%`,
      });
    },
    onError: (error: any) => {
      console.error('Test submission error:', error);
      toast({
        title: "Test Submission Failed",
        description: error.message || "There was an error submitting your test. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnswerChange = (value: string) => {
    if (!questions) return;
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(300); // Reset timer for next question
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    if (!questions) return;

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

    // Submit to database
    submitTestMutation.mutate({
      finalScore,
      totalQuestions: questions.length,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (testLoading || questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test || !questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Test not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const passed = score >= (test.passing_score || 80);
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <Header />
          
          <main className="max-w-4xl mx-auto px-6 py-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Test Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  {passed ? (
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  )}
                  <h2 className="text-3xl font-bold mb-2">{score}%</h2>
                  <p className="text-lg text-gray-600 mb-4">
                    {passed ? 'Congratulations! You passed!' : `You need ${test.passing_score || 80}% to pass`}
                  </p>
                  <Badge variant={passed ? "default" : "destructive"} className="text-lg px-4 py-2">
                    {passed ? "PASSED" : "FAILED"}
                  </Badge>
                </div>

                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  <h3 className="font-semibold text-lg">Review:</h3>
                  {questions.map((question, index) => {
                    const userAnswer = answers[question.id];
                    const isCorrect = userAnswer === question.correct_answer;
                    return (
                      <div key={question.id} className="p-4 rounded-lg bg-gray-50 border">
                        <p className="font-medium mb-2">Q{index + 1}: {question.question}</p>
                        <p className={`mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Your answer: {userAnswer || 'No answer'} {isCorrect ? '✓' : '✗'}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">Correct answer: {question.correct_answer}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="mt-6"
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{test.title}</h1>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <div className="flex items-center space-x-2 text-lg font-medium">
                  <Timer className="h-5 w-5" />
                  <span className={timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={handleAnswerChange}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="A" id="A" />
                  <Label htmlFor="A" className="cursor-pointer flex-1">{currentQ.option_a}</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="B" id="B" />
                  <Label htmlFor="B" className="cursor-pointer flex-1">{currentQ.option_b}</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="C" id="C" />
                  <Label htmlFor="C" className="cursor-pointer flex-1">{currentQ.option_c}</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="D" id="D" />
                  <Label htmlFor="D" className="cursor-pointer flex-1">{currentQ.option_d}</Label>
                </div>
              </RadioGroup>

              <div className="flex justify-end">
                <Button
                  onClick={handleNextQuestion}
                  disabled={!answers[currentQ.id]}
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default TestView;
