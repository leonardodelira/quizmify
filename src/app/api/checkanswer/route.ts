import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

export async function POST(req: Request, res: Response) {
  try {
    const { questionId, userInput } = await req.json();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    await prisma.question.update({ where: { id: questionId }, data: { userAnswer: userInput } });

    if (question.questionType.toLocaleLowerCase() === "mcq") {
      const isCorrect = question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();
      await prisma.question.update({ where: { id: questionId }, data: { isCorrect } });
      return NextResponse.json({ isCorrect });
    }

    if (question.questionType === "open_ended") {
      let percentageSimilar = stringSimilarity.compareTwoStrings(question.answer.toLowerCase().trim(), userInput.toLowerCase().trim());
      percentageSimilar = Math.round(percentageSimilar * 100);
      await prisma.question.update({
        where: { id: questionId },
        data: { percentageCorrect: percentageSimilar },
      });
      return NextResponse.json({ percentageSimilar });
    }
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 400 });
  }
}
