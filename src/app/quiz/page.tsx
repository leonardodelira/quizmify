import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/quiz/quiz-creation";

export const metadata = {
  title: "Quiz | Quizmify",
};

export default async function Quiz() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  return <QuizCreation />;
}
