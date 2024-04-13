"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {};

const RecentActivities = ({}: Props) => {
  const router = useRouter();

  return (
    <Card
      className="col-span-4 lg:col-span-3"
      onClick={() => router.push("/history")}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
        <CardDescription>
          You have played 5 quizzes in the last 7 days.
        </CardDescription>
      </CardHeader>

      <CardContent className="pl-2"></CardContent>
    </Card>
  );
};

export default RecentActivities;
