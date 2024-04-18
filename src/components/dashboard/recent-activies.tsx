import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";

type Props = {};

const RecentActivities = async ({}: Props) => {
  const session = await getAuthSession();
  const games_count = await prisma.game.count({
    where: {
      userId: session!.user.id,
    },
  });

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
        <CardDescription>You have played {games_count} quizzes in the last 7 days.</CardDescription>
      </CardHeader>

      <CardContent className="pl-2"></CardContent>
    </Card>
  );
};

export default RecentActivities;
