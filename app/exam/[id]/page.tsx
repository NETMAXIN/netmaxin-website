'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Clock, Send, AlertTriangle, ArrowLeft, ChevronRight, CheckCircle, Flag, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ExamPage() {
    const params = useParams()
    const router = useRouter()
    const examId = Number(params.id)

    const [started, setStarted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(1800) // 30 mins
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, any>>({})
    const [flagged, setFlagged] = useState<number[]>([])
    const [submitted, setSubmitted] = useState(false)
    const [finalScore, setFinalScore] = useState<{ marks: number, certId: string | null } | null>(null)
    const [violationCount, setViolationCount] = useState(0)
    const [showingWarning, setShowingWarning] = useState(false)

    // Mock exam data
    const exam = {
        title: "Mid-Term Assessment: Core Concepts",
        duration: 30, // mins
        totalMarks: 50,
        questions: [
            { id: 1, type: 'mcq', text: "What is the primary function of the virtual DOM in React?", options: ["To speed up server-side rendering", "To minimize direct DOM manipulation", "To store application state globally", "To compile JSX into plain JS"], marks: 10 },
            { id: 2, type: 'mcq', text: "Which of these is NOT a hook?", options: ["useState", "useEffect", "useComponent", "useContext"], marks: 10 },
            { id: 3, type: 'short', text: "Briefly explain the difference between state and props.", marks: 15 },
            { id: 4, type: 'fill', text: "The ______ array in useEffect determines when the effect should re-run.", marks: 15 },
        ]
    }

    useEffect(() => {
        let timer: any;
        if (started && !submitted && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        } else if (timeLeft === 0 && !submitted) {
            handleSubmit("Time is up!")
        }
        return () => clearInterval(timer)
    }, [started, timeLeft, submitted])

    // Anti-cheat functionality
    useEffect(() => {
        if (!started || submitted || showingWarning) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleViolation()
            }
        };

        const handleBlur = () => {
            handleViolation()
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                handleViolation("Exiting fullscreen is not allowed!")
            }
        };

        const preventCopyPaste = (e: ClipboardEvent) => {
            e.preventDefault()
            alert("Copy/paste operations are disabled during the exam.")
        };

        window.addEventListener('blur', handleBlur)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('copy', preventCopyPaste)
        document.addEventListener('cut', preventCopyPaste)
        document.addEventListener('paste', preventCopyPaste)

        return () => {
            window.removeEventListener('blur', handleBlur)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
            document.removeEventListener('copy', preventCopyPaste)
            document.removeEventListener('cut', preventCopyPaste)
            document.removeEventListener('paste', preventCopyPaste)
        }
    }, [started, submitted, violationCount, showingWarning])

    const handleViolation = (reason?: string) => {
        if (showingWarning) return;

        setViolationCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 2) {
                handleSubmit("Exam automatically terminated due to multiple policy violations (tab shifting/leaving screen).");
            } else {
                setShowingWarning(true);
                alert(reason || "Warning: Tab shifting or leaving the screen is not allowed. Further violations will result in exam termination.");
                setTimeout(() => setShowingWarning(false), 1000);
            }
            return newCount;
        })
    }

    const handleAnswer = (qId: number, val: any) => {
        setAnswers(prev => ({ ...prev, [qId]: val }))
    }

    const toggleFlag = (idx: number) => {
        if (flagged.includes(idx)) setFlagged(flagged.filter(i => i !== idx))
        else setFlagged([...flagged, idx])
    }

    const handleSubmit = (autoReason?: string) => {
        if (!autoReason && !confirm("Are you sure you want to submit the exam?")) return;
        if (autoReason) alert(autoReason);
        setSubmitted(true)

        // Mock scoring logic
        let marks = 0;
        // Mock answers check (just random for demo, or hardcoded for simplicity)
        if (answers[1] === "To minimize direct DOM manipulation") marks += 10;
        if (answers[2] === "useComponent") marks += 10;
        if (answers[3] && (answers[3] as string).length > 10) marks += 15;
        if (answers[4] && (answers[4] as string).toLowerCase().includes("dependency")) marks += 15;

        const passed = marks >= 30; // 60% of 50
        let certId = null;

        const userStr = typeof window !== 'undefined' ? localStorage.getItem('netmaxin_user') : null;
        if (userStr) {
            const user = JSON.parse(userStr);
            if (passed) {
                certId = `CERT-LMS-${Math.floor(100000 + Math.random() * 900000)}`;
                const certs = JSON.parse(localStorage.getItem('lms_certificates') || '[]');
                certs.push({
                    certificateId: certId,
                    name: user.name || 'Student',
                    course: exam.title,
                    issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    expiryDate: 'Never',
                    status: 'valid',
                    score: (marks / 50) * 100
                });
                localStorage.setItem('lms_certificates', JSON.stringify(certs));
            }

            // Save exact exam res
            const key = `lms_exam_result_${user.id}_${examId}`;
            localStorage.setItem(key, JSON.stringify({
                marks_obtained: marks,
                total_marks: 50,
                result_status: passed ? 'passed' : 'failed',
                certificate_id: certId
            }));
        }

        setFinalScore({ marks, certId });
    }

    const requestFullscreen = () => {
        if (typeof document !== 'undefined') document.documentElement.requestFullscreen().catch(() => { })
    }

    const exitFullscreen = () => {
        if (typeof document !== 'undefined' && document.fullscreenElement) document.exitFullscreen().catch(() => { })
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    if (!started) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock size={32} />
                        </div>
                        <h1 className="text-3xl font-bold">{exam.title}</h1>

                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-black/5 dark:border-white/5 text-sm">
                            <div><p className="text-foreground/50">Duration</p><p className="font-bold text-lg">{exam.duration} mins</p></div>
                            <div><p className="text-foreground/50">Total Marks</p><p className="font-bold text-lg">{exam.totalMarks}</p></div>
                            <div><p className="text-foreground/50">Questions</p><p className="font-bold text-lg">{exam.questions.length}</p></div>
                            <div><p className="text-foreground/50">Passing Score</p><p className="font-bold text-lg">60%</p></div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs text-left flex gap-3 items-start border border-red-200 dark:border-red-500/20">
                            <AlertTriangle size={24} className="shrink-0" />
                            <p><strong>Strict Mode:</strong> This exam requires fullscreen mode. Navigating away from the window or minimizing the browser may result in auto-submission and failure.</p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link href="/profile" className="flex-1"><Button variant="outline" className="w-full h-12">Cancel</Button></Link>
                            <Button onClick={() => { requestFullscreen(); setStarted(true); }} className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold">Start Exam</Button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (submitted) {
        exitFullscreen();
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl rounded-3xl p-8 text-center space-y-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${finalScore?.certId ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                        {finalScore?.certId ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
                    </div>
                    <h1 className="text-3xl font-bold">Exam Submitted!</h1>

                    {finalScore && (
                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                            <p className="text-sm text-foreground/60 mb-1">Your Score</p>
                            <p className="text-3xl font-black text-primary">{finalScore.marks} <span className="text-lg text-foreground/50">/ 50</span></p>
                            <p className={`text-sm font-bold mt-2 ${finalScore.certId ? 'text-emerald-500' : 'text-red-500'}`}>
                                {finalScore.certId ? 'PASSED' : 'FAILED - Minimum 30 marks required'}
                            </p>
                        </div>
                    )}

                    {finalScore?.certId && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">CERTIFICATE GENERATED</p>
                            <p className="font-mono text-sm text-emerald-700 dark:text-emerald-300">{finalScore.certId}</p>
                        </div>
                    )}

                    <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
                        {finalScore?.certId && (
                            <Link href="/verify-certificate"><Button variant="outline" className="w-full h-12 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-bold">Verify Certificate</Button></Link>
                        )}
                        <Link href="/profile"><Button className="w-full bg-primary hover:opacity-90 h-12 text-white font-bold">Return to Dashboard</Button></Link>
                    </div>
                </div>
            </main>
        )
    }

    const q = exam.questions[currentQuestion]

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col select-none">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b shadow-sm flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
                <h1 className="font-bold text-lg hidden sm:block">{exam.title}</h1>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-red-500 font-mono font-bold text-xl px-4 py-1.5 bg-red-50 dark:bg-red-500/10 rounded-lg">
                        <Clock size={20} className={timeLeft < 300 ? 'animate-pulse' : ''} /> {formatTime(timeLeft)}
                    </div>
                    <Button onClick={() => handleSubmit()} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">Submit Exam</Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden h-full">

                {/* Question Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 relative">
                    <div className="max-w-3xl mx-auto space-y-8">

                        {/* Status bar */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <span className="font-bold text-xl text-primary">Question {currentQuestion + 1} of {exam.questions.length}</span>
                            <span className="text-sm font-semibold text-foreground/50 border rounded bg-black/5 dark:bg-white/5 px-2 py-1">{q.marks} Marks</span>
                        </div>

                        {/* Question body */}
                        <div className="text-lg font-medium leading-relaxed">
                            {q.text}
                        </div>

                        {/* Input Methods */}
                        <div className="space-y-4 pt-4">
                            {q.type === 'mcq' && q.options?.map((opt, idx) => (
                                <label key={idx} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${answers[q.id] === opt ? 'border-primary bg-primary/5 shadow-sm' : 'border-black/10 dark:border-white/10 hover:border-primary/50'}`}>
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        checked={answers[q.id] === opt}
                                        onChange={() => handleAnswer(q.id, opt)}
                                        className="w-5 h-5 text-primary border-black/20 focus:ring-primary"
                                    />
                                    <span className="text-base font-medium">{opt}</span>
                                </label>
                            ))}

                            {q.type === 'short' && (
                                <textarea
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="w-full h-48 p-5 rounded-2xl border-2 border-black/10 dark:border-white/10 focus:border-primary bg-transparent resize-y outline-none transition-all"
                                />
                            )}

                            {q.type === 'fill' && (
                                <input
                                    type="text"
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                                    placeholder="Fill in the blank..."
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-black/10 dark:border-white/10 focus:border-primary bg-transparent outline-none transition-all"
                                />
                            )}
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between pt-12 border-t mt-12">
                            <Button variant="ghost" onClick={() => toggleFlag(currentQuestion)} className={flagged.includes(currentQuestion) ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' : ''}>
                                <Flag size={18} className="mr-2" /> {flagged.includes(currentQuestion) ? 'Unflag' : 'Flag for Review'}
                            </Button>

                            <div className="flex gap-3">
                                <Button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(c => c - 1)} variant="outline" className="w-24 border-primary/20 hover:bg-primary/5"><ArrowLeft size={16} /> Prev</Button>
                                {currentQuestion < exam.questions.length - 1 ? (
                                    <Button onClick={() => setCurrentQuestion(c => c + 1)} className="w-24 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">Next <ChevronRight size={16} /></Button>
                                ) : (
                                    <Button onClick={() => handleSubmit()} className="w-32 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 font-bold">Complete</Button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Sidebar - Navigator */}
                <div className="w-80 bg-slate-100 dark:bg-slate-900/50 border-l hidden lg:block overflow-y-auto shrink-0 p-6 shadow-inner">
                    <h3 className="font-bold mb-6 flex items-center justify-between">
                        Navigator
                        <button onClick={requestFullscreen} title="Enter Fullscreen" className="text-foreground/40 hover:text-foreground">
                            <Maximize size={16} />
                        </button>
                    </h3>

                    <div className="grid grid-cols-4 gap-3">
                        {exam.questions.map((ques, idx) => {
                            const isAnswered = answers[ques.id] !== undefined && answers[ques.id] !== '';
                            const isCurrent = currentQuestion === idx;
                            const isFlagged = flagged.includes(idx);

                            let colorClass = "bg-white dark:bg-slate-800 border-black/10 dark:border-white/10 text-foreground hover:border-primary/50";

                            if (isCurrent) colorClass = "bg-primary text-white border-primary shadow-md shadow-primary/30 ring-2 ring-primary/20";
                            else if (isFlagged) colorClass = "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30";
                            else if (isAnswered) colorClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400";

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`w-full aspect-square rounded-xl font-bold font-mono text-sm border-2 transition-all flex items-center justify-center relative ${colorClass}`}
                                >
                                    {idx + 1}
                                    {isFlagged && isAnswered && !isCurrent && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-8 space-y-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/5 text-xs">
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-primary"></div> Current</div>
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-emerald-500/10 border-2 border-emerald-500/50"></div> Answered</div>
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-white dark:bg-slate-800 border-2 border-black/10 dark:border-white/10"></div> Not Answered</div>
                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-orange-500"></div> Flagged</div>
                    </div>
                </div>

            </div>
        </main>
    )
}
