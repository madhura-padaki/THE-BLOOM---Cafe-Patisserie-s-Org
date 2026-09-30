import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Lock,
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  Image,
  Clock,
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Calendar,
  Save,
  Users,
  Database,
  Copy,
  RefreshCw,
  Check,
  ExternalLink,
} from 'lucide-react';
import {
  Reservation,
  MenuItem,
  GalleryItem,
  BusinessDayHours,
  SpecialClosure,
  CafeSettings,
  BookingStatus,
} from '../types/index.ts';
import {
  adminLogin,
  fetchReservations,
  updateReservationStatus,
  createReservation,
  fetchMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchGallery,
  addGalleryItem,
  deleteGalleryItem,
  fetchBusinessHours,
  updateBusinessHours,
  addSpecialClosure,
  removeSpecialClosure,
  fetchSettings,
  updateSettings,
} from '../services/api.ts';
import {
  fetchSupabaseStatus,
  syncAllReservationsToSupabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SQL_EDITOR_URL,
  SUPABASE_TABLE_EDITOR_URL,
} from '../services/supabase.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'reservations' | 'calendar' | 'menu' | 'gallery' | 'hours' | 'settings' | 'supabase'
  >('dashboard');

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    tableExists: boolean;
    tableFound?: string;
    projectId: string;
    error?: string;
    sqlSetupScript: string;
  } | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState<boolean>(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [supabaseSyncMessage, setSupabaseSyncMessage] = useState<string | null>(null);

  // Admin Data State
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resFilterStatus, setResFilterStatus] = useState<string>('All');
  const [resSearchQuery, setResSearchQuery] = useState<string>('');
  const [selectedResForEdit, setSelectedResForEdit] = useState<Reservation | null>(null);

  // New reservation modal
  const [showAddResModal, setShowAddResModal] = useState<boolean>(false);
  const [newResData, setNewResData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00 PM',
    guests: 2,
    seatingPreference: 'Indoor' as const,
    occasion: 'None' as const,
    specialRequests: '',
  });

  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState<boolean>(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Desserts',
    isVegetarian: true,
    isBestseller: false,
    isSeasonal: false,
    isSignature: false,
    image: '',
  });

  // Gallery State
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isAddingGallery, setIsAddingGallery] = useState<boolean>(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Moments' as const,
    image: '',
    caption: '',
  });

  // Hours State
  const [hours, setHours] = useState<Record<string, BusinessDayHours>>({});
  const [closures, setClosures] = useState<SpecialClosure[]>([]);
  const [newClosureDate, setNewClosureDate] = useState<string>('');
  const [newClosureReason, setNewClosureReason] = useState<string>('');

  // Settings State
  const [settings, setSettings] = useState<CafeSettings | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Load all admin data once authenticated
  const loadAdminData = async () => {
    try {
      const [resList, menuData, galData, hoursData, settingsData, supaStatus] = await Promise.allSettled([
        fetchReservations(),
        fetchMenu(),
        fetchGallery(),
        fetchBusinessHours(),
        fetchSettings(),
        fetchSupabaseStatus(),
      ]);

      if (resList.status === 'fulfilled') setReservations(resList.value);
      if (menuData.status === 'fulfilled') {
        setMenuItems(menuData.value.items);
        setCategories(menuData.value.categories);
      }
      if (galData.status === 'fulfilled') setGallery(galData.value);
      if (hoursData.status === 'fulfilled') {
        setHours(hoursData.value.hours);
        setClosures(hoursData.value.closures);
      }
      if (settingsData.status === 'fulfilled') setSettings(settingsData.value);
      if (supaStatus.status === 'fulfilled') setSupabaseStatus(supaStatus.value);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  const handleCheckSupabase = async () => {
    setIsCheckingSupabase(true);
    setSupabaseSyncMessage(null);
    try {
      const status = await fetchSupabaseStatus();
      setSupabaseStatus(status);
      if (status.tableExists) {
        setSupabaseSyncMessage(`Connection verified! Found table '${status.tableFound}' in Supabase.`);
      } else {
        setSupabaseSyncMessage(`Connected to Supabase, but table 'reservations' was not found yet. Run the SQL script below in your Supabase SQL Editor.`);
      }
    } catch (err: any) {
      setSupabaseSyncMessage(`Error checking Supabase: ${err.message}`);
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  const handleSyncAllToSupabase = async () => {
    setIsSyncingSupabase(true);
    setSupabaseSyncMessage(null);
    try {
      const result = await syncAllReservationsToSupabase();
      if (result.synced > 0) {
        setSupabaseSyncMessage(`Successfully synced ${result.synced} of ${result.total} reservations to Supabase!`);
      } else if (result.failed > 0) {
        setSupabaseSyncMessage(`Could not sync to Supabase (${result.results[0]?.error || 'Table not found'}). Ensure table 'reservations' is created using the SQL script.`);
      } else {
        setSupabaseSyncMessage('No reservations to sync.');
      }
    } catch (err: any) {
      setSupabaseSyncMessage(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleCopySql = () => {
    if (supabaseStatus?.sqlSetupScript) {
      navigator.clipboard.writeText(supabaseStatus.sqlSetupScript);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await adminLogin(password);
      if (res.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid password. (Hint: default is "bloom")');
      }
    } catch (err: any) {
      setLoginError('Login request failed.');
    }
  };

  // Dashboard Metrics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = reservations.filter((r) => r.date === today);
    const upcomingBookings = reservations.filter(
      (r) => r.date >= today && r.status === 'Confirmed'
    );
    const pending = reservations.filter((r) => r.status === 'Pending');
    const confirmed = reservations.filter((r) => r.status === 'Confirmed');
    const cancelled = reservations.filter((r) => r.status === 'Cancelled');
    const completed = reservations.filter((r) => r.status === 'Completed');
    const noShow = reservations.filter((r) => r.status === 'No-show');

    return {
      todayCount: todayBookings.length,
      upcomingCount: upcomingBookings.length,
      pendingCount: pending.length,
      confirmedCount: confirmed.length,
      cancelledCount: cancelled.length,
      completedCount: completed.length,
      noShowCount: noShow.length,
    };
  }, [reservations]);

  // Reservation Status Change
  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      const updated = await updateReservationStatus(id, newStatus);
      setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      onRefreshData?.();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Create Manual Walk-in / Phone Reservation
  const handleCreateManualReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createReservation(newResData);
      if (res.success && res.reservation) {
        setReservations((prev) => [res.reservation!, ...prev]);
        setShowAddResModal(false);
        setNewResData({
          customerName: '',
          phone: '',
          email: '',
          date: new Date().toISOString().split('T')[0],
          time: '12:00 PM',
          guests: 2,
          seatingPreference: 'Indoor',
          occasion: 'None',
          specialRequests: '',
        });
        onRefreshData?.();
      } else {
        alert(res.error || 'Failed to create reservation');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating reservation');
    }
  };

  // Menu Handlers
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMenuItem) {
        const updated = await updateMenuItem(editingMenuItem.id, menuForm);
        setMenuItems((prev) => prev.map((m) => (m.id === editingMenuItem.id ? updated : m)));
        setEditingMenuItem(null);
      } else {
        const created = await addMenuItem(menuForm);
        setMenuItems((prev) => [...prev, created]);
        setIsAddingMenuItem(false);
      }
      setMenuForm({
        name: '',
        description: '',
        price: '',
        category: 'Desserts',
        isVegetarian: true,
        isBestseller: false,
        isSeasonal: false,
        isSignature: false,
        image: '',
      });
      onRefreshData?.();
    } catch (err) {
      console.error('Menu save error', err);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
      onRefreshData?.();
    } catch (err) {
      console.error('Delete menu item error', err);
    }
  };

  // Gallery Handlers
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await addGalleryItem(galleryForm);
      setGallery((prev) => [...prev, created]);
      setIsAddingGallery(false);
      setGalleryForm({
        title: '',
        category: 'Moments',
        image: '',
        caption: '',
      });
      onRefreshData?.();
    } catch (err) {
      console.error('Gallery save error', err);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery photo?')) return;
    try {
      await deleteGalleryItem(id);
      setGallery((prev) => prev.filter((g) => g.id !== id));
      onRefreshData?.();
    } catch (err) {
      console.error('Delete gallery error', err);
    }
  };

  // Hours Handlers
  const handleUpdateDayHours = (day: string, field: string, val: any) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: val,
      },
    }));
  };

  const handleSaveHours = async () => {
    try {
      await updateBusinessHours(hours);
      setSaveSuccessMsg('Business hours updated successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      onRefreshData?.();
    } catch (err) {
      console.error('Save hours error', err);
    }
  };

  const handleAddClosure = async () => {
    if (!newClosureDate) return;
    try {
      const created = await addSpecialClosure({
        date: newClosureDate,
        reason: newClosureReason || 'Special Holiday Closure',
        isClosed: true,
      });
      setClosures((prev) => [...prev, created]);
      setNewClosureDate('');
      setNewClosureReason('');
      onRefreshData?.();
    } catch (err) {
      console.error('Closure error', err);
    }
  };

  const handleRemoveClosure = async (id: string) => {
    try {
      await removeSpecialClosure(id);
      setClosures((prev) => prev.filter((c) => c.id !== id));
      onRefreshData?.();
    } catch (err) {
      console.error('Remove closure error', err);
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSaveSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      onRefreshData?.();
    } catch (err) {
      console.error('Settings save error', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F8F4EC] rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl border border-[#D8C8B4] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#304A3A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-medium tracking-wide">
              THE BLOOM · Management Console
            </span>
            {isAuthenticated && (
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-800 text-emerald-100 px-2.5 py-0.5 rounded-full">
                Live Admin
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close Admin Modal"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto">
            <div className="w-14 h-14 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#304A3A] mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#304A3A] font-medium text-center">
              Staff &amp; Admin Sign In
            </h3>
            <p className="text-xs text-[#4A3428]/70 text-center mt-1 mb-6">
              Enter password to access reservations, menu, hours, and settings.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password (bloom)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#D8C8B4] rounded-xl text-sm text-[#4A3428] focus:outline-none focus:ring-2 focus:ring-[#8FA58A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#304A3A] hover:bg-[#22372A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Access Dashboard
              </button>

              <p className="text-[11px] text-center text-[#4A3428]/50">
                Default password: <code className="font-mono bg-white px-1.5 py-0.5 rounded">bloom</code>
              </p>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-60 bg-[#F4EFE6] border-b md:border-b-0 md:border-r border-[#D8C8B4]/70 p-4 shrink-0 flex flex-row md:flex-col justify-between overflow-x-auto">
              <nav className="flex md:flex-col gap-1.5 w-full">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'reservations', label: 'Reservations', icon: Users },
                  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
                  { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
                  { id: 'gallery', label: 'Gallery', icon: Image },
                  { id: 'hours', label: 'Business Hours', icon: Clock },
                  { id: 'settings', label: 'Cafe Settings', icon: SettingsIcon },
                  { id: 'supabase', label: 'Supabase Backend', icon: Database },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#304A3A] text-white shadow-xs font-semibold'
                          : 'text-[#4A3428] hover:bg-[#D8C8B4]/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="hidden md:block pt-4 border-t border-[#D8C8B4]/50">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="flex items-center gap-2 text-xs text-red-700 hover:text-red-900 transition-colors cursor-pointer w-full px-2 py-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Main Panel */}
            <div className="flex-1 p-6 overflow-y-auto bg-white/70">
              {saveSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                      Overview &amp; Statistics
                    </h3>
                    <p className="text-xs text-[#4A3428]/70">
                      Live status of table reservations at THE BLOOM
                    </p>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#F8F4EC] p-4 rounded-2xl border border-[#D8C8B4]">
                      <span className="text-[10px] uppercase font-bold text-[#4A3428]/60 tracking-wider">
                        Today&apos;s Bookings
                      </span>
                      <div className="font-serif text-3xl font-bold text-[#304A3A] mt-1">
                        {stats.todayCount}
                      </div>
                    </div>
                    <div className="bg-[#F8F4EC] p-4 rounded-2xl border border-[#D8C8B4]">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                        Confirmed Upcoming
                      </span>
                      <div className="font-serif text-3xl font-bold text-emerald-800 mt-1">
                        {stats.upcomingCount}
                      </div>
                    </div>
                    <div className="bg-[#F8F4EC] p-4 rounded-2xl border border-[#D8C8B4]">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                        Pending Confirmation
                      </span>
                      <div className="font-serif text-3xl font-bold text-amber-800 mt-1">
                        {stats.pendingCount}
                      </div>
                    </div>
                    <div className="bg-[#F8F4EC] p-4 rounded-2xl border border-[#D8C8B4]">
                      <span className="text-[10px] uppercase font-bold text-stone-600 tracking-wider">
                        Completed Visits
                      </span>
                      <div className="font-serif text-3xl font-bold text-[#304A3A] mt-1">
                        {stats.completedCount}
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings preview */}
                  <div className="bg-white rounded-2xl p-5 border border-[#D8C8B4]/60 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg text-[#304A3A] font-semibold">
                        Recent Reservations
                      </h4>
                      <button
                        onClick={() => setActiveTab('reservations')}
                        className="text-xs text-[#304A3A] font-semibold hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="divide-y divide-[#D8C8B4]/30 text-xs">
                      {reservations.slice(0, 5).map((r) => (
                        <div key={r.id} className="py-2.5 flex items-center justify-between gap-4">
                          <div>
                            <span className="font-bold text-[#304A3A] font-mono mr-2">{r.id}</span>
                            <span className="font-medium">{r.customerName}</span>
                            <span className="text-[#4A3428]/60 ml-2">
                              ({r.guests} guests · {r.seatingPreference})
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[#4A3428]/80">{r.date} {r.time}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                r.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESERVATIONS LIST */}
              {activeTab === 'reservations' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                        All Reservations
                      </h3>
                      <p className="text-xs text-[#4A3428]/70">
                        Manage statuses, mark no-shows, or create walk-ins
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddResModal(true)}
                      className="px-4 py-2 bg-[#304A3A] hover:bg-[#22372A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Walk-In / Manual Booking</span>
                    </button>
                  </div>

                  {/* Filter & Search */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                      {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled', 'No-show'].map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => setResFilterStatus(st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              resFilterStatus === st
                                ? 'bg-[#304A3A] text-white'
                                : 'bg-[#F4EFE6] text-[#4A3428] hover:bg-[#EAE2D5]'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search name, phone, ID..."
                        value={resSearchQuery}
                        onChange={(e) => setResSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D8C8B4] rounded-lg text-xs text-[#4A3428] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Reservations Table */}
                  <div className="bg-white rounded-2xl border border-[#D8C8B4]/70 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F4EC] text-[#304A3A] uppercase tracking-wider font-semibold border-b border-[#D8C8B4]">
                          <tr>
                            <th className="py-3 px-4">Booking ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Date &amp; Time</th>
                            <th className="py-3 px-4">Guests</th>
                            <th className="py-3 px-4">Seating</th>
                            <th className="py-3 px-4">Phone</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8C8B4]/30">
                          {reservations
                            .filter((r) => {
                              const matchStatus =
                                resFilterStatus === 'All' || r.status === resFilterStatus;
                              const matchSearch =
                                !resSearchQuery ||
                                r.customerName
                                  .toLowerCase()
                                  .includes(resSearchQuery.toLowerCase()) ||
                                r.phone.includes(resSearchQuery) ||
                                r.id.toLowerCase().includes(resSearchQuery.toLowerCase());
                              return matchStatus && matchSearch;
                            })
                            .map((r) => (
                              <tr key={r.id} className="hover:bg-[#F8F4EC]/50 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-[#304A3A]">
                                  {r.id}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-[#4A3428]">
                                    {r.customerName}
                                  </div>
                                  {r.occasion && r.occasion !== 'None' && (
                                    <div className="text-[10px] text-[#8FA58A] font-semibold">
                                      {r.occasion}
                                    </div>
                                  )}
                                  {r.specialRequests && (
                                    <div className="text-[10px] text-stone-500 italic max-w-xs truncate">
                                      &ldquo;{r.specialRequests}&rdquo;
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 font-mono">
                                  <div>{r.date}</div>
                                  <div className="text-[11px] text-stone-500">{r.time}</div>
                                </td>
                                <td className="py-3 px-4 font-semibold text-[#304A3A]">
                                  {r.guests}
                                </td>
                                <td className="py-3 px-4">{r.seatingPreference}</td>
                                <td className="py-3 px-4 font-mono text-stone-600">{r.phone}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      r.status === 'Confirmed'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : r.status === 'Cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : r.status === 'Completed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : r.status === 'No-show'
                                        ? 'bg-stone-200 text-stone-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {r.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <select
                                    value={r.status}
                                    onChange={(e) =>
                                      handleStatusChange(r.id, e.target.value as BookingStatus)
                                    }
                                    className="px-2 py-1 bg-[#F8F4EC] border border-[#D8C8B4] rounded text-[11px] font-medium text-[#304A3A] cursor-pointer"
                                  >
                                    <option value="Confirmed">Confirm</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Mark Completed</option>
                                    <option value="No-show">Mark No-show</option>
                                    <option value="Cancelled">Cancel</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CALENDAR VIEW */}
              {activeTab === 'calendar' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                      Bookings Calendar
                    </h3>
                    <p className="text-xs text-[#4A3428]/70">
                      Day-by-day reservation density and slots
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {Array.from({ length: 7 }).map((_, idx) => {
                      const d = new Date();
                      d.setDate(d.getDate() + idx);
                      const isoDate = d.toISOString().split('T')[0];
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayBookings = reservations.filter(
                        (r) => r.date === isoDate && r.status !== 'Cancelled'
                      );

                      return (
                        <div
                          key={isoDate}
                          className="bg-white p-3.5 rounded-2xl border border-[#D8C8B4]/70 shadow-xs flex flex-col justify-between min-h-[160px]"
                        >
                          <div>
                            <div className="flex items-center justify-between border-b border-[#D8C8B4]/30 pb-2 mb-2">
                              <span className="font-serif text-sm font-bold text-[#304A3A]">
                                {dayName}
                              </span>
                              <span className="text-[11px] text-stone-500 font-mono">
                                {isoDate.slice(5)}
                              </span>
                            </div>

                            <span className="text-xs font-semibold text-[#8FA58A] block mb-2">
                              {dayBookings.length} Bookings
                            </span>

                            <div className="space-y-1 overflow-y-auto max-h-32 text-[10px]">
                              {dayBookings.map((b) => (
                                <div
                                  key={b.id}
                                  className="p-1 bg-[#F8F4EC] rounded text-[#304A3A] truncate"
                                  title={`${b.customerName} - ${b.guests} guests (${b.time})`}
                                >
                                  <strong>{b.time}</strong> {b.customerName} ({b.guests}p)
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: MENU MANAGEMENT */}
              {activeTab === 'menu' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                        Menu Management
                      </h3>
                      <p className="text-xs text-[#4A3428]/70">
                        Add, edit descriptions, change prices, and mark signature items
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMenuItem(null);
                        setMenuForm({
                          name: '',
                          description: '',
                          price: '',
                          category: 'Desserts',
                          isVegetarian: true,
                          isBestseller: false,
                          isSeasonal: false,
                          isSignature: false,
                          image: '',
                        });
                        setIsAddingMenuItem(true);
                      }}
                      className="px-4 py-2 bg-[#304A3A] hover:bg-[#22372A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Menu Item</span>
                    </button>
                  </div>

                  {/* Form Modal / Inline Form */}
                  {(isAddingMenuItem || editingMenuItem) && (
                    <form
                      onSubmit={handleSaveMenuItem}
                      className="bg-[#F8F4EC] p-6 rounded-2xl border border-[#D8C8B4] space-y-4"
                    >
                      <h4 className="font-serif text-lg text-[#304A3A] font-semibold">
                        {editingMenuItem ? 'Edit Menu Item' : 'New Menu Item'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={menuForm.name}
                            onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Price (e.g. ₹340 or leave blank for &apos;View current menu&apos;)
                          </label>
                          <input
                            type="text"
                            value={menuForm.price}
                            placeholder="₹340"
                            onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Category *
                          </label>
                          <select
                            value={menuForm.category}
                            onChange={(e) =>
                              setMenuForm({ ...menuForm, category: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={menuForm.description}
                            onChange={(e) =>
                              setMenuForm({ ...menuForm, description: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          />
                        </div>

                        <div className="sm:col-span-3 flex flex-wrap gap-4 text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={menuForm.isVegetarian}
                              onChange={(e) =>
                                setMenuForm({ ...menuForm, isVegetarian: e.target.checked })
                              }
                            />
                            <span>Vegetarian</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={menuForm.isBestseller}
                              onChange={(e) =>
                                setMenuForm({ ...menuForm, isBestseller: e.target.checked })
                              }
                            />
                            <span>Bestseller</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={menuForm.isSeasonal}
                              onChange={(e) =>
                                setMenuForm({ ...menuForm, isSeasonal: e.target.checked })
                              }
                            />
                            <span>Seasonal</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={menuForm.isSignature}
                              onChange={(e) =>
                                setMenuForm({ ...menuForm, isSignature: e.target.checked })
                              }
                            />
                            <span>Signature Item</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingMenuItem(false);
                            setEditingMenuItem(null);
                          }}
                          className="px-4 py-1.5 rounded-lg border border-[#D8C8B4] text-xs text-[#4A3428]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-1.5 bg-[#304A3A] text-white rounded-lg text-xs font-semibold"
                        >
                          Save Item
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Menu Table */}
                  <div className="bg-white rounded-2xl border border-[#D8C8B4]/70 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F4EC] text-[#304A3A] font-semibold border-b border-[#D8C8B4]">
                        <tr>
                          <th className="py-3 px-4">Item</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Tags</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D8C8B4]/30">
                        {menuItems.map((m) => (
                          <tr key={m.id} className="hover:bg-[#F8F4EC]/50">
                            <td className="py-2.5 px-4 font-medium text-[#304A3A]">{m.name}</td>
                            <td className="py-2.5 px-4 text-[#4A3428]/70">{m.category}</td>
                            <td className="py-2.5 px-4 font-mono font-semibold">
                              {m.price || (
                                <span className="text-[#8FA58A]">View current menu</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex gap-1 text-[10px]">
                                {m.isVegetarian && (
                                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                                    Veg
                                  </span>
                                )}
                                {m.isBestseller && (
                                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">
                                    Bestseller
                                  </span>
                                )}
                                {m.isSignature && (
                                  <span className="px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded font-semibold">
                                    Signature
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingMenuItem(m);
                                  setMenuForm({
                                    name: m.name,
                                    description: m.description,
                                    price: m.price || '',
                                    category: m.category,
                                    isVegetarian: m.isVegetarian,
                                    isBestseller: !!m.isBestseller,
                                    isSeasonal: !!m.isSeasonal,
                                    isSignature: !!m.isSignature,
                                    image: m.image || '',
                                  });
                                }}
                                className="p-1 hover:text-[#304A3A]"
                              >
                                <Edit2 className="w-3.5 h-3.5 inline" />
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(m.id)}
                                className="p-1 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: GALLERY MANAGEMENT */}
              {activeTab === 'gallery' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                        Gallery Management
                      </h3>
                      <p className="text-xs text-[#4A3428]/70">
                        Manage gallery images and photo assignments
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingGallery(true)}
                      className="px-4 py-2 bg-[#304A3A] hover:bg-[#22372A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Gallery Photo</span>
                    </button>
                  </div>

                  {isAddingGallery && (
                    <form
                      onSubmit={handleSaveGalleryItem}
                      className="bg-[#F8F4EC] p-6 rounded-2xl border border-[#D8C8B4] space-y-4"
                    >
                      <h4 className="font-serif text-lg text-[#304A3A] font-semibold">
                        Add New Photo
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Photo Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={galleryForm.title}
                            onChange={(e) =>
                              setGalleryForm({ ...galleryForm, title: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Image Path/URL *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="/src/assets/images/..."
                            value={galleryForm.image}
                            onChange={(e) =>
                              setGalleryForm({ ...galleryForm, image: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Category *
                          </label>
                          <select
                            value={galleryForm.category}
                            onChange={(e) =>
                              setGalleryForm({ ...galleryForm, category: e.target.value as any })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          >
                            {['Food', 'Desserts', 'Coffee', 'Interior', 'Outdoor', 'Moments'].map(
                              (c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold uppercase text-[#304A3A] mb-1">
                            Caption
                          </label>
                          <input
                            type="text"
                            value={galleryForm.caption}
                            onChange={(e) =>
                              setGalleryForm({ ...galleryForm, caption: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingGallery(false)}
                          className="px-4 py-1.5 rounded-lg border border-[#D8C8B4] text-xs text-[#4A3428]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-1.5 bg-[#304A3A] text-white rounded-lg text-xs font-semibold"
                        >
                          Save Photo
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((g) => (
                      <div
                        key={g.id}
                        className="bg-[#F8F4EC] rounded-2xl overflow-hidden border border-[#D8C8B4] relative group"
                      >
                        <img
                          src={g.image}
                          alt={g.title}
                          className="w-full aspect-4/3 object-cover"
                        />
                        <div className="p-3">
                          <span className="text-[10px] uppercase font-bold text-[#8FA58A]">
                            {g.category}
                          </span>
                          <h5 className="font-serif text-sm font-semibold text-[#304A3A] truncate">
                            {g.title}
                          </h5>
                        </div>
                        <button
                          onClick={() => handleDeleteGallery(g.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: BUSINESS HOURS & CLOSURES */}
              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                        Business Hours &amp; Closures
                      </h3>
                      <p className="text-xs text-[#4A3428]/70">
                        Never hardcoded; adjust weekly schedules or declare special holiday closures
                      </p>
                    </div>
                    <button
                      onClick={handleSaveHours}
                      className="px-5 py-2 bg-[#304A3A] hover:bg-[#22372A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Weekly Hours</span>
                    </button>
                  </div>

                  {/* Weekly Hours Table */}
                  <div className="bg-white rounded-2xl border border-[#D8C8B4]/70 p-4 space-y-3">
                    <h4 className="font-serif text-base text-[#304A3A] font-semibold">
                      Standard Weekly Schedule
                    </h4>
                    <div className="space-y-2 text-xs">
                      {Object.keys(hours).map((day) => {
                        const dayData = hours[day];
                        return (
                          <div
                            key={day}
                            className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#D8C8B4]/30"
                          >
                            <span className="w-28 font-semibold text-[#4A3428]">{day}</span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={dayData.isOpen}
                                  onChange={(e) =>
                                    handleUpdateDayHours(day, 'isOpen', e.target.checked)
                                  }
                                />
                                <span>Open</span>
                              </label>

                              <span className="text-stone-400">|</span>

                              <div className="flex items-center gap-2">
                                <span>Opens:</span>
                                <input
                                  type="time"
                                  disabled={!dayData.isOpen}
                                  value={dayData.open}
                                  onChange={(e) =>
                                    handleUpdateDayHours(day, 'open', e.target.value)
                                  }
                                  className="px-2 py-1 bg-[#F8F4EC] border border-[#D8C8B4] rounded font-mono text-xs"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <span>Closes:</span>
                                <input
                                  type="time"
                                  disabled={!dayData.isOpen}
                                  value={dayData.close}
                                  onChange={(e) =>
                                    handleUpdateDayHours(day, 'close', e.target.value)
                                  }
                                  className="px-2 py-1 bg-[#F8F4EC] border border-[#D8C8B4] rounded font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Special Closures / Holiday Exceptions */}
                  <div className="bg-white rounded-2xl border border-[#D8C8B4]/70 p-4 space-y-4">
                    <h4 className="font-serif text-base text-[#304A3A] font-semibold">
                      Special Closures &amp; Holidays
                    </h4>
                    <div className="flex flex-wrap gap-3 items-end">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-[#304A3A] mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newClosureDate}
                          onChange={(e) => setNewClosureDate(e.target.value)}
                          className="px-3 py-1.5 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg text-xs"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] font-semibold uppercase text-[#304A3A] mb-1">
                          Reason / Description
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Deep Cleaning / Private Holiday"
                          value={newClosureReason}
                          onChange={(e) => setNewClosureReason(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg text-xs"
                        />
                      </div>
                      <button
                        onClick={handleAddClosure}
                        className="px-4 py-2 bg-[#304A3A] text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Add Closure
                      </button>
                    </div>

                    {closures.length > 0 ? (
                      <div className="divide-y divide-[#D8C8B4]/30 text-xs">
                        {closures.map((c) => (
                          <div key={c.id} className="py-2 flex items-center justify-between">
                            <div>
                              <span className="font-mono font-bold mr-3">{c.date}</span>
                              <span className="text-stone-600">{c.reason}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveClosure(c.id)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">No upcoming special closures.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: SETTINGS & SEATING */}
              {activeTab === 'settings' && settings && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                      Cafe Settings &amp; Seating Configuration
                    </h3>
                    <p className="text-xs text-[#4A3428]/70">
                      Configure capacity, contacts, and policies
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-[#D8C8B4]/70 space-y-4">
                    <h4 className="font-serif text-base text-[#304A3A] font-semibold">
                      Seating Capacity (Max Concurrent Guests Per Slot)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#304A3A] mb-1">
                          Indoor Capacity (Guests)
                        </label>
                        <input
                          type="number"
                          value={settings.seatingCapacity.Indoor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              seatingCapacity: {
                                ...settings.seatingCapacity,
                                Indoor: parseInt(e.target.value, 10) || 0,
                              },
                            })
                          }
                          className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#304A3A] mb-1">
                          Outdoor Garden Capacity (Guests)
                        </label>
                        <input
                          type="number"
                          value={settings.seatingCapacity.Outdoor}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              seatingCapacity: {
                                ...settings.seatingCapacity,
                                Outdoor: parseInt(e.target.value, 10) || 0,
                              },
                            })
                          }
                          className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#304A3A] mb-1">
                          Balcony Terrace Capacity (Guests)
                        </label>
                        <input
                          type="number"
                          value={settings.seatingCapacity.Balcony}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              seatingCapacity: {
                                ...settings.seatingCapacity,
                                Balcony: parseInt(e.target.value, 10) || 0,
                              },
                            })
                          }
                          className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-[#D8C8B4]/70 space-y-4">
                    <h4 className="font-serif text-base text-[#304A3A] font-semibold">
                      General Business Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#304A3A] mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#304A3A] mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="text"
                          value={settings.whatsappNumber}
                          onChange={(e) =>
                            setSettings({ ...settings, whatsappNumber: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#304A3A] mb-1">
                          Official Address
                        </label>
                        <input
                          type="text"
                          value={settings.address}
                          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-[#304A3A] mb-1">
                          Instagram Username (Leave blank until verified per guidelines)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. thebloomcafeblr"
                          value={settings.instagramHandle}
                          onChange={(e) =>
                            setSettings({ ...settings, instagramHandle: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#D8C8B4] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#304A3A] hover:bg-[#22372A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Settings</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 8: SUPABASE BACKEND INTEGRATION */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#304A3A] font-semibold mb-1">
                      <Database className="w-4 h-4 text-[#8FA58A]" />
                      <span>Supabase Cloud Database</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#304A3A] font-medium">
                      Supabase Backend Integration
                    </h3>
                    <p className="text-xs text-[#4A3428]/70">
                      Whenever someone reserves an appointment or table, data is automatically dispatched and synced to your Supabase PostgreSQL database.
                    </p>
                  </div>

                  {supabaseSyncMessage && (
                    <div
                      className={`p-4 rounded-xl text-xs font-medium flex items-start gap-2.5 ${
                        supabaseSyncMessage.includes('Successfully') ||
                        supabaseSyncMessage.includes('verified')
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border border-amber-200 text-amber-900'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>{supabaseSyncMessage}</div>
                    </div>
                  )}

                  {/* Credentials & Status Box */}
                  <div className="bg-[#F8F4EC] rounded-2xl p-6 border border-[#D8C8B4] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8C8B4]/50">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A3428]/60 block mb-0.5">
                          Connection Status
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                          <span className="font-serif text-lg font-semibold text-[#304A3A]">
                            Connected to Supabase Project
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCheckSupabase}
                          disabled={isCheckingSupabase}
                          className="px-4 py-2 bg-white border border-[#D8C8B4] hover:bg-[#F8F4EC] rounded-xl text-xs font-semibold text-[#304A3A] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`}
                          />
                          <span>{isCheckingSupabase ? 'Testing...' : 'Verify Table'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSyncAllToSupabase}
                          disabled={isSyncingSupabase}
                          className="px-4 py-2 bg-[#304A3A] hover:bg-[#22372A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>{isSyncingSupabase ? 'Syncing...' : 'Sync All Bookings'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[#4A3428]/60 block font-medium">Project ID</span>
                        <span className="font-mono font-bold text-[#304A3A]">
                          {SUPABASE_PROJECT_ID}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#4A3428]/60 block font-medium">Supabase URL</span>
                        <span className="font-mono text-[#304A3A] truncate block" title={SUPABASE_URL}>
                          {SUPABASE_URL}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#4A3428]/60 block font-medium">Table Status</span>
                        {supabaseStatus?.tableExists ? (
                          <span className="font-semibold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Table &apos;{supabaseStatus.tableFound}&apos; Ready
                          </span>
                        ) : (
                          <span className="font-semibold text-amber-800 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Run SQL Script to Create Table
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Supabase Dashboard Quick Link */}
                  <div className="bg-white rounded-2xl p-5 border border-[#D8C8B4]/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-base text-[#304A3A] font-semibold">
                        Your Supabase Dashboard
                      </h4>
                      <p className="text-xs text-[#4A3428]/70">
                        View live rows in Table Editor, inspect incoming reservation data, or run queries.
                      </p>
                    </div>
                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <span>Open Supabase Table Editor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* SQL Setup Script Box */}
                  <div className="bg-white rounded-2xl p-6 border border-[#D8C8B4]/70 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-lg text-[#304A3A] font-semibold">
                          Supabase SQL Setup Script
                        </h4>
                        <p className="text-xs text-[#4A3428]/70">
                          If you haven&apos;t created the table yet, paste this in{' '}
                          <strong>Supabase &rarr; SQL Editor &rarr; New Query &rarr; Run</strong>.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={SUPABASE_SQL_EDITOR_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-white border border-[#D8C8B4] text-[#304A3A] hover:bg-[#F8F4EC] text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                        >
                          <span>Open SQL Editor</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#8FA58A]" />
                        </a>
                        <button
                          type="button"
                          onClick={handleCopySql}
                          className="px-4 py-2 rounded-xl bg-[#8FA58A] hover:bg-[#7D9478] text-[#22372A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
                        >
                          {copiedSql ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy SQL Script</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <pre className="bg-[#203327] text-[#D8C8B4] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 leading-relaxed border border-[#304A3A]">
                      {supabaseStatus?.sqlSetupScript ||
                        `CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  seating_preference TEXT,
  occasion TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to reservations" 
ON public.reservations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select from reservations" 
ON public.reservations FOR SELECT USING (true);`}
                    </pre>

                    <div className="text-[11px] text-[#4A3428]/70 space-y-1">
                      <p>
                        <strong>Note:</strong> When visitors submit bookings on the website, the form data is saved with columns: <code>id</code>, <code>customer_name</code>, <code>phone</code>, <code>email</code>, <code>date</code>, <code>time</code>, <code>guests</code>, <code>seating_preference</code>, <code>occasion</code>, <code>special_requests</code>, <code>status</code>, and <code>created_at</code>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Manual Walk-in Booking */}
        {showAddResModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#F8F4EC] rounded-2xl max-w-lg w-full p-6 border border-[#D8C8B4] shadow-2xl relative">
              <button
                onClick={() => setShowAddResModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="font-serif text-xl text-[#304A3A] font-semibold mb-4">
                Add Walk-In / Phone Reservation
              </h4>
              <form onSubmit={handleCreateManualReservation} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newResData.customerName}
                    onChange={(e) =>
                      setNewResData({ ...newResData, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={newResData.phone}
                      onChange={(e) => setNewResData({ ...newResData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={newResData.email}
                      onChange={(e) => setNewResData({ ...newResData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D8C8B4] rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newResData.date}
                      onChange={(e) => setNewResData({ ...newResData, date: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-[#D8C8B4] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Time</label>
                    <input
                      type="text"
                      required
                      placeholder="12:00 PM"
                      value={newResData.time}
                      onChange={(e) => setNewResData({ ...newResData, time: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-[#D8C8B4] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={newResData.guests}
                      onChange={(e) =>
                        setNewResData({ ...newResData, guests: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-[#D8C8B4] rounded-lg"
                    />
                  </div>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddResModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#304A3A] text-white font-semibold rounded-lg"
                  >
                    Create Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
