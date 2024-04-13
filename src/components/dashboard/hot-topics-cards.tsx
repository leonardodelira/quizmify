"use client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "../word-cloud";

type Props = {};

const HotTopicsCards = ({}: Props) => {
  const router = useRouter();

  return (
    <Card className="col-span-4" onClick={() => router.push("/history")}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it!
        </CardDescription>
      </CardHeader>

      <CardContent className="pl-2">
        <WordCloud
          formattedTopics={[
            { text: "abc", value: 1 },
            { text: "abc", value: 2 },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCards;
