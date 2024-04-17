import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 400 });
  }
}
