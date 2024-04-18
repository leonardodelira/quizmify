import OpenEnded from "@/components/open-ended";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gameId: string;
  };
};

export default async function PlayOpenEnded(props: Props) {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const { gameId } = props.params;

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true,
        },
      },
    },
  });

  if (!game || game.gameType !== "open_ended") {
    return redirect("/quiz");
  }

  return <OpenEnded game={game} />;
}
