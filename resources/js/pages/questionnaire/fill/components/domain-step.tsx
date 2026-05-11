import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Question } from '@/types';
import { QuestionCard } from './question-card';

interface DomainStepProps {
    domainName: string;
    description: string;
    questions: Question[];
    answers: Record<number, number | null>;
    onAnswerChange: (questionId: number, score: number) => void;
}

export function DomainStep({ domainName, description, questions, answers, onAnswerChange }: DomainStepProps) {
    return (
        <div className="space-y-6">
            <Card className="bg-muted/50">
                <CardHeader>
                    <div>
                        <CardTitle>{domainName}</CardTitle>
                        <CardDescription className="mt-1">{description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <div className="space-y-6">
                {questions.map((question) => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        value={answers[question.id] ?? null}
                        onChange={(score) => onAnswerChange(question.id, score)}
                    />
                ))}
            </div>
        </div>
    );
}
