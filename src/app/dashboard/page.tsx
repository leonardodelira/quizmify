import HistoryCard from "@/components/dashboard/history-card";
import QuizMeCard from "@/components/dashboard/quizme-card";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import HotTopicsCards from "../../components/dashboard/hot-topics-cards";
import RecentActivities from "../../components/dashboard/recent-activies";

export const metadata = {
  title: "Dashboard | Quizmify",
};

export default async function Dashboard() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7 max-h-screen">
        <HotTopicsCards />
        <RecentActivities />
      </div>
    </main>
  );
}
