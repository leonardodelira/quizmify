"use client";

import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Timer } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import MCQCounter from "./mcq-counter";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: Props) => {
  const { toast } = useToast();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(-1);
  const [stats, setStats] = useState({ correct_answers: 0, wrong_answers: 0 });
  const [hasEnded, setHasEnded] = useState(false);
  const [now, setNow] = useState(new Date());

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) {
      return [];
    }
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const { mutate: checkAnswer, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post("/api/checkanswer", payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload = { gameId: game.id };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((stats) => ({ ...stats, correct_answers: stats.correct_answers + 1 }));
          toast({ title: "Correct", description: "You got it right!", variant: "success" });
        } else {
          setStats((stats) => ({ ...stats, correct_answers: stats.wrong_answers + 1 }));
          toast({ title: "Incorrect", description: "You got it wrong!", variant: "destructive" });
        }
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((questionIndex) => questionIndex + 1);
        setSelectedChoice(-1);
      },
      onError: () => {
        toast({ title: "Something went wront", variant: "destructive" });
      },
    });
  }, [checkAnswer, endGame, game.questions.length, questionIndex, toast]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link href={`/statistics/${game.id}`} className={cn(buttonVariants({ size: "lg" }), "mt-2")}>
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between items-end">
        <p>
          <span className="text-slate-400">Topic</span>
          <span className="ml-2 px-2 py-1 text-white rounded-lg bg-slate-800">{game.topic}</span>
        </p>
        <div className="flex self-start mt-3 text-slate-400 items-center">
          <Timer className="mr-2" />
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <MCQCounter correct_answers={stats.correct_answers} wrong_answers={stats.wrong_answers} />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">{game.questions.length}</div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">{currentQuestion.question}</CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              variant={selectedChoice === index ? "default" : "outline"}
              className="justify-start w-full py-8 mb-4"
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <Button disabled={isPending} onClick={() => handleNext()}>
          Next <ChevronRight className="w-4 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
