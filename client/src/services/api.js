import { supabase } from '../lib/supabase';

// ─── Auth ──────────────────────────────────────────
export const loginAPI = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

export const registerAPI = async ({ name, email, password, role }) => {
    const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, role: role || 'member' } }
    });
    if (error) throw error;
    return data;
};

export const forgotPasswordAPI = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' });
    if (error) throw error;
};

// ─── Profile ───────────────────────────────────────
export const updateProfileAPI = async (updates) => {
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (error) throw error;
    return { data: { ...data.user.user_metadata } };
};

export const changePasswordAPI = async ({ newPassword }) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
};

// ─── Admin: Analytics ──────────────────────────────
export const getAnalyticsAPI = async () => {
    let totalMembers = 0, totalTrainers = 0, totalRevenue = 0, totalWorkouts = 0;
    try {
        const [members, trainers, payments, workouts] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'member'),
            supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'trainer'),
            supabase.from('payments').select('amount'),
            supabase.from('workouts').select('id', { count: 'exact' }),
        ]);
        totalMembers = members.count || 0;
        totalTrainers = trainers.count || 0;
        totalRevenue = (payments.data || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        totalWorkouts = workouts.count || 0;
    } catch (e) { /* tables may not exist yet */ }
    return {
        data: { totalMembers, totalTrainers, totalRevenue, totalWorkouts, recentMembers: [], monthlyRevenue: Array(12).fill(0) }
    };
};

// ─── Admin: Trainers ───────────────────────────────
export const getTrainersAPI = async () => {
    try {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'trainer').order('created_at', { ascending: false });
        if (error) throw error;
        return { data: (data || []).map(t => ({ ...t, _id: t.id })) };
    } catch (e) { return { data: [] }; }
};

export const createTrainerAPI = async (form) => {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: form.email, password: form.password || 'trainer123',
        options: { data: { name: form.name, role: 'trainer' } }
    });
    if (authErr) throw authErr;
    try {
        if (authData.user) {
            await supabase.from('profiles').upsert({ id: authData.user.id, name: form.name, email: form.email, role: 'trainer', phone: form.phone, specialization: form.specialization });
        }
    } catch (e) { /* profiles table may not exist */ }
    return { data: authData };
};

export const updateTrainerAPI = async (id, form) => {
    try {
        const { data, error } = await supabase.from('profiles').update({
            name: form.name, phone: form.phone, specialization: form.specialization,
        }).eq('id', id).select().single();
        if (error) throw error;
        return { data };
    } catch (e) { return { data: {} }; }
};

export const deleteTrainerAPI = async (id) => {
    try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
    } catch (e) { }
};

// ─── Admin: Members ────────────────────────────────
export const getMembersAPI = async () => {
    try {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'member').order('created_at', { ascending: false });
        if (error) throw error;
        return { data: (data || []).map(m => ({ ...m, _id: m.id, assignedTrainer: m.assigned_trainer ? { _id: m.assigned_trainer, name: 'Trainer' } : null })) };
    } catch (e) { return { data: [] }; }
};

export const createMemberAPI = async (form) => {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: form.email, password: form.password || 'member123',
        options: { data: { name: form.name, role: 'member' } }
    });
    if (authErr) throw authErr;
    try {
        if (authData.user) {
            await supabase.from('profiles').upsert({
                id: authData.user.id, name: form.name, email: form.email, role: 'member',
                phone: form.phone, membership_plan: form.membershipPlan, assigned_trainer: form.assignedTrainer || null,
                membership_expiry: form.membershipExpiry || null,
            });
        }
    } catch (e) { }
    return { data: authData };
};

export const updateMemberAPI = async (id, form) => {
    try {
        const { data, error } = await supabase.from('profiles').update({
            name: form.name, phone: form.phone, membership_plan: form.membershipPlan,
            assigned_trainer: form.assignedTrainer || null, membership_expiry: form.membershipExpiry || null,
        }).eq('id', id).select().single();
        if (error) throw error;
        return { data };
    } catch (e) { return { data: {} }; }
};

export const deleteMemberAPI = async (id) => {
    try { await supabase.from('profiles').delete().eq('id', id); } catch (e) { }
};

// ─── Payments ──────────────────────────────────────
export const getPaymentsAPI = async () => {
    try {
        const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return { data: (data || []).map(p => ({ ...p, _id: p.id, user: { name: 'Member', email: '' } })) };
    } catch (e) { return { data: [] }; }
};

