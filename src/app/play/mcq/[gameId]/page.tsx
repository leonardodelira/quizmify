import MCQ from "@/components/mcq";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gameId: string;
  };
};

export default async function PlayMCQ(props: Props) {
  //TODO: global validation session
  const session = await getAuthSession();
  
  if (!session?.user) {
    return redirect("/");
  }

  const { gameId } = props.params;

  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        }
      }
    }
  })

  if (!game || game.gameType !== "mcq") {
    return redirect("/quiz");
  }

  return <MCQ game={game} />;
}
