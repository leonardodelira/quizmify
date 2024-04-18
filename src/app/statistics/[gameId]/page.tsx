import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ResultsCard from "./_components/results-cards";
import AccuracyCard from "./_components/accuracy-card";
import TimeTakenCard from "./_components/time-taken-card";
import QuestionsList from "./_components/question-list";

type Props = {
  params: {
    gameId: string;
  };
};

export default async function Statistcs({ params }: Props) {
  const { gameId } = params;
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });

  if (!game) {
    return redirect("/");
  }

  let accuracy: number = 0;

  let totalCorrect = game.questions.reduce((acc, question) => {
    if (question.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  accuracy = (totalCorrect / game.questions.length) * 100;
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard timeEnded={new Date(game.timeEnded ?? 0)} timeStarted={new Date(game.timeStarted ?? 0)} />
        </div>
        <QuestionsList questions={game.questions} />
      </div>
    </>
  );
}
