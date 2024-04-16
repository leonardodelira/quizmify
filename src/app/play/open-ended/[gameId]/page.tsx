import { getAuthSession } from "@/lib/nextauth";

type Props = {
  params: {
    gameId: string;
  };
};

export default async function PlayOpenEnded(props: Props) {
  const session = await getAuthSession();

  const { gameId } = props.params;
  return (
    <div>
      <h1>MCQ</h1>
      <p>Multiple Choice Questionsa: {gameId}</p>
    </div>
  );
}
