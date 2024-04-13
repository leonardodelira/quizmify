import SignInButton from "@/components/singin-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="w-[300px] text-center">
        <CardHeader>
          <CardTitle>Welcome to Quizmify</CardTitle>
          <CardDescription>
            Quizmify is a quiz app that allows you to create and play quizzes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton>SignIn with Google</SignInButton>
        </CardContent>
      </Card>
    </div>
  );
}
