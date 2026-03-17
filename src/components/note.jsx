import { 
  Plus, 
  Search, 
  Trash2, 
  Hash, 
  Bookmark, 
  CheckCircle2, 
  Calendar,
  X,
  Edit3,
  FileText,
  LayoutDashboard,
  Settings as SettingsIcon,
  Star,
  Bell,
  MoreVertical,
  Layers,
  Circle,
  Briefcase,
  User,
  Lightbulb,
  AlertTriangle,
  FolderPlus,
  ArrowUpRight,
  LogOut,
  LayoutGrid,
  List as ListIcon,
  UserCircle,
  Clock,
  ExternalLink,
  Save,
  Moon,
  Type
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const CATEGORIES = [
    { name: "General", icon: <Hash size={16} />, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { name: "Work", icon: <Briefcase size={16} />, color: "bg-slate-50 text-slate-600 border-slate-200" },
    { name: "Personal", icon: <User size={16} />, color: "bg-green-50 text-green-600 border-green-100" },
    { name: "Ideas", icon: <Lightbulb size={16} />, color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
    { name: "Urgent", icon: <AlertTriangle size={16} />, color: "bg-pink-50 text-pink-600 border-pink-100" },
];

const Note = () => {
    // --- STATE ---
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("minisaas_v2");
        if (saved) return JSON.parse(saved);
        
        // Default sample notes
        return [
            {
                id: 1,
                title: "Welcome to MiniSaaS",
                content: "This is your new professional workspace. You can organize thoughts, pin important items, and track your ideas with ease.",
                category: "General",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastEdited: new Date().toISOString(),
                favorite: true,
                completed: false,
                pinned: true
            },
            {
                id: 2,
                title: "Quarterly OKRs",
                content: "1. Increase user retention by 15%\n2. Launch the new Multi-page dashboard\n3. Optimize the CSS bundle size",
                category: "Work",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastEdited: new Date(Date.now() - 86400000).toISOString(),
                favorite: false,
                completed: false,
                pinned: false
            },
            {
                id: 3,
                title: "Grocery List",
                content: "- Almond milk\n- Avocados\n- Whole wheat bread\n- Organic eggs",
                category: "Personal",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastEdited: new Date(Date.now() - 172800000).toISOString(),
                favorite: false,
                completed: true,
                pinned: false
            },
            {
                id: 4,
                title: "App Feature Ideas",
                content: "What if we added a collaborative markdown editor? We could use WebSockets to sync cursor positions in real-time.",
                category: "Ideas",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastEdited: new Date(Date.now() - 259200000).toISOString(),
                favorite: true,
                completed: false,
                pinned: false
            },
            {
                id: 5,
                title: "Server Migration",
                content: "CRITICAL: The legacy database server is running out of space. Need to migrate to the new AWS cluster by Friday.",
                category: "Urgent",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastEdited: new Date(Date.now() - 345600000).toISOString(),
                favorite: false,
                completed: false,
                pinned: true
            }
        ];
    });
    
    // UI State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activePage, setActivePage] = useState("Dashboard"); // Dashboard, All Notes, Favorites, Settings
    const [filterCategory, setFilterCategory] = useState("All");
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");

    // Profile State (Persistent)
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem("minisaas_profile");
        return saved ? JSON.parse(saved) : {
            name: "Julian Stone",
            email: "julian@saas.com",
            avatar: "JS",
            darkMode: false,
            fontSize: "Medium",
            layout: "Grid"
        };
    });

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem("minisaas_v2", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("minisaas_profile", JSON.stringify(profile));
    }, [profile]);

    // --- HANDLERS ---
    const handleSave = (e) => {
        if (e) e.preventDefault();
        if (!title.trim()) return;

        if (editingNote) {
            setTasks(tasks.map(t => t.id === editingNote.id ? { ...t, title, content, category, lastEdited: new Date().toISOString() } : t));
        } else {
            const newNote = {
                id: Date.now(),
                title,
                content,
                category,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastEdited: new Date().toISOString(),
                favorite: activePage === "Favorites",
                completed: false,
                pinned: false
            };
            setTasks([newNote, ...tasks]);
        }

        closeEditor();
    };

    const openEditor = (note = null) => {
        if (note) {
            setEditingNote(note);
            setTitle(note.title);
            setContent(note.content);
            setCategory(note.category || "General");
        } else {
            setEditingNote(null);
            setTitle("");
            setContent("");
            setCategory("General");
        }
        setIsEditorOpen(true);
        setIsFabOpen(false);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        setEditingNote(null);
        setTitle("");
        setContent("");
    };

    const handleDelete = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const toggleFavorite = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const togglePin = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
    };

    // --- COMPUTED ---
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return new Date(b.lastEdited) - new Date(a.lastEdited);
        });
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return sortedTasks.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 t.content.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = filterCategory === "All" || t.category === filterCategory;
            
            if (activePage === "Favorites") return t.favorite && matchesSearch;
            if (activePage === "Dashboard") return false; // Dashboard has its own display
            
            return matchesSearch && matchesCategory;
        });
    }, [sortedTasks, searchQuery, filterCategory, activePage]);

    const recentNotes = useMemo(() => tasks.slice(0, 5), [tasks]);
    const favoriteCount = useMemo(() => tasks.filter(t => t.favorite).length, [tasks]);
    const categoryCount = useMemo(() => new Set(tasks.map(t => t.category)).size, [tasks]);

    // --- RENDER HELPERS ---
    const NoteCard = ({ task, index }) => (
        <div 
            onClick={() => openEditor(task)}
            className={`group p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer relative shadow-sm hover:shadow-xl hover:-translate-y-1 ${profile.darkMode ? 'bg-slate-900 border-slate-800' : (CATEGORIES.find(c => c.name === task.category)?.color || 'bg-white border-slate-100')}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-slate-800 shadow-sm border border-slate-50">
                        {index + 1}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                        {task.category}
                    </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={(e) => { e.stopPropagation(); togglePin(task.id); }} className={`p-1.5 rounded-lg transition-colors ${task.pinned ? 'text-indigo-600 bg-indigo-50' : (profile.darkMode ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-50')}`}>
                        <Bookmark size={14} fill={task.pinned ? "currentColor" : "none"}/></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(task.id); }} className={`p-1.5 rounded-lg transition-colors ${task.favorite ? 'text-amber-400 bg-amber-50' : (profile.darkMode ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-300 hover:bg-slate-50')}`}><Star size={14} fill={task.favorite ? "currentColor" : "none"}/></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} className={`p-1.5 rounded-lg transition-colors ${profile.darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-950/30' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}><Trash2 size={14}/></button>
                </div>
            </div>
            
            <h3 className={`text-xl font-black mb-3 leading-tight uppercase tracking-tight transition-colors ${task.completed ? (profile.darkMode ? 'text-slate-700 line-through' : 'text-slate-300 line-through') : (profile.darkMode ? 'text-white' : 'text-slate-800')}`}>
                {task.title}
            </h3>
            <p className={`text-sm font-medium leading-relaxed mb-10 line-clamp-3 transition-colors ${profile.darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {task.content || "No description provided..."}
            </p>
            
            <div className={`flex items-center justify-between pt-4 border-t ${profile.darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest transition-colors ${profile.darkMode ? 'text-slate-500' : 'text-slate-300'}`}>
                    <Calendar size={12} />
                    <span>{task.date}</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-50 text-slate-200 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                    <CheckCircle2 size={16} />
                </button>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Notes", value: tasks.length, icon: <FileText className="text-blue-500" />, bg: profile.darkMode ? "bg-blue-950/30 border-blue-900/50" : "bg-blue-50 border-white" },
                    { label: "Favorites", value: favoriteCount, icon: <Star className="text-amber-500" fill="currentColor" />, bg: profile.darkMode ? "bg-amber-950/30 border-amber-900/50" : "bg-amber-50 border-white" },
                    { label: "Categories", value: categoryCount, icon: <Layers className="text-indigo-500" />, bg: profile.darkMode ? "bg-indigo-950/30 border-indigo-900/50" : "bg-indigo-50 border-white" },
                    { label: "Last Activity", value: tasks.length > 0 ? "Today" : "None", icon: <Clock className="text-green-500" />, bg: profile.darkMode ? "bg-green-950/30 border-green-900/50" : "bg-green-50 border-white" },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} p-6 rounded-[1.5rem] border flex items-center gap-6 shadow-sm transition-all duration-500`}>
                        <div className={`p-3 rounded-2xl shadow-sm ${profile.darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>{stat.icon}</div>
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${profile.darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                            <h3 className={`text-2xl font-black ${profile.darkMode ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Notes */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Knowledge</h3>
                        <button onClick={() => setActivePage("All Notes")} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowUpRight size={14}/></button>
                    </div>
                    <div className="space-y-4">
                        {recentNotes.length === 0 ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-12 text-center">
                                <p className="text-slate-400 text-sm font-bold">Your workspace is waiting for ideas...</p>
                            </div>
                        ) : (
                            recentNotes.map(n => (
                                <div key={n.id} onClick={() => openEditor(n)} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-100 transition-all cursor-pointer shadow-sm group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors`}>
                                            {CATEGORIES.find(c => c.name === n.category)?.icon || <Hash size={18}/>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{n.title}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{n.category} • {n.date}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={18} className="text-slate-200 group-hover:text-indigo-400" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => openEditor()} className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-sm flex items-center gap-4 hover:bg-slate-800 transition-all shadow-lg shadow-indigo-100"><Plus size={20}/> New Note</button>
                        <button className="w-full bg-white text-slate-600 border border-slate-100 p-5 rounded-2xl font-black text-sm flex items-center gap-4 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"><FolderPlus size={20}/> Create Folder</button>
                        <button className="w-full bg-white text-slate-600 border border-slate-100 p-5 rounded-2xl font-black text-sm flex items-center gap-4 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"><ExternalLink size={20}/> Import Notes</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFavorites = () => (
        <div className="animate-in fade-in duration-500">
            {tasks.filter(t => t.favorite).length === 0 ? (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mb-6">
                        <Star size={40} className="text-amber-400" fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">You haven’t added any favorite notes yet.</h3>
                    <p className="text-slate-400 font-medium mt-2 max-w-sm">Star important notes to access them quickly here.</p>
                    <button 
                        onClick={() => setActivePage("All Notes")}
                        className="mt-8 bg-[#1E3A8A] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/10 hover:scale-105 active:scale-95 transition-all"
                    >
                        Go to Notes
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tasks.filter(t => t.favorite).map((task, idx) => (
                        <NoteCard key={task.id} task={task} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Profile Section */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-100 ring-8 ring-indigo-50">
                    {profile.avatar}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                        <div>
                            <h3 className="text-3xl font-black text-slate-800">{profile.name}</h3>
                            <p className="text-slate-400 font-bold">{profile.email}</p>
                        </div>
                        <button className="px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all">Edit Profile</button>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">Pro Plan</span>
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">Joined Mar 2026</span>
                    </div>
                </div>
            </div>

            {/* Config Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Preferences */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <Layers size={20} className="text-[#1E3A8A]" />
                        <h4 className="font-black text-lg text-slate-800">Preferences</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <Moon size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-600">Dark Mode</span>
                            </div>
                            <button onClick={() => setProfile({...profile, darkMode: !profile.darkMode})} className={`w-12 h-6 rounded-full transition-all relative ${profile.darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.darkMode ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <Type size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-600">Font Size</span>
                            </div>
                            <select className="bg-transparent text-sm font-black text-indigo-600 outline-none">
                                <option>Small</option>
                                <option selected>Medium</option>
                                <option>Large</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-600">Note Layout</span>
                            </div>
                            <div className="flex bg-white p-1 rounded-xl shadow-inner">
                                <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><LayoutGrid size={16}/></button>
                                <button className="p-2 rounded-lg text-slate-300"><ListIcon size={16}/></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Storage & Account */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <Save size={20} className="text-[#1E3A8A]" />
                            <h4 className="font-black text-lg text-slate-800">Storage</h4>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                                    <span>Local Storage Usage</span>
                                    <span>24%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full">
                                    <div className="h-full bg-indigo-600 rounded-full w-[24%]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-600">Total System Entries</span>
                                <span className="font-black text-indigo-600">{tasks.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-red-50 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <LogOut size={20} className="text-red-500" />
                            <h4 className="font-black text-lg text-slate-800">Account Access</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex-1 p-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Export JSON</button>
                            <button className="flex-1 p-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Delete Everything</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`flex h-screen overflow-hidden transition-all duration-500 ${profile.darkMode ? 'bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Professional Sidebar */}
            <aside className={`fixed inset-y-0 left-0 lg:static w-72 sidebar-gradient text-white flex flex-col z-50 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 pb-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 overflow-hidden">
                            <img src="./logo.png" alt="KeepNote Logo" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter">KeepNote</h1>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Add Your Task</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="space-y-1">
                        <label className="px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 block">Navigation</label>
                        {[
                            { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
                            { name: "All Notes", icon: <FileText size={18} /> },
                            { name: "Favorites", icon: <Star size={18} /> },
                            { name: "Settings", icon: <SettingsIcon size={18} /> }
                        ].map(item => (
                            <button 
                                key={item.name}
                                onClick={() => { setActivePage(item.name); setFilterCategory("All"); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${activePage === item.name ? (profile.darkMode ? 'bg-white/10 text-white shadow-lg' : 'bg-white/10 text-white shadow-lg') : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className={`${activePage === item.name ? 'text-indigo-400' : 'text-white/20 group-hover:text-white/40'}`}>
                                    {item.icon}
                                </span>
                                <span className="flex-1 text-left">{item.name}</span>
                                {item.name === "Favorites" && favoriteCount > 0 && (
                                    <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-md">{favoriteCount}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-1">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <label className={`text-[10px] font-black uppercase tracking-[0.3em] block ${profile.darkMode ? 'text-white/20' : 'text-white/40'}`}>Collections</label>
                            <Plus size={14} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                        </div>
                        <div className="space-y-1 px-2">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.name}
                                    onClick={() => { setActivePage("All Notes"); setFilterCategory(cat.name); setIsSidebarOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all group ${filterCategory === cat.name ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`transition-colors ${filterCategory === cat.name ? 'text-indigo-400' : 'text-white/20 group-hover:text-white/40'}`}>{cat.icon}</span>
                                        {cat.name}
                                    </div>
                                    <span className="opacity-0 group-hover:opacity-100 text-[8px] bg-white/10 px-1.5 py-0.5 rounded-md transition-all">
                                        {tasks.filter(t => t.category === cat.name).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-6">
                    <div className="bg-white/5 rounded-3xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-black text-white text-sm shadow-xl shadow-black/20">
                            {profile.avatar}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black truncate">{profile.name}</p>
                            <p className="text-[10px] text-white/30 font-bold truncate">Premium Member</p>
                        </div>
                        <ArrowUpRight size={14} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <main className={`flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden ${profile.darkMode ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
                {/* Professional Header */}
                <header className={`h-20 lg:h-24 backdrop-blur-md border-b px-6 lg:px-12 flex items-center justify-between sticky top-0 z-20 transition-all duration-500 ${profile.darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
                    <div className="flex items-center gap-4 lg:gap-8 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <LayoutDashboard size={20} />
                        </button>
                        <div className="relative w-full max-w-xl group">
                            <Search className={`absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[#6366F1] ${profile.darkMode ? 'text-slate-500' : 'text-slate-300'}`} />
                            <input
                                type="text"
                                placeholder="Search folders, notes..."
                                className={`w-full bg-slate-50/50 border border-transparent focus:border-[#6366F1]/30 focus:bg-white rounded-2xl py-2.5 lg:py-3.5 pl-12 lg:pl-14 pr-6 outline-none text-sm font-bold transition-all placeholder:text-slate-300 ${profile.darkMode ? 'bg-slate-900/50 text-white' : ''}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 lg:gap-6">
                        <button className="hidden sm:flex p-3 text-slate-400 hover:bg-slate-50 rounded-2xl relative transition-all active:scale-95"><Bell size={20} /><div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></div></button>
                        <div className="hidden sm:block h-8 w-px bg-slate-100"></div>
                        <button 
                            onClick={() => openEditor()}
                            className="bg-[#1E3A8A] text-white p-2.5 lg:px-8 lg:py-3.5 rounded-xl lg:rounded-2xl flex items-center gap-2 text-sm font-black shadow-2xl shadow-blue-900/10 hover:bg-slate-800 active:scale-95 transition-all"
                        >
                            <Plus size={18} /> <span className="hidden lg:inline">Create New</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                            <div>
                                <h2 className={`text-4xl font-black tracking-tight flex items-center gap-4 ${profile.darkMode ? 'text-white' : 'text-[#1F2937]'}`}>
                                    {activePage === "Dashboard" ? "Your Tasks" : activePage} 
                                    {filterCategory !== "All" && <span className="text-indigo-300">/ {filterCategory}</span>}
                                </h2>
                                <p className="text-[#6B7280] font-bold mt-2 uppercase text-[11px] tracking-widest">{activePage === "Dashboard" ? "Manage and view your collection" : `Browsing through ${filteredTasks.length} results`}</p>
                            </div>
                            {activePage === "All Notes" && (
                                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                                    <button className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest">Grid View</button>
                                    <button className="px-4 py-2 rounded-xl text-slate-300 text-xs font-black uppercase tracking-widest hover:text-slate-500 transition-all">List View</button>
                                </div>
                            )}
                        </div>

                        {/* Page Content */}
                        {activePage === "Dashboard" && renderDashboard()}
                        {activePage === "Favorites" && renderFavorites()}
                        {activePage === "Settings" && renderSettings()}
                        {activePage === "All Notes" && (
                            filteredTasks.length === 0 ? (
                                <div className="h-[40vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                                        <Hash size={40} className="text-slate-100" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800">No notes found in {filterCategory}</h3>
                                    <button onClick={() => openEditor()} className="mt-6 text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:underline decoration-2">Create Note Now &rarr;</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {filteredTasks.map((task, idx) => (
                                        <NoteCard key={task.id} task={task} index={idx} />
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>

            {/* Fab Expansion */}
            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-40">
                {isFabOpen && (
                    <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-4 duration-300">
                        <button className="bg-white text-slate-700 px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                            <FolderPlus size={16} className="text-[#1E3A8A]"/> New Folder
                        </button>
                        <button onClick={() => openEditor()} className="bg-white text-slate-700 px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                            <FileText size={16} className="text-[#6366F1]"/> New Note
                        </button>
                    </div>
                )}
                <button 
                    onClick={() => setIsFabOpen(!isFabOpen)}
                    className="w-16 h-16 bg-[#1E3A8A] text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/30 hover:scale-110 active:scale-95 transition-all group"
                >
                    <Plus size={32} className={`transition-transform duration-500 ${isFabOpen ? 'rotate-45' : ''}`} />
                </button>
            </div>

            {/* Editor Modal */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className={`absolute inset-0 backdrop-blur-md animate-in fade-in duration-300 ${profile.darkMode ? 'bg-black/60' : 'bg-[#172554]/40'}`} onClick={closeEditor}></div>
                    <div className={`w-full max-w-3xl rounded-[3rem] shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom-12 duration-500 flex flex-col max-h-[90vh] border ${profile.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-transparent'}`}>
                        <div className="p-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${profile.darkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><Edit3 size={24}/></div>
                                    <div>
                                        <h3 className={`font-black text-2xl leading-none mb-1 ${profile.darkMode ? 'text-white' : 'text-[#1F2937]'}`}>{editingNote ? 'Edit Workspace' : 'New Entry'}</h3>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${profile.darkMode ? 'text-slate-500' : 'text-[#6B7280]'}`}>{editingNote ? 'Updating Knowledge' : 'Active Draft / General'}</p>
                                    </div>
                                </div>
                                <button onClick={closeEditor} className={`p-4 rounded-2xl transition-all ${profile.darkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-50 text-slate-300'}`}><X size={20}/></button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 flex flex-col gap-8">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${profile.darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Knowledge Branch</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button 
                                                key={cat.name}
                                                type="button"
                                                onClick={() => setCategory(cat.name)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all border-2 ${category === cat.name ? (profile.darkMode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#1E3A8A] border-[#1E3A8A] text-white') : (profile.darkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100')}`}
                                            >
                                                {cat.icon} {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8 flex-1">
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        placeholder="Note Identity..."
                                        className={`w-full text-5xl font-black outline-none placeholder:opacity-20 transition-all ${profile.darkMode ? 'bg-transparent text-white placeholder:text-slate-300' : 'bg-transparent text-slate-800 placeholder:text-slate-400'}`}
                                        autoFocus
                                    />
                                    <div className="w-12 h-1 bg-indigo-500 rounded-full"></div>
                                    <textarea 
                                        value={content} 
                                        onChange={(e) => setContent(e.target.value)} 
                                        placeholder="Infuse your digital knowledge here..."
                                        className={`w-full text-xl font-medium outline-none resize-none flex-1 leading-relaxed placeholder:opacity-20 handwriting ${profile.darkMode ? 'bg-transparent text-slate-300' : 'bg-transparent text-slate-600'}`}
                                    />
                                </div>
                            </form>

                            <div className="flex items-center justify-end gap-6 mt-6 pt-10 border-t border-slate-50">
                                <button onClick={closeEditor} className="text-slate-300 font-black uppercase text-[10px] tracking-[0.2em] px-6 hover:text-slate-800 transition-colors">Discard</button>
                                <button 
                                    onClick={handleSave}
                                    className="bg-[#1E3A8A] text-white px-12 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    {editingNote ? 'Sync Changes' : 'Commit Entry'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                .animate-in { animation: 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .fade-in { animation-name: fade-in; }
                .slide-in-from-bottom-12 { animation-name: slide-in-up; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            `}} />
        </div>
    );
};

export default Note;