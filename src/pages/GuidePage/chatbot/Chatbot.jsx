import React, { useState, useRef } from 'react';
import './Chatbot.css';

export default function Chatbot() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [isRecording, setIsRecording] = useState(false);

    const recognitionRef = useRef(null);

    const handleAsk = async () => {
        if (!question.trim()) return;

        setLoading(true);
        const currentQuestion = question;
        setQuestion('');
        setAnswer('');

        try {
            const response = await fetch('http://127.0.0.1:8000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: currentQuestion }),
            });

            const data = await response.json();

            if (data.answer) {
                setAnswer(data.answer);
                setHistory(prev => [...prev, { question: currentQuestion, answer: data.answer }]);
            } else if (data.error) {
                setAnswer(`❌ Lỗi: ${data.error}`);
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            setAnswer('❌ Lỗi kết nối đến server.');
        } finally {
            setLoading(false);
        }
    };

    const toggleRecording = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Trình duyệt không hỗ trợ ghi âm bằng Web Speech API.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'vi-VN'; // tiếng Việt
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onresult = (event) => {
                const speechText = event.results[0][0].transcript;
                setQuestion(speechText);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Lỗi ghi âm:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }

        if (!isRecording) {
            setIsRecording(true);
            recognitionRef.current.start();
        } else {
            recognitionRef.current.stop();
        }
    };

    return (
        <div className="chatbot-container">
            <h2>🤖 Trợ lý hỏi đáp về Tour & Địa điểm</h2>

            <div className="chatbot-history">
                {history.map((entry, index) => (
                    <div key={index} className="chatbot-message">
                        <p><strong>🧑‍💻 Bạn:</strong> {entry.question}</p>
                        <p><strong>🤖 Bot:</strong> {entry.answer}</p>
                    </div>
                ))}
            </div>

            <textarea
                rows="3"
                value={question}
                onChange={(e) => {
                    setQuestion(e.target.value);
                    setAnswer('');
                }}
                placeholder="Nhập câu hỏi hoặc bấm micro để nói..."
                className="chatbot-input"
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={handleAsk} className="chatbot-button" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Gửi câu hỏi'}
                </button>

                <button onClick={toggleRecording} className="chatbot-button mic-button">
                    {isRecording ? '🛑 Dừng ghi' : '🎤 Ghi âm'}
                </button>
            </div>

            {answer && (
                <div className="chatbot-answer">
                    <p><strong>💬 Trả lời:</strong> {answer}</p>
                </div>
            )}
        </div>
    );
}
