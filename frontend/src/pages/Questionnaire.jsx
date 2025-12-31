import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "react-toastify";
import {
  Zap,
  Car,
  ShoppingBag,
  Leaf,
  ChevronRight,
  ChevronLeft,
  Recycle,
  Utensils,
  Home,
} from "lucide-react";

const questions = [
  {
    id: "electricity",
    category: "Energy",
    icon: <Zap className="w-6 h-6" />,
    question: "What's your average monthly electricity consumption?",
    type: "slider",
    min: 0,
    max: 1000,
    unit: "kWh",
    hint: "Check your electricity bill",
  },
  {
    id: "transport",
    category: "Transportation",
    icon: <Car className="w-6 h-6" />,
    question: "What's your primary mode of transportation?",
    type: "radio",
    options: [
      { value: "public", label: "Public Transport" },
      { value: "carpool", label: "Carpool / Shared Rides" },
      { value: "personal", label: "Personal Vehicle" },
      { value: "bike", label: "Bicycle / Walking" },
      { value: "electric", label: "Electric Vehicle" },
    ],
  },
  {
    id: "distance",
    category: "Transportation",
    icon: <Car className="w-6 h-6" />,
    question: "How many kilometers do you travel daily?",
    type: "slider",
    min: 0,
    max: 100,
    unit: "km",
  },
  {
    id: "shopping",
    category: "Shopping",
    icon: <ShoppingBag className="w-6 h-6" />,
    question: "How often do you buy new clothes?",
    type: "radio",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "monthly", label: "Monthly" },
      { value: "weekly", label: "Weekly" },
      { value: "secondhand", label: "Mostly second-hand" },
    ],
  },
  {
    id: "diet",
    category: "Lifestyle",
    icon: <Utensils className="w-6 h-6" />,
    question: "How would you describe your diet?",
    type: "radio",
    options: [
      { value: "vegan", label: "Vegan" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "flexitarian", label: "Flexitarian" },
      { value: "omnivore", label: "Regular meat eater" },
    ],
  },
  {
    id: "recycling",
    category: "Lifestyle",
    icon: <Recycle className="w-6 h-6" />,
    question: "Do you separate and recycle your waste?",
    type: "radio",
    options: [
      { value: "always", label: "Always" },
      { value: "mostly", label: "Mostly" },
      { value: "sometimes", label: "Sometimes" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "home",
    category: "Home",
    icon: <Home className="w-6 h-6" />,
    question: "Do you use energy-efficient appliances?",
    type: "radio",
    options: [
      { value: "all", label: "Yes, all" },
      { value: "most", label: "Most" },
      { value: "some", label: "Some" },
      { value: "none", label: "Not really" },
    ],
  },
];

const Questionnaire = () => {
  const navigate = useNavigate();
  

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const currentQuestion = questions[currentStep];
  const total = questions.length;
  const progress = ((currentStep + 1) / total) * 100;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < total - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 🔥 BACKEND CONNECTED
  const calculateScore = async () => {
    setIsCalculating(true);

    try {
     const res = await fetch("http://localhost:3000/api/v4/eco", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ answers }),
});


    

      const data = await res.json();

      console.log(data);

      toast({
        title: "Eco Score Ready 🌱",
        description: `Your score: ${data.assessment.score}`,
      });

      navigate("/dashboard", {
        state: data.assessment,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to calculate eco score",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const canProceed = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0c1210_0%,#060908_100%)]">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* 🔥 Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">
                {currentStep + 1} / {total} Questions
              </span>
              <span className="text-green-400 font-semibold">
                {Math.round(progress)}%
              </span>
            </div>

            {/* 🔥 Custom Gradient Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#111] overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(180deg, #0c1210 0%, #060908 100%)",
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="bg-black/40 border border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-green-400">
                  {currentQuestion.icon}
                </div>
                <span className="text-sm text-gray-400 uppercase">
                  {currentQuestion.category}
                </span>
              </div>

              <CardTitle className="text-white text-2xl">
                {currentQuestion.question}
              </CardTitle>

              {currentQuestion.hint && (
                <CardDescription className="text-gray-400">
                  {currentQuestion.hint}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-6">

              {/* Slider */}
              {currentQuestion.type === "slider" && (
                <div className="space-y-6">
                  <Slider
                    value={[
                      Number(answers[currentQuestion.id]) ||
                        currentQuestion.min,
                    ]}
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    step={1}
                    onValueChange={(val) => handleAnswer(val[0])}
                  />

                  <div className="text-center text-white text-4xl font-bold">
                    {answers[currentQuestion.id] || currentQuestion.min}
                    <span className="text-gray-400 text-lg ml-2">
                      {currentQuestion.unit}
                    </span>
                  </div>
                </div>
              )}

              {/* Radio */}
              {currentQuestion.type === "radio" && (
                <RadioGroup
                  value={String(answers[currentQuestion.id] || "")}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <Label
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        answers[currentQuestion.id] === option.value
                          ? "border-green-400 bg-green-400/10"
                          : "border-white/10 hover:border-green-400/50"
                      }`}
                    >
                      <RadioGroupItem value={option.value} />
                      <span className="text-white">
                        {option.label}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              )}

              {/* Navigation */}
              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed || isCalculating}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isCalculating
                    ? "Calculating..."
                    : currentStep === total - 1
                    ? "Calculate Score"
                    : "Next"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Questionnaire;
