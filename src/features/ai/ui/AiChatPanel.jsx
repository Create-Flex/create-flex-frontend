import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUIStore } from '../../../shared/model/useUIStore';
import { aiService } from '../api/aiService';
import * as S from './AiChatPanel.styled';

export const AiChatPanel = () => {
    const { isChatOpen, toggleChat, setChatOpen } = useUIStore();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // 메시지 목록 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // 패널 열릴 때 입력 필드 포커스
    useEffect(() => {
        if (isChatOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 200);
        }
    }, [isChatOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        // 유저 메시지 추가
        const userMessage = { role: 'user', content: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const reply = await aiService.sendMessage(trimmed);
            setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
        } catch (error) {
            const errorMessage = error.response?.data?.message
                || error.message
                || '알 수 없는 오류가 발생했습니다.';
            setMessages((prev) => [
                ...prev,
                { role: 'ai', content: `⚠️ ${errorMessage}`, isError: true }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    return (
        <>
            {/* 플로팅 버튼 */}
            <S.Fab onClick={toggleChat} aria-label="AI 어시스턴트 열기">
                {isChatOpen ? <X size={20} /> : <Sparkles size={20} />}
            </S.Fab>

            {/* 채팅 패널 */}
            {isChatOpen && (
                <S.Panel>
                    {/* 헤더 */}
                    <S.Header>
                        <S.HeaderLeft>
                            <S.HeaderIcon>
                                <Sparkles size={14} />
                            </S.HeaderIcon>
                            <S.HeaderTitle>AI 어시스턴트</S.HeaderTitle>
                        </S.HeaderLeft>
                        <S.CloseButton onClick={() => setChatOpen(false)}>
                            <X size={16} />
                        </S.CloseButton>
                    </S.Header>

                    {/* 메시지 영역 */}
                    {messages.length === 0 && !isLoading ? (
                        <S.WelcomeArea>
                            <S.WelcomeIcon>✨</S.WelcomeIcon>
                            <S.WelcomeTitle>AI 어시스턴트</S.WelcomeTitle>
                            <S.WelcomeDesc>
                                무엇이든 질문해 보세요.
                                <br />
                                업무 관련 도움을 드릴 수 있습니다.
                            </S.WelcomeDesc>
                        </S.WelcomeArea>
                    ) : (
                        <S.Messages>
                            {messages.map((msg, idx) => (
                                <S.MessageGroup key={idx}>
                                    <S.MessageLabel $isUser={msg.role === 'user'}>
                                        {msg.role === 'user' ? '나' : 'AI'}
                                    </S.MessageLabel>
                                    <S.MessageBubble $isUser={msg.role === 'user'}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </S.MessageBubble>
                                </S.MessageGroup>
                            ))}
                            {isLoading && (
                                <S.MessageGroup>
                                    <S.MessageLabel>AI</S.MessageLabel>
                                    <S.TypingIndicator>
                                        <S.TypingDot $delay="0s" />
                                        <S.TypingDot $delay="0.2s" />
                                        <S.TypingDot $delay="0.4s" />
                                    </S.TypingIndicator>
                                </S.MessageGroup>
                            )}
                            <div ref={messagesEndRef} />
                        </S.Messages>
                    )}

                    {/* 입력 영역 */}
                    <S.InputArea>
                        <S.InputWrapper onSubmit={handleSend}>
                            <S.Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    // Reset height to calculate correctly
                                    e.target.style.height = 'auto';
                                    // Set new height based on scrollHeight, up to max-height defined in CSS
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="메시지를 입력하세요..."
                                rows={1}
                                disabled={isLoading}
                            />
                            <S.SendButton
                                type="submit"
                                disabled={!input.trim() || isLoading}
                            >
                                <Send size={16} />
                            </S.SendButton>
                        </S.InputWrapper>
                    </S.InputArea>
                </S.Panel>
            )}
        </>
    );
};
