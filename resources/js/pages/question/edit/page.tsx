import QuestionCreatePage from '../create/page';
import type { PageProps, Question } from '@/types';

interface Props extends PageProps {
    question: Question;
}

export default function QuestionEditPage(props: Props) {
    return <QuestionCreatePage {...props} isEdit={true} />;
}
