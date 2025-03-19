// pages/chat.js or app/chat/page.js (depending on your Next.js version)
import ProfessorLayout from '../components/ProfessorLayout';
import ChatPage from '../components/ChatPage';

export default function ChatPageWrapper() {
    return (
        <ProfessorLayout>
            <ChatPage />
        </ProfessorLayout>
    );
}