export const createPaymentAPI = async (form) => {
    const { data, error } = await supabase.from('payments').insert({
        user_id: form.userId, amount: Number(form.amount), plan: form.plan,
        duration: Number(form.duration), status: form.status || 'paid', notes: form.notes,
        receipt_id: 'REC-' + Date.now(),
    }).select().single();
    if (error) throw error;
    return { data };
};

export const getMyPaymentsAPI = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (error) throw error;
        return { data: (data || []).map(p => ({ ...p, _id: p.id })) };
    } catch (e) { return { data: [] }; }
};

// ─── Workouts ──────────────────────────────────────
export const getWorkoutsAPI = async (filters = {}) => {
    try {
        let query = supabase.from('workouts').select('*').order('created_at', { ascending: false });
        if (filters.muscleGroup) query = query.eq('muscle_group', filters.muscleGroup);
        const { data, error } = await query;
        if (error) throw error;
        return { data: (data || []).map(w => ({ ...w, _id: w.id, muscleGroup: w.muscle_group, restTime: w.rest_time, gifUrl: w.gif_url, videoUrl: w.video_url })) };
    } catch (e) { return { data: [] }; }
};

export const createWorkoutAPI = async (form) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('workouts').insert({
        title: form.title, description: form.description, muscle_group: form.muscleGroup,
        difficulty: form.difficulty, sets: Number(form.sets), reps: form.reps,
        rest_time: form.restTime, gif_url: form.gifUrl, video_url: form.videoUrl, created_by: user.id,
    }).select().single();
    if (error) throw error;
    return { data };
};

export const updateWorkoutAPI = async (id, form) => {
    const { data, error } = await supabase.from('workouts').update({
        title: form.title, description: form.description, muscle_group: form.muscleGroup,
        difficulty: form.difficulty, sets: Number(form.sets), reps: form.reps,
        rest_time: form.restTime, gif_url: form.gifUrl, video_url: form.videoUrl,
    }).eq('id', id).select().single();
    if (error) throw error;
    return { data };
};

export const deleteWorkoutAPI = async (id) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) throw error;
};

// ─── Trainer: Assigned Members ─────────────────────
export const getAssignedMembersAPI = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('profiles').select('*').eq('assigned_trainer', user.id).eq('role', 'member');
        if (error) throw error;
        return { data: (data || []).map(m => ({ ...m, _id: m.id })) };
    } catch (e) { return { data: [] }; }
};

// ─── Workout Plans ─────────────────────────────────
export const assignWorkoutPlanAPI = async (form) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('workout_plans').insert({
        title: form.title, member_id: form.memberId, assigned_by: user.id,
        workouts: form.workouts, notes: form.notes,
    }).select().single();
    if (error) throw error;
    return { data };
};

export const getMyWorkoutPlanAPI = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('workout_plans').select('*').eq('member_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (error) throw error;
        return { data: data ? { ...data, _id: data.id, assignedBy: { name: 'Trainer' } } : null };
    } catch (e) { return { data: null }; }
};

export const getMemberWorkoutPlanAPI = async (memberId) => {
    try {
        const { data, error } = await supabase.from('workout_plans').select('*').eq('member_id', memberId).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (error) throw error;
        return { data };
    } catch (e) { return { data: null }; }
};

export const updateMemberProgressAPI = async (memberId, updates) => {
    try {
        const { data, error } = await supabase.from('workout_plans').update({ notes: updates.notes }).eq('member_id', memberId).select().single();
        if (error) throw error;
        return { data };
    } catch (e) { return { data: null }; }
};

// ─── Diet Plans ────────────────────────────────────
export const assignDietPlanAPI = async (form) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('diet_plans').insert({
        title: form.title, member_id: form.memberId, assigned_by: user.id,
        meals: form.meals, total_calories: form.totalCalories || 0, notes: form.notes,
    }).select().single();
    if (error) throw error;
    return { data };
};

export const getMyDietPlanAPI = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('diet_plans').select('*').eq('member_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (error) throw error;
        return { data: data ? { ...data, _id: data.id, totalCalories: data.total_calories, assignedBy: { name: 'Trainer' } } : null };
    } catch (e) { return { data: null }; }
};
