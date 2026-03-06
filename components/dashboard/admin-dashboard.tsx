'use client'
import { useState, useEffect, useCallback } from 'react'
import { Shield, Coins, Search, Loader2, KeyRound, ArrowUpRight, ArrowDownLeft, RefreshCw, Upload, Trash2, Edit2, Plus, Video, ChevronUp, ChevronDown, ListVideo, Activity, Clock, Monitor, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, formatDate, StatusBadge } from './api'

export default function AdminDashboard({ user }: { user: any }) {
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [coinForm, setCoinForm] = useState({ target: '', amount: '', op: 'add' })
    const [apps, setApps] = useState<any[]>([])
    const [transactions, setTransactions] = useState<any[]>([])
    const [quotes, setQuotes] = useState<any[]>([])
    const [news, setNews] = useState<any[]>([])
    const [activityStats, setActivityStats] = useState<any[]>([])
    const [activityFeed, setActivityFeed] = useState<any[]>([])
    const [tab, setTab] = useState<'users' | 'coins' | 'applications' | 'reset_password' | 'quotes' | 'bulk_upload' | 'lms_courses' | 'news' | 'user_logs'>('users')
    const [resetForm, setResetForm] = useState({ target_email: '', new_password: '' })
    const [isResetting, setIsResetting] = useState(false)
    const [isManaging, setIsManaging] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // News state
    const [newsForm, setNewsForm] = useState({ title: '', description: '', type: 'General', iconStr: 'Bell' })
    const [isPostingNews, setIsPostingNews] = useState(false)

    // Edit User & Bulk Upload state
    const [editingUser, setEditingUser] = useState<any>(null)
    const [bulkJson, setBulkJson] = useState('')
    const [isUploading, setIsUploading] = useState(false)

    // LMS Course State
    const [lmsForm, setLmsForm] = useState({ id: null as any, title: '', price: '', discount: '', coupon: '' })
    const [lmsModules, setLmsModules] = useState<{ id: string, title: string, description: string, videoUrl: string }[]>([])
    const [examQuestions, setExamQuestions] = useState<{ id: string, text: string, options: string[], answer: number }[]>([])
    const [savedCourses, setSavedCourses] = useState<any[]>([])
    const [isSavingLms, setIsSavingLms] = useState(false)

    const loadData = useCallback(async () => {
        const [uRes, aRes, tRes, qRes, lmsRes, nRes, logRes] = await Promise.all([
            api({ action: 'get_all_users', requester_id: user.id }),
            api({ action: 'get_all_applications', requester_id: user.id }),
            api({ action: 'get_all_transactions', requester_id: user.id }),
            api({ action: 'get_quotes', user_id: user.id }),
            api({ action: 'get_all_courses' }),
            api({ action: 'get_news' }),
            api({ action: 'get_all_activity_logs', requester_id: user.id }),
        ])
        if (uRes.status === 'success') setAllUsers(uRes.users)
        if (aRes.status === 'success') setApps(aRes.applications)
        if (tRes.status === 'success') setTransactions(tRes.transactions)
        if (qRes.status === 'success') setQuotes(qRes.quotes)
        if (nRes.status === 'success') setNews(nRes.news)
        if (logRes.status === 'success') {
            setActivityStats(logRes.stats || [])
            setActivityFeed(logRes.feed || [])
        }

        // Load unified LMS courses
        if (lmsRes.status === 'success') setSavedCourses(lmsRes.courses)

        setLoading(false)
        setRefreshing(false)
    }, [user.id])

    useEffect(() => { loadData() }, [loadData])

    const handleRefresh = () => { setRefreshing(true); loadData() }

    const changeRole = async (targetId: number, newRole: string) => {
        const res = await api({ action: 'update_user_role', admin_id: user.id, target_user_id: targetId, new_role: newRole })
        alert(res.message)
        loadData()
    }

    const deleteUser = async (targetId: number) => {
        if (!confirm("Are you sure you want to completely delete this user? This cannot be undone.")) return;
        const res = await api({ action: 'delete_user', admin_id: user.id, target_user_id: targetId })
        alert(res.message)
        loadData()
    }

    const saveUserEdit = async () => {
        if (!editingUser) return;
        setLoading(true);
        const res = await api({
            action: 'admin_update_user',
            admin_id: user.id,
            target_user_id: editingUser.id,
            name: editingUser.name,
            email: editingUser.email,
            company: editingUser.company,
            position: editingUser.position,
            coins: editingUser.coins
        })
        alert(res.message)
        setEditingUser(null)
        loadData()
    }

    const [csvUsers, setCsvUsers] = useState<{ name: string; email: string }[]>([])
    const [csvFileName, setCsvFileName] = useState('')
    const [csvDuplicates, setCsvDuplicates] = useState<string[]>([])

    const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setCsvFileName(file.name)
        setCsvDuplicates([])
        const reader = new FileReader()
        reader.onload = (evt) => {
            const text = evt.target?.result as string
            if (!text) return
            const lines = text.split(/\r?\n/).filter(l => l.trim())
            if (lines.length < 2) { alert('CSV must have a header row and at least one data row.'); return }

            // Parse header
            const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
            const nameIdx = header.findIndex(h => h === 'name')
            const emailIdx = header.findIndex(h => h === 'email')

            if (nameIdx === -1 || emailIdx === -1) {
                alert('CSV must have "name" and "email" columns in the header row.')
                return
            }

            // Parse rows
            const users: { name: string; email: string }[] = []
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''))
                const name = cols[nameIdx] || ''
                const email = cols[emailIdx] || ''
                if (name && email) users.push({ name, email: email.toLowerCase() })
            }

            if (users.length === 0) { alert('No valid users found in CSV.'); return }

            // Detect duplicates within CSV (by email)
            const emailCount: Record<string, number> = {}
            users.forEach(u => { emailCount[u.email] = (emailCount[u.email] || 0) + 1 })
            const csvDups = Object.keys(emailCount).filter(e => emailCount[e] > 1)

            // Detect duplicates against existing users
            const existingEmails = new Set(allUsers.map(u => u.email?.toLowerCase()))
            const existingDups = users.filter(u => existingEmails.has(u.email)).map(u => u.email)

            const allDups = [...new Set([...csvDups, ...existingDups])]

            if (allDups.length > 0) {
                setCsvDuplicates(allDups)
                // Show warning with details
                const msg = `⚠️ Duplicate emails detected!\n\n` +
                    (csvDups.length > 0 ? `Duplicates within CSV:\n${csvDups.map(e => `  • ${e}`).join('\n')}\n\n` : '') +
                    (existingDups.length > 0 ? `Already existing users:\n${[...new Set(existingDups)].map(e => `  • ${e}`).join('\n')}\n\n` : '') +
                    `Click OK to remove duplicates and keep unique entries only, or Cancel to keep all.`

                if (confirm(msg)) {
                    // Remove duplicates: keep first occurrence within CSV, remove those already existing
                    const seen = new Set<string>()
                    const deduped = users.filter(u => {
                        if (seen.has(u.email) || existingEmails.has(u.email)) return false
                        seen.add(u.email)
                        return true
                    })
                    setCsvUsers(deduped)
                    setCsvDuplicates([])
                    if (deduped.length === 0) alert('All entries were duplicates. No users to upload.')
                } else {
                    setCsvUsers(users)
                }
            } else {
                setCsvUsers(users)
                setCsvDuplicates([])
            }
        }
        reader.readAsText(file)
    }

    const [uploadResult, setUploadResult] = useState('')
    const [uploadProgress, setUploadProgress] = useState('')

    const handleBulkUpload = async () => {
        if (csvUsers.length === 0) { alert('No users to upload. Please select a CSV file first.'); return }
        setIsUploading(true)
        setUploadResult('')
        setUploadProgress('')

        const BATCH_SIZE = 25
        let totalSuccess = 0
        let totalFailed = 0
        const totalUsers = csvUsers.length

        for (let i = 0; i < totalUsers; i += BATCH_SIZE) {
            const batch = csvUsers.slice(i, i + BATCH_SIZE)
            setUploadProgress(`Uploading ${Math.min(i + BATCH_SIZE, totalUsers)}/${totalUsers} users...`)

            try {
                const res = await api({ action: 'bulk_upload_users', admin_id: user.id, users: batch })
                if (res.status === 'success') {
                    // Parse counts from response message if available
                    const importedMatch = res.message?.match(/Imported:\s*(\d+)/)
                    const failedMatch = res.message?.match(/Failed.*?:\s*(\d+)/)
                    totalSuccess += importedMatch ? parseInt(importedMatch[1]) : batch.length
                    totalFailed += failedMatch ? parseInt(failedMatch[1]) : 0
                } else {
                    // Retry once on failure
                    const retry = await api({ action: 'bulk_upload_users', admin_id: user.id, users: batch })
                    if (retry.status === 'success') {
                        const importedMatch = retry.message?.match(/Imported:\s*(\d+)/)
                        const failedMatch = retry.message?.match(/Failed.*?:\s*(\d+)/)
                        totalSuccess += importedMatch ? parseInt(importedMatch[1]) : batch.length
                        totalFailed += failedMatch ? parseInt(failedMatch[1]) : 0
                    } else {
                        totalFailed += batch.length
                    }
                }
            } catch {
                totalFailed += batch.length
            }
        }

        setCsvUsers([])
        setCsvFileName('')
        setCsvDuplicates([])
        setIsUploading(false)
        setUploadProgress('')
        setUploadResult(`Upload complete! Imported: ${totalSuccess}. Failed/Skipped: ${totalFailed}.`)
        loadData()
    }

    const downloadCsvTemplate = () => {
        const csv = 'name,email\nJohn Doe,john@example.com\nJane Smith,jane@example.com\n'
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'users_template.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleCoins = async () => {
        if (!coinForm.target || !coinForm.amount) { alert('Fill all fields'); return }
        const targetUser = allUsers.find(u => u.email === coinForm.target)
        if (!targetUser) { alert('User not found'); return }
        setIsManaging(true)
        const res = await api({ action: 'manage_coins', requester_id: user.id, target_user_id: targetUser.id, amount: parseInt(coinForm.amount), operation: coinForm.op })
        alert(res.message)
        setCoinForm({ target: '', amount: '', op: 'add' })
        setIsManaging(false)
        // Wait a moment then refresh all data (including transactions)
        await new Promise(r => setTimeout(r, 500))
        await loadData()
    }

    const handleSaveCourse = async () => {
        setIsSavingLms(true);
        let customCourses = [...savedCourses];

        if (lmsForm.id) {
            // Update existing. Safely merge by keeping existing properties that aren't in lmsForm.
            customCourses = customCourses.map(c => c.id === lmsForm.id ? { ...c, ...lmsForm, modules: lmsModules, examData: examQuestions } : c);
        } else {
            // Create new
            const baseCourse = {
                category: 'General',
                level: 'Beginner',
                duration: 'Flexible',
                students: 0,
                rating: 5.0,
                instructor: 'Admin',
                status: 'published'
            };
            customCourses.push({ ...baseCourse, ...lmsForm, id: Date.now(), modules: lmsModules, examData: examQuestions });
        }

        localStorage.setItem('admin_lms_courses', JSON.stringify(customCourses));
        setSavedCourses(customCourses);

        await new Promise(r => setTimeout(r, 1000));
        alert(lmsForm.id ? "Course updated successfully!" : "Course successfully published!");
        resetCourseForm();
        setIsSavingLms(false);
    }

    const resetCourseForm = () => {
        setLmsForm({ id: null, title: '', price: '', discount: '', coupon: '' });
        setLmsModules([]);
        setExamQuestions([]);
    }

    const editCourse = (course: any) => {
        setLmsForm({
            id: course.id,
            title: course.title || '',
            price: course.price || '',
            discount: course.discount || '',
            coupon: course.coupon || ''
        });
        setLmsModules(Array.isArray(course.modules) ? course.modules : []);

        // Load exam topics flexibly
        let qData = [];
        if (typeof course.examData === 'string') {
            try { qData = JSON.parse(course.examData) } catch (e) { }
        } else if (Array.isArray(course.examData)) {
            qData = course.examData;
        }
        setExamQuestions(qData);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const addExamQuestion = () => setExamQuestions([...examQuestions, { id: Date.now().toString(), text: '', options: ['', '', '', ''], answer: 0 }]);
    const removeExamQuestion = (id: string) => setExamQuestions(examQuestions.filter(q => q.id !== id));
    const updateExamQuestionText = (id: string, text: string) => setExamQuestions(examQuestions.map(q => q.id === id ? { ...q, text } : q));
    const updateExamOption = (id: string, index: number, value: string) => setExamQuestions(examQuestions.map(q => q.id === id ? { ...q, options: q.options.map((o, i) => i === index ? value : o) } : q));
    const setExamAnswer = (id: string, answer: number) => setExamQuestions(examQuestions.map(q => q.id === id ? { ...q, answer } : q));

    const deleteCourse = (id: any) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        const newCourses = savedCourses.filter(c => c.id !== id);
        localStorage.setItem('admin_lms_courses', JSON.stringify(newCourses));
        setSavedCourses(newCourses);
        if (lmsForm.id === id) resetCourseForm();
    }

    const safeModules = () => Array.isArray(lmsModules) ? lmsModules : [];
    const addModule = () => setLmsModules([...safeModules(), { id: Date.now().toString(), title: '', description: '', videoUrl: '' }]);
    const removeModule = (id: string) => setLmsModules(safeModules().filter(m => m.id !== id));
    const updateModule = (id: string, field: string, val: string) => setLmsModules(safeModules().map(m => m.id === id ? { ...m, [field]: val } : m));
    const moveModule = (index: number, direction: 'up' | 'down') => {
        const curr = safeModules();
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === curr.length - 1) return;
        const newMods = [...curr];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newMods[index], newMods[swapIndex]] = [newMods[swapIndex], newMods[index]];
        setLmsModules(newMods);
    }

    const updateQuote = async (quoteId: number, status: string) => {
        await api({ action: 'update_quote', user_id: user.id, quote_id: quoteId, status: status })
        loadData()
    }

    const deleteQuote = async (quoteId: number) => {
        if (!confirm("Are you sure you want to delete this quote request?")) return;
        const res = await api({ action: 'delete_quote', user_id: user.id, quote_id: quoteId })
        if (res.status === 'success') {
            loadData()
        } else {
            alert(res.message)
        }
    }

    const updateApp = async (appId: number, status: string) => {
        await api({ action: 'update_application_status', requester_id: user.id, app_id: appId, new_status: status, notes: '' })
        loadData()
    }

    const handleResetPassword = async () => {
        if (!resetForm.target_email || !resetForm.new_password) { alert('Please fill all fields'); return }
        if (resetForm.new_password.length < 6) { alert('Password must be at least 6 characters'); return }
        const targetUser = allUsers.find(u => u.email === resetForm.target_email)
        if (!targetUser) { alert('User not found'); return }
        setIsResetting(true)
        const res = await api({ action: 'admin_reset_password', admin_id: user.id, target_user_id: targetUser.id, new_password: resetForm.new_password })
        alert(res.message)
        setResetForm({ target_email: '', new_password: '' })
        setIsResetting(false)
    }

    const handlePostNews = async () => {
        if (!newsForm.title || !newsForm.description) { alert('Please fill all required news fields'); return }
        setIsPostingNews(true)
        const res = await api({ action: 'add_news', admin_id: user.id, ...newsForm })
        alert(res.message)
        setNewsForm({ title: '', description: '', type: 'General', iconStr: 'Bell' })
        setIsPostingNews(false)
        loadData()
    }

    const handleDeleteNews = async (id: number) => {
        if (!confirm("Delete this news announcement?")) return;
        await api({ action: 'delete_news', admin_id: user.id, id })
        loadData()
    }

    const filtered = allUsers.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    })

    if (loading && allUsers.length === 0) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>

    const roleColors: Record<string, string> = {
        admin: 'bg-red-500/20 text-red-500', manager: 'bg-blue-500/20 text-blue-500',
        employee: 'bg-purple-500/20 text-purple-500', customer: 'bg-green-500/20 text-green-500',
        instructor: 'bg-indigo-500/20 text-indigo-500',
    }

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <Shield className="text-red-500" size={24} />
                    <h2 className="text-2xl font-bold">Admin Panel</h2>
                </div>
                <button onClick={handleRefresh} disabled={refreshing} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all" title="Refresh data">
                    <RefreshCw size={18} className={refreshing ? 'animate-spin text-primary' : 'text-foreground/50'} />
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                    { label: 'Total Users', value: allUsers.length, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Customers', value: allUsers.filter(u => u.role === 'customer').length, color: 'from-green-500 to-emerald-500' },
                    { label: 'Employees', value: allUsers.filter(u => u.role === 'employee').length, color: 'from-purple-500 to-pink-500' },
                    { label: 'Instructors', value: allUsers.filter(u => u.role === 'instructor').length, color: 'from-indigo-500 to-violet-500' },
                    { label: 'Transactions', value: transactions.length, color: 'from-yellow-500 to-orange-500' },
                ].map(s => (
                    <div key={s.label} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-center">
                        <div className={`text-2xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
                        <div className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 flex-wrap">
                {([
                    { key: 'users', label: 'Users & Roles' },
                    { key: 'news', label: 'News & Announcements' },
                    { key: 'coins', label: 'Manage Coins' },
                    { key: 'bulk_upload', label: 'Bulk Upload' },
                    { key: 'reset_password', label: 'Reset Password' },
                    { key: 'applications', label: 'Applications' },
                    { key: 'quotes', label: 'Quotes' },
                    { key: 'lms_courses', label: 'LMS Courses' },
                    { key: 'user_logs', label: 'User Logs' },
                ] as const).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}>{t.label}</button>
                ))}
            </div>

            {tab === 'users' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground/50">Filter:</span>
                        {['all', 'admin', 'manager', 'employee', 'customer', 'instructor'].map(r => (
                            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${roleFilter === r ? 'bg-primary text-white shadow-md' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70'}`}>
                                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-foreground/50">{filtered.length} users found</p>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {filtered.map(u => (
                            <div key={u.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/30 transition-all">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold">{u.name || 'No name'}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${roleColors[u.role] || 'bg-gray-500/20 text-gray-500'}`}>{u.role}</span>
                                    </div>
                                    <p className="text-xs text-foreground/60 truncate">{u.email}</p>
                                    <p className="text-xs text-foreground/50 mt-1">Coins: <span className="font-bold text-yellow-600 dark:text-yellow-400">{u.coins}</span> · Joined: {formatDate(u.created_at)}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} className="h-9 px-2 rounded-lg bg-background border border-border text-sm font-semibold outline-none cursor-pointer">
                                        {['admin', 'manager', 'employee', 'customer', 'instructor'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                    </select>
                                    <button onClick={() => setEditingUser(u)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors" title="Edit User">
                                        <Edit2 size={16} />
                                    </button>
                                    {u.id !== user.id && (
                                        <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete User">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'news' && (
                <div className="space-y-6">
                    <div className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-border">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Upload className="text-primary" size={20} /> Post Announcement</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Announcement Title" className="w-full h-11 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                            <div className="flex gap-2">
                                <select value={newsForm.type} onChange={e => setNewsForm({ ...newsForm, type: e.target.value })} className="flex-1 h-11 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary">
                                    <option value="General">General</option>
                                    <option value="Product Launch">Product Launch</option>
                                    <option value="New Program">New Program</option>
                                    <option value="Expansion">Expansion</option>
                                    <option value="Event">Event</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Partnership">Partnership</option>
                                </select>
                                <select value={newsForm.iconStr} onChange={e => setNewsForm({ ...newsForm, iconStr: e.target.value })} className="h-11 px-4 rounded-xl bg-background border border-border outline-none focus:border-primary w-24">
                                    <option value="Bell">Bell</option>
                                    <option value="Zap">Zap</option>
                                    <option value="CheckCircle">Check</option>
                                </select>
                            </div>
                        </div>
                        <textarea value={newsForm.description} onChange={e => setNewsForm({ ...newsForm, description: e.target.value })} placeholder="Detailed description..." className="w-full h-24 p-4 rounded-xl bg-background border border-border outline-none focus:border-primary resize-none mb-4" />
                        <Button onClick={handlePostNews} disabled={isPostingNews} className="w-full sm:w-auto font-bold px-8">
                            {isPostingNews ? <Loader2 className="animate-spin" /> : 'Post Announcement'}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {news.map(n => (
                            <div key={n.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border flex justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold">{n.title}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase">{n.type}</span>
                                    </div>
                                    <p className="text-sm text-foreground/70">{n.description}</p>
                                    <p className="text-xs text-foreground/40 mt-2">{n.date}</p>
                                </div>
                                <button onClick={() => handleDeleteNews(n.id)} className="p-2 shrink-0 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {news.length === 0 && <p className="text-center text-foreground/50 py-8">No announcements posted yet.</p>}
                    </div>
                </div>
            )}

            {/* Editing User Modal inside users tab */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                        <h3 className="font-bold text-xl mb-4">Edit User</h3>
                        <div className="space-y-3">
                            <div><label className="text-xs text-foreground/70 font-semibold mb-1 block">Name</label>
                                <input value={editingUser.name || ''} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" /></div>
                            <div><label className="text-xs text-foreground/70 font-semibold mb-1 block">Email</label>
                                <input value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" /></div>
                            <div><label className="text-xs text-foreground/70 font-semibold mb-1 block">Company</label>
                                <input value={editingUser.company || ''} onChange={e => setEditingUser({ ...editingUser, company: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" /></div>
                            <div><label className="text-xs text-foreground/70 font-semibold mb-1 block">Position</label>
                                <input value={editingUser.position || ''} onChange={e => setEditingUser({ ...editingUser, position: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" /></div>
                            <div><label className="text-xs text-foreground/70 font-semibold mb-1 block">Coins</label>
                                <input type="number" value={editingUser.coins || 0} onChange={e => setEditingUser({ ...editingUser, coins: parseInt(e.target.value) })} className="w-full h-10 px-3 rounded-lg bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" /></div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-border mt-6">
                            <Button onClick={() => setEditingUser(null)} variant="outline" className="flex-1">Cancel</Button>
                            <Button onClick={saveUserEdit} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'bulk_upload' && (
                <div className="bg-background border border-border rounded-2xl p-6 space-y-5">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Upload className="text-primary" size={20} /> Bulk Upload Users (CSV)</h3>
                    <p className="text-sm text-foreground/60">Upload a <code className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded font-mono text-xs">.csv</code> file with <strong>name</strong> and <strong>email</strong> columns. A default password will be assigned to each user.</p>

                    {/* Sample format */}
                    <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl text-xs font-mono text-foreground/70 space-y-1">
                        <p className="font-bold text-foreground/90 text-sm mb-2">CSV Format:</p>
                        <p>name,email</p>
                        <p>John Doe,john@example.com</p>
                        <p>Jane Smith,jane@example.com</p>
                    </div>

                    {/* Actions row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <label className="flex-1 cursor-pointer">
                            <div className="h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-foreground/70">
                                <Upload size={16} />
                                {csvFileName || 'Choose CSV File'}
                            </div>
                            <input type="file" accept=".csv" onChange={handleCsvFile} className="hidden" />
                        </label>
                        <Button onClick={downloadCsvTemplate} variant="outline" className="h-11 px-6 rounded-xl font-semibold">
                            Download Template
                        </Button>
                    </div>

                    {/* Duplicate Warning */}
                    {csvDuplicates.length > 0 && (
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 space-y-2">
                            <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">⚠️ {csvDuplicates.length} duplicate email(s) detected:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {csvDuplicates.map(d => (
                                    <span key={d} className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-xs font-mono">{d}</span>
                                ))}
                            </div>
                            <button onClick={() => {
                                const existingEmails = new Set(allUsers.map(u => u.email?.toLowerCase()))
                                const seen = new Set<string>()
                                const deduped = csvUsers.filter(u => {
                                    const email = u.email.toLowerCase()
                                    if (seen.has(email) || existingEmails.has(email)) return false
                                    seen.add(email)
                                    return true
                                })
                                setCsvUsers(deduped)
                                setCsvDuplicates([])
                            }} className="text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:underline mt-1">
                                Click to remove all duplicates
                            </button>
                        </div>
                    )}

                    {/* Preview Table */}
                    {csvUsers.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-foreground/80">{csvUsers.length} users detected</p>
                                <button onClick={() => { setCsvUsers([]); setCsvFileName(''); setCsvDuplicates([]) }} className="text-xs text-red-500 hover:underline">Clear</button>
                            </div>
                            <div className="max-h-64 overflow-y-auto rounded-xl border border-border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-black/5 dark:bg-white/5 border-b border-border">
                                            <th className="text-left px-4 py-2.5 font-bold text-foreground/70 text-xs uppercase tracking-wider">#</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-foreground/70 text-xs uppercase tracking-wider">Name</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-foreground/70 text-xs uppercase tracking-wider">Email</th>
                                            <th className="text-left px-4 py-2.5 font-bold text-foreground/70 text-xs uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvUsers.map((u, i) => {
                                            const isDup = csvDuplicates.includes(u.email.toLowerCase())
                                            return (
                                                <tr key={i} className={`border-b border-border/50 ${isDup ? 'bg-red-500/5' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'}`}>
                                                    <td className="px-4 py-2 text-foreground/50 font-mono text-xs">{i + 1}</td>
                                                    <td className="px-4 py-2 font-semibold">{u.name}</td>
                                                    <td className="px-4 py-2 text-foreground/70">{u.email}</td>
                                                    <td className="px-4 py-2">
                                                        {isDup
                                                            ? <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 text-[10px] font-bold">DUPLICATE</span>
                                                            : <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 text-[10px] font-bold">OK</span>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <Button onClick={handleBulkUpload} disabled={isUploading || csvUsers.length === 0} className="w-full bg-primary text-black font-bold rounded-xl h-11">
                        {isUploading ? <><Loader2 className="animate-spin inline mr-2" size={16} />{uploadProgress || 'Uploading...'}</> : `Upload ${csvUsers.length} Users`}
                    </Button>

                    {uploadResult && (
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-sm font-semibold text-green-700 dark:text-green-400 flex items-center justify-between">
                            <span>✅ {uploadResult}</span>
                            <button onClick={() => setUploadResult('')} className="text-xs text-green-600 hover:underline ml-2">Dismiss</button>
                        </div>
                    )}
                </div>
            )}

            {tab === 'coins' && (
                <div className="space-y-6">
                    {/* Coin Management Form */}
                    <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Coins className="text-yellow-500" size={20} /> Add / Deduct Coins</h3>
                        <p className="text-sm text-foreground/60">Changes reflect immediately. A transaction record is automatically created.</p>
                        <input value={coinForm.target} onChange={e => setCoinForm({ ...coinForm, target: e.target.value })} placeholder="User email" className="w-full h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                        <div className="flex gap-3">
                            <input type="number" value={coinForm.amount} onChange={e => setCoinForm({ ...coinForm, amount: e.target.value })} placeholder="Amount" className="flex-1 h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                            <select value={coinForm.op} onChange={e => setCoinForm({ ...coinForm, op: e.target.value })} className="h-11 px-3 rounded-xl bg-background border border-border font-semibold">
                                <option value="add">Add</option>
                                <option value="deduct">Deduct</option>
                            </select>
                        </div>
                        <Button onClick={handleCoins} disabled={isManaging} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl h-11">
                            {isManaging ? <Loader2 className="animate-spin" /> : 'Update Coins'}
                        </Button>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-background border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Transaction History</h3>
                            <span className="text-xs text-foreground/50">{transactions.length} transactions</span>
                        </div>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {transactions.length === 0 && <p className="text-sm text-foreground/50">No transactions yet.</p>}
                            {transactions.map(t => {
                                const isSystemAdd = t.sender_id === null || t.sender_id === ''
                                const isSystemDeduct = t.receiver_id === null || t.receiver_id === ''
                                return (
                                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`p-2 rounded-full shrink-0 ${isSystemDeduct ? 'bg-red-500/10 text-red-500' : isSystemAdd ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {isSystemDeduct ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                            </div>
                                            <div className="min-w-0">
                                                {isSystemAdd ? (
                                                    <><p className="text-sm font-semibold">Admin added coins</p><p className="text-xs text-foreground/60 truncate">To: {t.receiver_name || t.receiver_email}</p></>
                                                ) : isSystemDeduct ? (
                                                    <><p className="text-sm font-semibold">Admin deducted coins</p><p className="text-xs text-foreground/60 truncate">From: {t.sender_name || t.sender_email}</p></>
                                                ) : (
                                                    <><p className="text-sm font-semibold">Peer Transfer</p><p className="text-xs text-foreground/60 truncate">{t.sender_name} → {t.receiver_name}</p></>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <p className={`font-bold ${isSystemDeduct ? 'text-red-500' : 'text-green-500'}`}>
                                                {isSystemDeduct ? '-' : '+'}{t.amount}
                                            </p>
                                            <p className="text-xs text-foreground/50">{formatDate(t.created_at)}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'reset_password' && (
                <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2"><KeyRound className="text-orange-500" size={20} /> Reset User Password</h3>
                    <p className="text-sm text-foreground/60">Reset a user&apos;s password. They will be prompted to change it on their next login.</p>
                    <input value={resetForm.target_email} onChange={e => setResetForm({ ...resetForm, target_email: e.target.value })} placeholder="User email" className="w-full h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                    <input type="text" value={resetForm.new_password} onChange={e => setResetForm({ ...resetForm, new_password: e.target.value })} placeholder="New temporary password (min 6 chars)" className="w-full h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border outline-none focus:border-primary" />
                    <Button onClick={handleResetPassword} disabled={isResetting} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl h-11">
                        {isResetting ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                    </Button>
                </div>
            )}

            {tab === 'applications' && (
                <div className="space-y-3">
                    {apps.length === 0 && <p className="text-sm text-foreground/50">No applications yet.</p>}
                    {apps.map(a => (
                        <div key={a.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <p className="font-semibold">{a.app_title}</p>
                                    <p className="text-xs text-foreground/60">{a.app_type} · by {a.user_name}</p>
                                </div>
                                <StatusBadge status={a.status} />
                            </div>
                            {a.description && <p className="text-sm text-foreground/60">{a.description}</p>}
                            {a.status !== 'completed' && a.status !== 'rejected' && (
                                <div className="flex gap-2 pt-2">
                                    <Button size="sm" onClick={() => updateApp(a.id, 'completed')} className="bg-green-600 text-white text-xs rounded-lg">Complete</Button>
                                    <Button size="sm" onClick={() => updateApp(a.id, 'rejected')} variant="outline" className="text-red-500 border-red-500/30 text-xs rounded-lg">Reject</Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'quotes' && (
                <div className="space-y-3">
                    {quotes.length === 0 && <p className="text-sm text-foreground/50">No quotes yet.</p>}
                    {quotes.map(q => (
                        <div key={q.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border space-y-2 relative">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <p className="font-bold text-base">{q.name} <span className="text-foreground/50 font-normal">({q.company})</span></p>
                                    <p className="text-sm text-primary font-semibold">{q.type} - <span className="text-foreground">{q.category}</span></p>
                                    <p className="text-xs text-foreground/60 mt-1">{q.email} | {q.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={q.status || 'pending'} />
                                    <button onClick={() => deleteQuote(q.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors ml-2" title="Delete Quote">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            {q.message && <div className="text-sm text-foreground/80 mt-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 whitespace-pre-wrap">{q.message}</div>}
                            <p className="text-[10px] text-foreground/40 mt-2 hover:opacity-100">{formatDate(q.created_at)}</p>

                            {q.status !== 'completed' && q.status !== 'rejected' && (
                                <div className="flex gap-2 pt-2 mt-2 border-t border-black/5 dark:border-white/5">
                                    <Button size="sm" onClick={() => updateQuote(q.id, 'completed')} className="bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg">Mark as Completed</Button>
                                    <Button size="sm" onClick={() => updateQuote(q.id, 'rejected')} variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10 text-xs rounded-lg">Reject</Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'lms_courses' && (
                <div className="space-y-6">
                    {/* Course Builder */}
                    <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                {lmsForm.id ? <Edit2 className="text-cyan-600" size={24} /> : <Upload className="text-cyan-600" size={24} />}
                                <h3 className="text-xl font-bold">{lmsForm.id ? 'Edit Course' : 'Create New Course'}</h3>
                            </div>
                            {lmsForm.id && (
                                <Button onClick={resetCourseForm} variant="outline" size="sm" className="h-8">Cancel Edit</Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-semibold mb-1 block">Course Title</label>
                                    <input value={lmsForm.title} onChange={e => setLmsForm({ ...lmsForm, title: e.target.value })} placeholder="e.g. Advanced Network Security" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-border outline-none focus:border-cyan-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold mb-1 block">Base Price (₹)</label>
                                        <input type="number" value={lmsForm.price} onChange={e => setLmsForm({ ...lmsForm, price: e.target.value })} placeholder="299.00" className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-border outline-none focus:border-cyan-500" />
                                    </div>
                                    <div className="flex items-end">
                                        <div className="w-full p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm font-mono text-cyan-700 dark:text-cyan-400 font-bold flex items-center justify-between">
                                            <span>Total Modules:</span> <span>{safeModules().length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-4">
                                    <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">Promotions & Discounts</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold mb-1 block">Discount %</label>
                                            <input type="number" value={lmsForm.discount} onChange={e => setLmsForm({ ...lmsForm, discount: e.target.value })} placeholder="e.g. 20" className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-border outline-none text-sm focus:border-emerald-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold mb-1 block">Coupon Code</label>
                                            <input value={lmsForm.coupon} onChange={e => setLmsForm({ ...lmsForm, coupon: e.target.value })} placeholder="SUMMER25" className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-border font-mono outline-none text-sm uppercase focus:border-emerald-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold flex items-center gap-2 text-sm">Final Assessment Exam</h4>
                                        <Button onClick={addExamQuestion} size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 h-8 gap-1 py-1"><Plus size={14} /> Add Question</Button>
                                    </div>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {examQuestions.length === 0 ? (
                                            <div className="text-center py-6 border-2 border-dashed border-border rounded-xl text-foreground/50 text-xs">
                                                No questions added yet. Add multiple choice questions to build the final exam.
                                            </div>
                                        ) : (
                                            examQuestions.map((q, qIndex) => (
                                                <div key={q.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border relative">
                                                    <button onClick={() => removeExamQuestion(q.id)} className="absolute top-3 right-3 text-foreground/30 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                                    <div className="pr-8 space-y-3">
                                                        <div>
                                                            <span className="text-xs font-bold text-foreground/50 mb-1 block">Question {qIndex + 1}</span>
                                                            <input value={q.text} onChange={e => updateExamQuestionText(q.id, e.target.value)} placeholder="Type question here..." className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-border outline-none text-sm focus:border-cyan-500" />
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {q.options.map((opt, oIndex) => (
                                                                <div key={oIndex} className={`flex items-center gap-2 p-2 rounded-lg border ${q.answer === oIndex ? 'border-cyan-500 bg-cyan-500/5' : 'border-border bg-white dark:bg-slate-900'}`}>
                                                                    <input type="radio" name={`answer-${q.id}`} checked={q.answer === oIndex} onChange={() => setExamAnswer(q.id, oIndex)} className="w-4 h-4 cursor-pointer accent-cyan-500 ml-1" />
                                                                    <input value={opt} onChange={e => updateExamOption(q.id, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} className="flex-1 bg-transparent border-none outline-none text-xs" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold flex items-center gap-2"><ListVideo size={18} className="text-primary" /> Modules & Videos</h4>
                                    <Button onClick={addModule} size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 h-8 gap-1"><Plus size={14} /> Add Module</Button>
                                </div>

                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {safeModules().length === 0 ? (
                                        <div className="text-center p-8 border-2 border-dashed border-border rounded-xl text-foreground/50 text-sm">
                                            No modules added yet. Click &apos;Add Module&apos; to start building your course.
                                        </div>
                                    ) : (
                                        (Array.isArray(lmsModules) ? lmsModules : []).map((mod, i) => (
                                            <div key={mod.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-border space-y-3 shadow-sm relative group animate-fade-in fade-in transition-all">
                                                <div className="flex gap-2">
                                                    <div className="flex flex-col gap-1 items-center justify-center pt-1 shrink-0">
                                                        <button onClick={() => moveModule(i, 'up')} disabled={i === 0} className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${i === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}><ChevronUp size={16} /></button>
                                                        <span className="text-xs font-bold text-foreground/40">{i + 1}</span>
                                                        <button onClick={() => moveModule(i, 'down')} disabled={i === safeModules().length - 1} className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${i === safeModules().length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}><ChevronDown size={16} /></button>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <input value={mod.title} onChange={e => updateModule(mod.id, 'title', e.target.value)} placeholder="Topic Title" className="w-full font-bold bg-transparent border-b border-border outline-none px-1 py-1 focus:border-primary text-sm" />
                                                        <input value={mod.description} onChange={e => updateModule(mod.id, 'description', e.target.value)} placeholder="Short Description" className="w-full bg-transparent border-b border-border outline-none px-1 py-1 focus:border-primary text-xs text-foreground/70" />
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Video size={14} className="text-blue-500 shrink-0" />
                                                            <input value={mod.videoUrl} onChange={e => updateModule(mod.id, 'videoUrl', e.target.value)} placeholder="Video URL (e.g. YouTube, Vimeo, MP4)" className="flex-1 bg-black/5 dark:bg-white/5 rounded-lg border-none outline-none px-2 py-1.5 focus:ring-1 focus:ring-primary text-xs font-mono" />
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeModule(mod.id)} className="p-2 shrink-0 self-start text-foreground/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="pt-4 mt-6">
                                    <Button
                                        onClick={handleSaveCourse}
                                        disabled={!lmsForm.title || !lmsForm.price || isSavingLms}
                                        className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-600/20"
                                    >
                                        {isSavingLms ? <Loader2 className="animate-spin mr-2" /> : (lmsForm.id ? <Edit2 className="mr-2" /> : <Upload className="mr-2" />)}
                                        {lmsForm.id ? 'Update Course & Exam' : 'Publish Course & Exam'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Published Courses Management */}
                    <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                        <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">Manage Uploaded Courses</h3>
                            <span className="text-sm font-semibold text-foreground/50">{savedCourses.length} Courses</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {savedCourses.length === 0 ? (
                                <p className="text-sm text-foreground/50 col-span-2 py-4">No courses uploaded yet. Create one above.</p>
                            ) : (
                                savedCourses.map(course => (
                                    <div key={course.id} className="p-4 rounded-xl bg-background border border-border shadow-sm flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-base line-clamp-1 flex-1 pr-2" title={course.title}>{course.title}</h4>
                                                <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded text-xs">₹{course.price}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-foreground/60 mb-4">
                                                <span className="flex items-center gap-1"><ListVideo size={12} /> {Array.isArray(course.modules) ? course.modules.length : course.modules || 0} Modules</span>
                                                {course.discount && <span className="text-orange-500 font-semibold">{course.discount}% OFF</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-3 border-t border-border">
                                            <Button onClick={() => editCourse(course)} variant="outline" size="sm" className="flex-1 h-8 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 border-blue-500/20"><Edit2 size={14} className="mr-1" /> Edit</Button>
                                            <Button onClick={() => deleteCourse(course.id)} variant="outline" size="sm" className="flex-1 h-8 bg-red-500/5 hover:bg-red-500/10 text-red-600 border-red-500/20"><Trash2 size={14} className="mr-1" /> Delete</Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'user_logs' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-cyan-500" size={20} />
                        <h3 className="font-bold text-lg">User Activity Logs</h3>
                        <span className="text-xs text-foreground/50 ml-auto">{activityStats.length} tracked users</span>
                    </div>

                    {/* Per-user activity stats */}
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {activityStats.length === 0 && <p className="text-sm text-foreground/50 text-center py-8">No activity recorded yet. Activity is tracked when logged-in users browse the site.</p>}
                        {activityStats.map((stat: any) => {
                            const totalMinutes = Math.round((stat.total_time_spent || 0) / 60)
                            const timeDisplay = totalMinutes >= 60
                                ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                                : `${totalMinutes}m`
                            return (
                                <div key={stat.user_id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border hover:border-primary/30 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-bold text-base">{stat.user_name || 'Unknown User'}</p>
                                            <p className="text-xs text-foreground/60 truncate">{stat.user_email}</p>
                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap text-xs">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                                                <Globe size={12} />
                                                {stat.total_visits} visits
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">
                                                <Clock size={12} />
                                                {timeDisplay}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 font-semibold">
                                                <Monitor size={12} />
                                                {stat.devices || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-2 text-xs text-foreground/60">
                                        <div className="truncate">
                                            <span className="font-semibold text-foreground/80">Pages:</span>{' '}
                                            {(stat.pages_visited || '').split(', ').slice(0, 6).join(', ')}
                                            {(stat.pages_visited || '').split(', ').length > 6 && ' ...'}
                                        </div>
                                        <div className="shrink-0">
                                            <span className="font-semibold text-foreground/80">Last:</span> {formatDate(stat.last_activity)}
                                        </div>
                                    </div>
                                    <div className="mt-1 text-[10px] text-foreground/40">
                                        Browser: {stat.browsers || 'N/A'}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Live Activity Feed */}
                    {activityFeed.length > 0 && (
                        <div className="bg-background border border-border rounded-2xl p-5">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Recent Activity Feed
                            </h4>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {activityFeed.map((log: any, i: number) => (
                                    <div key={log.id || i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                                {(log.user_name || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-semibold">{log.user_name || 'Unknown'}</span>
                                                <span className="text-foreground/50 mx-1.5">visited</span>
                                                <span className="text-primary font-mono text-xs">{log.page}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-foreground/40 shrink-0 ml-3 flex items-center gap-2">
                                            {log.time_spent > 0 && <span>{log.time_spent}s</span>}
                                            <span>{log.device}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
