/**
 * IronCoach Pro - Coach Admin Master Panel
 * لوحة تحكم وإدارة الكوتش للمشتركين والاشتراكات والإعدادات والنسخ الاحتياطي
 */

const IronCoachPanel = {
    activeSection: "clients",
    selectedCoachProgId: "prog_ppl",
    filterStatus: "all",
    searchQuery: "",

    setSection(section = "clients") {
        this.activeSection = section === "programs" ? "programs" : "clients";
        this.renderCoachDashboard();
    },

    selectCoachProgram(progId) {
        this.selectedCoachProgId = progId || "prog_ppl";
        this.activeSection = "programs";
        this.renderCoachDashboard();
    },

    // رسم واجهة لوحة تحكم الكوتش
    renderCoachDashboard() {
        const container = document.getElementById("coachDashboardView");
        if (!container) return;

        const trainees = IronAuth.getAllTrainees().map(t => IronAuth.refreshSubscriptionStatus(t));
        const config = getAppConfig();

        const activeCount = trainees.filter(t => t.status === "active").length;
        const expiringCount = trainees.filter(t => t.status === "expiring").length;
        const pendingCount = trainees.filter(t => t.status === "pending").length;
        const expiredCount = trainees.filter(t => t.status === "expired").length;

        let filteredTrainees = trainees;
        if (this.filterStatus !== "all") {
            filteredTrainees = filteredTrainees.filter(t => t.status === this.filterStatus);
        }

        if (this.searchQuery && this.searchQuery.trim() !== "") {
            const q = this.searchQuery.trim().toLowerCase();
            filteredTrainees = filteredTrainees.filter(t => {
                const enName = typeof IronI18n !== "undefined" ? IronI18n.trName(t).toLowerCase() : "";
                const enGoal = typeof IronI18n !== "undefined" ? IronI18n.trGoal(t.goal || "").toLowerCase() : "";
                return (t.name && t.name.toLowerCase().includes(q)) ||
                    (enName && enName.includes(q)) ||
                    (t.username && t.username.toLowerCase().includes(q)) ||
                    (t.phone && t.phone.toLowerCase().includes(q)) ||
                    (t.goal && t.goal.toLowerCase().includes(q)) ||
                    (enGoal && enGoal.includes(q));
            });
        }

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const txt = (key, vars) => typeof IronI18n !== "undefined" ? IronI18n.t(key, vars) : key;
        const displayTitle = typeof IronI18n !== "undefined" ? IronI18n.trCoachTitle(config.coachInfo.title) : config.coachInfo.title;

        container.innerHTML = `
            <div class="space-y-5 sm:space-y-6">
                <!-- شريط الترحيب والإحصائيات السريعة -->
                <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-4 sm:p-6 relative overflow-hidden">
                    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div class="brand-logo-frame w-14 sm:w-24 flex-shrink-0 flex items-center justify-center">
                                <img src="LOGO.png" alt="Coach Logo" class="brand-logo-img" onerror="this.style.display='none';this.parentElement.innerText='👑'">
                            </div>
                            <div class="min-w-0">
                                <div class="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
                                    <span>${txt("coach_badge")}</span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-black text-white">${txt("coach_welcome")}</h2>
                                <p class="text-xs text-gray-400 mt-1">${txt("coach_sub", { title: displayTitle })}</p>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="openModal('addTraineeModal')" class="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5">
                                <span>${txt("coach_add_btn")}</span>
                            </button>
                            <button onclick="IronCoachPanel.openSettingsModal()" class="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5">
                                <span>${txt("coach_settings_btn")}</span>
                            </button>
                            <button onclick="IronCoachPanel.exportBackup()" class="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5">
                                <span>${txt("coach_backup_btn")}</span>
                            </button>
                            <label class="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                                <span>${txt("coach_restore_btn")}</span>
                                <input type="file" accept=".json,application/json" onchange="IronCoachPanel.importBackup(this)" class="hidden">
                            </label>
                        </div>
                    </div>

                    <!-- شبكة الإحصائيات -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-6">
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-center">
                            <div class="text-xs text-gray-400 font-bold mb-1">${txt("coach_stat_total")}</div>
                            <div class="text-xl sm:text-2xl font-black text-white">${trainees.length}</div>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-center">
                            <div class="text-xs text-emerald-400 font-bold mb-1">${txt("coach_stat_active")}</div>
                            <div class="text-xl sm:text-2xl font-black text-emerald-400">${activeCount}</div>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-center">
                            <div class="text-xs text-amber-400 font-bold mb-1">${txt("coach_stat_expiring")}</div>
                            <div class="text-xl sm:text-2xl font-black text-amber-400">${expiringCount}</div>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-center">
                            <div class="text-xs text-rose-400 font-bold mb-1">${txt("coach_stat_expired")}</div>
                            <div class="text-xl sm:text-2xl font-black text-rose-400">${expiredCount}</div>
                        </div>
                    </div>
                </div>

                <!-- التبديل بين إدارة المشتركين وقسم البرامج التدريبية بتفاصيلها -->
                <div class="flex flex-wrap items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-2">
                    <button type="button" onclick="IronCoachPanel.setSection('clients')"
                        class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${this.activeSection !== 'programs' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-950/70 text-gray-300 hover:text-white border border-slate-800'}">
                        <span>👥</span>
                        <span>${txt("coach_tab_clients", { count: trainees.length })}</span>
                    </button>
                    <button type="button" onclick="IronCoachPanel.setSection('programs')"
                        class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${this.activeSection === 'programs' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-950/70 text-gray-300 hover:text-white border border-slate-800'}">
                        <span>🏋️‍♂️</span>
                        <span>${txt("coach_tab_programs", { count: typeof workoutProgramsDatabase !== 'undefined' ? workoutProgramsDatabase.length : 7 })}</span>
                    </button>
                </div>

                ${this.activeSection === 'programs' ? this.renderCoachProgramsSection(trainees, isEn, txt) : `

                <!-- شريط البحث وفلترة المشتركين -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <h3 class="text-sm sm:text-base font-black text-white whitespace-nowrap">
                            <span>${txt("coach_list_title", { count: filteredTrainees.length })}</span>
                        </h3>
                        <input type="text" id="coachTraineeSearchInput" value="${this.searchQuery}"
                            oninput="IronCoachPanel.handleSearch(this.value)"
                            placeholder="${txt("coach_search_ph")}"
                            class="w-full sm:max-w-sm bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold placeholder-gray-500 outline-none">
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <button onclick="IronCoachPanel.setFilter('all')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'all' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-gray-300'}">${txt("coach_filter_all", { count: trainees.length })}</button>
                        <button onclick="IronCoachPanel.setFilter('active')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'active' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-gray-300'}">${txt("coach_filter_active", { count: activeCount })}</button>
                        <button onclick="IronCoachPanel.setFilter('expiring')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'expiring' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-gray-300'}">${txt("coach_filter_expiring", { count: expiringCount })}</button>
                        <button onclick="IronCoachPanel.setFilter('pending')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'pending' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-gray-300'}">${txt("coach_filter_pending", { count: pendingCount })}</button>
                        <button onclick="IronCoachPanel.setFilter('expired')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'expired' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-800 text-gray-300'}">${txt("coach_filter_expired", { count: expiredCount })}</button>
                    </div>
                </div>

                <!-- بطاقات المشتركين -->
                ${filteredTrainees.length === 0 ? `
                    <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 text-center text-gray-400 text-sm font-bold">
                        ${txt("coach_empty")}
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${filteredTrainees.map(t => {
                            const statusBadge = t.status === 'active'
                                ? `<span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">${txt("status_active", { days: t.daysLeft })}</span>`
                                : t.status === 'expiring'
                                ? `<span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">${txt("status_expiring", { days: t.daysLeft })}</span>`
                                : t.status === 'pending'
                                ? `<span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[11px] font-bold">${txt("status_pending")}</span>`
                                : `<span class="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">${txt("status_expired")}</span>`;

                            const checkinsCount = Array.isArray(t.history) ? t.history.length : 0;
                            const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(t) : t.name;
                            const dispGoal = typeof IronI18n !== "undefined" ? IronI18n.trGoal(t.goal || "تنشيف وخسارة دهون") : (t.goal || "تنشيف");
                            const provLabel = t.authProvider && t.authProvider !== "manual"
                                ? `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">${t.authProvider === 'google' ? '🔵' : t.authProvider === 'icloud' ? '☁️' : t.authProvider === 'email' ? '✉️' : '📱'} ${typeof IronI18n !== "undefined" ? IronI18n.trProvider(t.authProvider) : t.authProvider}</span>`
                                : '';
                            const hasPendingReceipt = Boolean(t.lastRenewalReceipt && t.lastRenewalReceipt.path && t.lastRenewalReceipt.status === "pending_review");
                            const hasAnyReceipt = Boolean(t.lastRenewalReceipt && t.lastRenewalReceipt.path);
                            const recDays = Number(t.lastRenewalReceipt?.planDays) || 30;
                            const recMonths = t.lastRenewalReceipt?.planMonths !== undefined ? Number(t.lastRenewalReceipt.planMonths) : Math.round(recDays / 30);
                            const recPrice = t.lastRenewalReceipt?.planPrice ? `${t.lastRenewalReceipt.planPrice} ${isEn ? 'SAR' : 'ر.س'}` : '';
                            const recLabel = recDays === 1
                                ? (isEn ? 'Pending (1-Day Trial)' : 'إيصال تجربة يوم واحد (1 يوم)')
                                : (isEn ? `Pending (${recMonths}M • ${recDays}d)` : `إيصال باقة ${recMonths} شهر (${recDays} يوم)`);
                            const receiptNotice = hasPendingReceipt
                                ? `<div class="mt-2 px-2.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-[11px]">
                                        <div class="flex items-center justify-between gap-2">
                                            <span class="text-amber-300 font-bold truncate">🧾 ${recLabel} ${recPrice ? `• ${recPrice}` : ''}</span>
                                            <button type="button" onclick="IronCoachPanel.viewTraineeReceipt('${t.id}')" class="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] flex-shrink-0 hover:bg-amber-400 transition">${isEn ? 'View Receipt' : 'عرض الإيصال'}</button>
                                        </div>
                                        <button type="button" onclick="IronCoachPanel.renewTrainee('${t.id}', ${recDays})" class="w-full py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition">
                                            ✅ ${isEn ? `Approve & Activate +${recDays} Day(s)` : `اعتماد الإيصال وتفعيل +${recDays} ${recDays === 1 ? 'يوم' : 'يوماً'}`}
                                        </button>
                                   </div>`
                                : (hasAnyReceipt
                                    ? `<div class="mt-2 px-2.5 py-1 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 text-[10px] text-gray-400">
                                            <span class="truncate">🧾 ${t.lastRenewalReceipt.fileName || (isEn ? 'Last receipt' : 'آخر إيصال')}</span>
                                            <button type="button" onclick="IronCoachPanel.viewTraineeReceipt('${t.id}')" class="text-emerald-400 font-bold hover:underline flex-shrink-0">${isEn ? 'View' : 'عرض'}</button>
                                       </div>`
                                    : '');
                            const initial = (dispName || "U").trim().charAt(0).toUpperCase();
                            const avatarBadge = t.avatar
                                ? `<img src="${t.avatar}" alt="${dispName}" class="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/40 flex-shrink-0">`
                                : `<div class="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm flex-shrink-0">${initial}</div>`;

                            return `
                                <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5 hover:border-emerald-500/40 transition flex flex-col justify-between">
                                    <div>
                                        <div class="flex justify-between items-start gap-2 mb-3">
                                            <div class="flex items-center gap-2.5 min-w-0">
                                                ${avatarBadge}
                                                <div class="min-w-0">
                                                    <div class="flex items-center gap-1.5 flex-wrap">
                                                        <h4 class="font-black text-white text-base truncate">${dispName}</h4>
                                                        ${provLabel}
                                                    </div>
                                                    <span class="text-xs text-gray-400 font-mono truncate block">@${t.username} • ${t.phone || (isEn ? 'No phone' : 'بدون هاتف')}</span>
                                                </div>
                                            </div>
                                            ${statusBadge}
                                        </div>

                                        <div class="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 my-3">
                                            <div>
                                                <span class="text-gray-400">${isEn ? 'Goal:' : 'الهدف:'}</span>
                                                <div class="font-bold text-white truncate">${dispGoal}</div>
                                            </div>
                                            <div>
                                                <span class="text-gray-400">${isEn ? 'Calories:' : 'السعرات:'}</span>
                                                <div class="font-bold text-emerald-400">${t.calories || 2000} kcal</div>
                                            </div>
                                            <div>
                                                <span class="text-gray-400">${isEn ? 'Weight / Logs:' : 'الوزن / المتابعات:'}</span>
                                                <div class="font-bold text-white">${t.weight} ${isEn ? 'kg' : 'كجم'} (${checkinsCount})</div>
                                            </div>
                                            <div>
                                                <span class="text-gray-400">${isEn ? 'Program:' : 'البرنامج:'}</span>
                                                <div class="font-bold text-cyan-400 truncate">${typeof IronI18n !== 'undefined' && IronI18n.trProgram ? IronI18n.trProgram(t.program || 'PPL (Push Pull Legs)') : (t.program || 'PPL')}</div>
                                            </div>
                                        </div>
                                        ${(() => {
                                            const obs = (t.onboardingProfile && typeof t.onboardingProfile === 'object') ? t.onboardingProfile : null;
                                            if (!obs || Object.keys(obs).length === 0) return '';
                                            const tags = [];
                                            if (obs.trainingLocation === 'home') tags.push(isEn ? '🏠 Home' : '🏠 منزلي');
                                            else if (obs.trainingLocation === 'gym') tags.push(isEn ? '🏋️ Gym' : '🏋️ نادي');
                                            if (t.gender === 'female' && obs.postCSection) tags.push(isEn ? '🤱 Post-C-Section' : '🤱 بعد القيصرية');
                                            if (obs.fitnessLevel) tags.push(obs.fitnessLevel);
                                            if (obs.targetWeight) tags.push(`${isEn ? 'Goal Wt' : 'الهدف'}: ${obs.targetWeight}kg`);
                                            if (Array.isArray(obs.injuries) && obs.injuries.length && !obs.injuries.includes('لا يوجد إصابات')) {
                                                tags.push(`⚠️ ${obs.injuries.slice(0, 2).join(', ')}`);
                                            }
                                            if (tags.length === 0) return '';
                                            return `<div class="mt-2 flex flex-wrap gap-1">${tags.map(tg => `<span class="px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-[10px] font-bold text-gray-300">${tg}</span>`).join('')}</div>`;
                                        })()}
                                        ${(() => {
                                            const cTimeline = (typeof IronLiveGym !== 'undefined' && IronLiveGym.getTraineeCardioTimeline) ? IronLiveGym.getTraineeCardioTimeline(t.id, 3) : [];
                                            if (cTimeline.length === 0) {
                                                return `<div class="mt-2 px-2.5 py-1.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-gray-400 flex items-center justify-between gap-2"><span>🏃 ${isEn ? 'Cardio Evaluation:' : 'تقييم الكارديو:'}</span><span class="font-bold text-gray-500">${isEn ? 'No cardio logged yet' : 'لم يُسجل بعد'}</span></div>`;
                                            }
                                            const latestC = cTimeline[0];
                                            const deltaPill = latestC.trend === 'first'
                                                ? `<span class="text-cyan-300 font-black">🆕 ${isEn ? 'Baseline' : 'أول سجل'}</span>`
                                                : latestC.deltaMinutes > 0
                                                ? `<span class="text-emerald-300 font-black">📈 +${latestC.deltaMinutes}${isEn ? 'm' : 'د'}</span>`
                                                : latestC.deltaMinutes === 0
                                                ? `<span class="text-sky-300 font-black">🎯 ${isEn ? 'Same' : 'ثابت'}</span>`
                                                : `<span class="text-amber-300 font-black">📉 ${latestC.deltaMinutes}${isEn ? 'm' : 'د'}</span>`;
                                            return `<div class="mt-2 px-2.5 py-1.5 rounded-xl bg-sky-950/30 border border-sky-500/30 text-[11px] flex items-center justify-between gap-2"><span class="text-sky-200 font-bold truncate">${latestC.icon} ${isEn ? latestC.machineNameEn : latestC.machineNameAr}: <strong class="text-white">${latestC.durationMinutes} ${isEn ? 'min' : 'د'}</strong></span>${deltaPill}</div>`;
                                        })()}
                                        ${receiptNotice}
                                    </div>

                                    <div class="space-y-2 pt-3 border-t border-slate-800 mt-2">
                                        <div class="flex items-center gap-1.5 flex-wrap">
                                            <button onclick="IronCoachPanel.renewTrainee('${t.id}', 1)" class="px-2 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-xl text-[10px] font-black transition whitespace-nowrap" title="1 SAR">
                                                ${isEn ? '⚡ +1d' : '⚡ +1 يوم'}
                                            </button>
                                            <button onclick="IronCoachPanel.renewTrainee('${t.id}', 30)" class="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black transition whitespace-nowrap" title="139">
                                                ${isEn ? '+1M' : '+1 شهر'}
                                            </button>
                                            <button onclick="IronCoachPanel.renewTrainee('${t.id}', 60)" class="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black transition whitespace-nowrap" title="239">
                                                ${isEn ? '+2M' : '+2 شهر'}
                                            </button>
                                            <button onclick="IronCoachPanel.renewTrainee('${t.id}', 90)" class="flex-1 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-[10px] font-black transition whitespace-nowrap" title="299">
                                                ${isEn ? '+3M 🔥' : '+3 شهور 🔥'}
                                            </button>
                                            <button onclick="IronCoachPanel.impersonateTrainee('${t.id}')" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-[10px] font-bold transition whitespace-nowrap">
                                                <span>${txt("coach_view_btn")}</span>
                                            </button>
                                        </div>
                                        <div class="flex items-center flex-wrap gap-1.5 sm:gap-2">
                                            <button onclick="IronCoachPanel.openEditTraineeModal('${t.id}')" class="flex-1 min-w-[70px] py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 whitespace-nowrap">
                                                <span>${txt("coach_edit_btn")}</span>
                                            </button>
                                            <button onclick="IronCoachPanel.resetTraineeWorkouts('${t.id}')" class="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 rounded-xl text-[11px] font-bold transition whitespace-nowrap" title="${txt("coach_reset_wo_btn")}">
                                                <span>${txt("coach_reset_wo_btn")}</span>
                                            </button>
                                            <button onclick="IronCoachPanel.messageTraineeWhatsapp('${t.id}')" class="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-xl text-[11px] font-bold transition whitespace-nowrap">
                                                <span>${txt("coach_wa_btn")}</span>
                                            </button>
                                            <button onclick="IronCoachPanel.deleteTrainee('${t.id}')" class="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-xl text-[11px] font-bold transition whitespace-nowrap">
                                                <span>🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
                `}
            </div>
        `;
    },

    // قسم البرامج التدريبية بتفاصيلها داخل لوحة الكوتش
    renderCoachProgramsSection(trainees, isEn, txt) {
        const programs = typeof workoutProgramsDatabase !== "undefined" ? workoutProgramsDatabase : [];
        if (programs.length === 0) return "";

        const selectedProg = programs.find(p => p.id === this.selectedCoachProgId) || programs[0];
        const resolveId = (name) => (typeof IronApp !== "undefined" && IronApp.resolveProgramIdFromName) ? IronApp.resolveProgramIdFromName(name) : "prog_ppl";

        return `
            <div class="space-y-5">
                <!-- شبكة بطاقات جميع البرامج التدريبية -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    ${programs.map(p => {
                        const isSelected = p.id === selectedProg.id;
                        const totalExercises = p.days.reduce((acc, d) => acc + d.exercises.length, 0);
                        const assignedCount = trainees.filter(t => resolveId(t.program || "") === p.id).length;
                        const dispName = isEn ? p.nameEn : p.nameAr;
                        return `
                            <button type="button" onclick="IronCoachPanel.selectCoachProgram('${p.id}')"
                                class="text-start rounded-2xl p-4 border transition flex flex-col justify-between gap-2 ${isSelected ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}">
                                <div>
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}">
                                            ${p.level}
                                        </span>
                                        <span class="text-[10px] font-bold text-cyan-400">
                                            👥 ${assignedCount}
                                        </span>
                                    </div>
                                    <h4 class="font-black text-white text-sm leading-snug">${dispName}</h4>
                                    <div class="text-[11px] text-gray-400 mt-1">${p.frequency}</div>
                                </div>
                                <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-bold">
                                    <span class="text-gray-300">${isEn ? `${p.days.length} Days • ${totalExercises} Exercises` : `${p.days.length} أيام • ${totalExercises} تمرين`}</span>
                                    <span class="${isSelected ? 'text-amber-400' : 'text-emerald-400'}">${isSelected ? (isEn ? 'Viewing ✓' : 'معروض ✓') : (isEn ? 'Details →' : 'التفاصيل ←')}</span>
                                </div>
                            </button>
                        `;
                    }).join("")}
                </div>

                <!-- تفاصيل البرنامج التدريبي المحدد (الأيام + التمارين + الجولات والتكرارات والراحة) -->
                <div class="bg-slate-900/85 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-5">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div class="space-y-1.5 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-black">${selectedProg.level}</span>
                                <span class="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 text-xs font-bold">${selectedProg.frequency}</span>
                            </div>
                            <h3 class="text-lg sm:text-xl font-black text-white">${isEn ? selectedProg.nameEn : selectedProg.nameAr}</h3>
                            <p class="text-xs text-gray-300 leading-relaxed" dir="ltr">${isEn ? (selectedProg.descriptionEn || selectedProg.description) : selectedProg.description}</p>
                            ${selectedProg.isPostpartumSafety ? `
                                <div class="csection-safety-banner bg-rose-950/40 border border-rose-500/40 rounded-2xl p-3 mt-2 text-xs">
                                    <strong class="text-rose-300 block mb-0.5">${txt("csection_safety_title")}</strong>
                                    <p class="text-rose-100 leading-relaxed">${txt("csection_safety_desc")}</p>
                                </div>
                            ` : ''}
                        </div>
                        ${selectedProg.image ? `
                            <a href="${selectedProg.image}" target="_blank" class="block w-full md:w-56 h-32 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0 hover:border-amber-500 transition">
                                <img src="${selectedProg.image}" onerror="this.parentElement.style.display='none'" class="w-full h-full object-cover" alt="${selectedProg.nameEn}">
                            </a>
                        ` : ''}
                    </div>

                    <div class="space-y-4">
                        ${selectedProg.days.map(day => `
                            <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 sm:p-5">
                                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3.5" dir="ltr">
                                    <div>
                                        <h4 class="font-black text-white text-sm sm:text-base">${day.title}</h4>
                                        <div class="text-xs text-amber-400 font-bold mt-0.5">${day.targetMuscles}</div>
                                    </div>
                                    <span class="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-cyan-400">
                                        ${day.exercises.length} ${isEn ? 'Exercises' : 'تمرين'}
                                    </span>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3" dir="ltr">
                                    ${day.exercises.map((item, idx) => {
                                        const ex = typeof getExerciseById === "function" ? getExerciseById(item.exerciseId) : null;
                                        const exLabel = item.displayNameEn || ex?.nameEn || item.exerciseId;
                                        const safeExLabel = exLabel.replace(/'/g, "\\'");
                                        const badgeNum = item.pair || `${idx + 1}`;
                                        return `
                                            <div ${ex ? `onclick="IronApp.openExerciseDetail('${ex.id}', '${safeExLabel}')"` : ''} class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-amber-500/45 cursor-pointer transition text-left">
                                                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-400 flex items-center justify-center font-black text-xs flex-shrink-0">
                                                    ${badgeNum}
                                                </div>
                                                ${ex ? `<img src="${ex.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${exLabel}')" class="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-contain bg-slate-950 border border-slate-800 flex-shrink-0" alt="${exLabel}" loading="lazy">` : ''}
                                                <div class="flex-1 min-w-0">
                                                    <h5 class="font-black text-white text-xs truncate">${exLabel}</h5>
                                                    ${ex?.nameAr ? `<div class="text-[11px] text-gray-400 truncate">${ex.nameAr}</div>` : ''}
                                                    <div class="flex items-center gap-2 text-[11px] font-bold mt-1 flex-wrap">
                                                        <span class="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">${item.sets} × ${item.reps}</span>
                                                        <span class="text-gray-400">• Rest ${item.restSec}s</span>
                                                        ${ex?.equipment ? `<span class="text-amber-400/90">• ${ex.equipment}</span>` : ''}
                                                    </div>
                                                </div>
                                                <div class="text-gray-400 text-xs flex-shrink-0">ℹ️</div>
                                            </div>
                                        `;
                                    }).join("")}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;
    },

    handleSearch(val) {
        this.searchQuery = val;
        this.renderCoachDashboard();
        const input = document.getElementById("coachTraineeSearchInput");
        if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    },

    setFilter(status) {
        this.filterStatus = status;
        this.renderCoachDashboard();
    },

    async renewTrainee(id, days = 30) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const addDays = parseInt(days) || 30;
        try {
            const renewed = await IronAuth.renewSubscription(id, addDays);
            if (renewed) {
                const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(renewed) : renewed.name;
                showToast(isEn ? `Subscription renewed +${addDays} days for ${dispName}!` : `تم تجديد اشتراك ${dispName} لمدة ${addDays} يوماً إضافية بنجاح!`, "success");
                this.renderCoachDashboard();
            }
        } catch (err) {
            showToast(err?.message || (isEn ? "Failed to renew subscription" : "فشل تجديد الاشتراك"), "error");
        }
    },

    async viewTraineeReceipt(id) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const trainees = IronAuth.getAllTrainees();
        const t = trainees.find(item => item.id === id);
        if (!t?.lastRenewalReceipt?.path) {
            showToast(isEn ? "No receipt file found" : "لا يوجد ملف إيصال لهذا المشترك", "error");
            return;
        }
        const signedUrl = await IronSupabase.getSignedReceiptUrl(t.lastRenewalReceipt.path);
        if (!signedUrl) {
            showToast(isEn ? "Could not load receipt preview" : "تعذر فتح رابط الإيصال", "error");
            return;
        }
        window.open(signedUrl, "_blank", "noopener,noreferrer");
    },

    openEditTraineeModal(id) {
        const trainees = IronAuth.getAllTrainees().map(t => IronAuth.refreshSubscriptionStatus(t));
        const t = trainees.find(item => item.id === id);
        if (!t) return;

        const setVal = (elId, val) => {
            const el = document.getElementById(elId);
            if (el) el.value = val !== undefined && val !== null ? val : "";
        };

        setVal("editTId", t.id);
        setVal("editTName", t.name);
        setVal("editTPhone", t.phone || "");
        setVal("editTUsername", t.username);
        setVal("editTPassword", "");
        setVal("editTWeight", t.weight || 75);
        setVal("editTHeight", t.height || 175);
        setVal("editTAge", t.age || 26);
        setVal("editTGender", t.gender || "male");
        setVal("editTGoal", t.goal || "تنشيف وخسارة دهون");
        setVal("editTCalories", t.calories || 2000);
        setVal("editTDaysLeft", t.daysLeft !== undefined ? t.daysLeft : 30);
        setVal("editTProgram", t.program || "PPL (Push Pull Legs)");
        setVal("editTCoachNote", t.coachNote || "");

        const obs = (t.onboardingProfile && typeof t.onboardingProfile === "object") ? t.onboardingProfile : {};
        const homeChk = document.getElementById("editTAllowHome");
        const csChk = document.getElementById("editTAllowCSection");
        const resolvedId = (typeof IronApp !== "undefined" && IronApp.resolveProgramIdFromName) ? IronApp.resolveProgramIdFromName(t.program || "") : "";
        if (homeChk) homeChk.checked = obs.trainingLocation === "home" || resolvedId === "prog_home";
        if (csChk) csChk.checked = (t.gender === "female" && Boolean(obs.postCSection)) || resolvedId === "prog_csection";

        const obsBox = document.getElementById("editTObsSummary");
        if (obsBox) {
            const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
            const parts = [];
            if (obs.fitnessLevel) parts.push(`${isEn ? "Level" : "المستوى"}: ${obs.fitnessLevel}`);
            if (obs.targetWeight) parts.push(`${isEn ? "Target Weight" : "الوزن المستهدف"}: ${obs.targetWeight} ${isEn ? "kg" : "كجم"}`);
            if (Array.isArray(obs.injuries) && obs.injuries.length) parts.push(`${isEn ? "Health/Injuries" : "الحالة الصحية"}: ${obs.injuries.join("، ")}`);
            if (Array.isArray(obs.preferredFoods) && obs.preferredFoods.length) parts.push(`${isEn ? "Likes" : "يفضل"}: ${obs.preferredFoods.join("، ")}`);
            if (Array.isArray(obs.dislikedFoods) && obs.dislikedFoods.length) parts.push(`${isEn ? "Dislikes" : "لا يفضل"}: ${obs.dislikedFoods.join("، ")}`);
            if (parts.length > 0) {
                obsBox.innerHTML = `<strong class="text-emerald-400 block">${isEn ? "📋 Client Onboarding Answers:" : "📋 إجابات التسجيل الأولي للعميل:"}</strong>` + parts.map(p => `<div>• ${p}</div>`).join("");
                obsBox.classList.remove("hidden");
            } else {
                obsBox.innerHTML = "";
                obsBox.classList.add("hidden");
            }
        }

        openModal("editTraineeModal");
    },

    async saveEditedTrainee(e) {
        e.preventDefault();
        const id = document.getElementById("editTId")?.value;
        if (!id) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const gender = document.getElementById("editTGender")?.value;
            const allowHome = Boolean(document.getElementById("editTAllowHome")?.checked);
            const allowCSection = gender === "female" && Boolean(document.getElementById("editTAllowCSection")?.checked);
            const updated = await IronAuth.editTrainee(id, {
                name: document.getElementById("editTName")?.value.trim(),
                phone: document.getElementById("editTPhone")?.value.trim(),
                username: document.getElementById("editTUsername")?.value.trim(),
                newPassword: document.getElementById("editTPassword")?.value.trim(),
                weight: document.getElementById("editTWeight")?.value,
                height: document.getElementById("editTHeight")?.value,
                age: document.getElementById("editTAge")?.value,
                gender,
                goal: document.getElementById("editTGoal")?.value,
                calories: document.getElementById("editTCalories")?.value,
                daysLeft: document.getElementById("editTDaysLeft")?.value,
                program: document.getElementById("editTProgram")?.value,
                coachNote: document.getElementById("editTCoachNote")?.value,
                onboardingProfile: {
                    trainingLocation: allowHome ? "home" : "gym",
                    postCSection: allowCSection
                }
            });

            if (updated) {
                closeModal("editTraineeModal");
                const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(updated) : updated.name;
                showToast(isEn ? `Updated ${dispName}'s profile & plan successfully! ✅` : `تم تحديث بيانات وخطة المشترك ${dispName} بنجاح! ✅`, "success");
                this.renderCoachDashboard();
            }
        } catch (err) {
            showToast(err?.message || (isEn ? "Failed to update client" : "فشل تحديث بيانات المشترك"), "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    },

    async deleteTrainee(id) {
        const trainees = IronAuth.getAllTrainees();
        const target = trainees.find(t => t.id === id);
        if (!target) return;

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(target) : target.name;
        if (!window.confirm(isEn ? `Are you sure you want to permanently delete "${dispName}"?` : `هل أنت متأكد من حذف حساب المشترك "${dispName}" نهائياً؟`)) {
            return;
        }

        try {
            const deleted = await IronAuth.deleteTrainee(id);
            if (deleted) {
                showToast(isEn ? `Deleted client ${dispName} from platform` : `تم حذف حساب المشترك ${dispName} من المنصة`, "success");
                this.renderCoachDashboard();
            }
        } catch (err) {
            showToast(err?.message || (isEn ? "Failed to delete client" : "فشل حذف حساب المشترك"), "error");
        }
    },

    async resetTraineeWorkouts(id) {
        const trainees = IronAuth.getAllTrainees();
        const target = trainees.find(t => t.id === id);
        if (!target) return;

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const txt = (k, vars = {}) => typeof IronI18n !== "undefined" ? IronI18n.t(k, vars) : k;
        const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(target) : target.name;

        if (!window.confirm(txt("coach_reset_wo_confirm", { name: dispName }))) {
            return;
        }

        try {
            await IronSupabase.resetClientWorkoutLogs(id);
            try {
                const rawDraft = sessionStorage.getItem("iron_active_workout");
                if (rawDraft) {
                    const draft = JSON.parse(rawDraft);
                    if (!draft.traineeId || draft.traineeId === id) {
                        sessionStorage.removeItem("iron_active_workout");
                    }
                }
            } catch (e) {}
            showToast(txt("coach_reset_wo_toast", { name: dispName }), "success");
        } catch (err) {
            showToast(err?.message || (isEn ? "Failed to reset client workout sets" : "فشل عمل ريسيت لجولات المشترك"), "error");
        }
    },

    messageTraineeWhatsapp(id) {
        const trainees = IronAuth.getAllTrainees().map(t => IronAuth.refreshSubscriptionStatus(t));
        const t = trainees.find(item => item.id === id);
        if (!t) return;

        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const dispName = typeof IronI18n !== "undefined" ? IronI18n.trName(t) : t.name;
        const cleanPhone = (t.phone || "").replace(/\D/g, "");
        if (!cleanPhone) {
            showToast(isEn ? "No phone number recorded for this client yet. Add it via Edit." : "لم يتم تسجيل رقم هاتف لهذا المشترك بعد. يمكنك إضافته من زر التعديل.", "error");
            return;
        }

        const msg = isEn
            ? (t.status === "expired"
                ? `Hi ${dispName} 👋, your Coach from IronCoach Pro here. Your monthly subscription has ended — message me to renew your plan and keep progressing! 💪`
                : `Hi Champ (${dispName}) 👋, checking in on your ${t.program} (${t.calories} kcal) plan. How are workouts and nutrition going this week? 🔥`)
            : (t.status === "expired"
                ? `أهلاً بك يا ${t.name} 👋، معك الكوتش من منصة أيرون كوتش. نود تذكيرك بانتهاء مدة اشتراكك الشهري، تواصل معي لتجديد خطتك ومواصلة التقدم! 💪`
                : `أهلاً بك يا بطل (${t.name}) 👋، معك الكوتش لمتابعة التزامك بالخطة (${t.program} - ${t.calories} سعرة). طمني كيف أخبار التمارين والدايت معك هذا الأسبوع؟ 🔥`);

        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    },

    async exportBackup() {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        try {
            const backup = await IronAuth.exportBackupData();
            if (!backup) throw new Error("Export failed");
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const dateStr = new Date().toISOString().split("T")[0];
            a.href = url;
            a.download = `ironcoach-backup-${dateStr}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast(isEn ? "Platform backup JSON exported successfully! 📥" : "تم تصدير النسخة الاحتياطية لبيانات المنصة بنجاح! 📥", "success");
        } catch (err) {
            showToast(err?.message || (isEn ? "Failed to export backup" : "فشل تصدير النسخة الاحتياطية"), "error");
        }
    },

    importBackup(input) {
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                const result = await IronAuth.importBackupData(parsed);
                if (result.success) {
                    showToast(isEn ? `Backup restored successfully (${result.count} clients)! 🚀` : `تم استعادة النسخة الاحتياطية بنجاح (${result.count} مشتركين)! 🚀`, "success");
                    this.renderCoachDashboard();
                } else {
                    showToast(result.message || (isEn ? "Failed to import file" : "فشل استيراد الملف"), "error");
                }
            } catch (err) {
                showToast(isEn ? "Invalid JSON file" : "ملف JSON غير صالح", "error");
            }
            input.value = "";
        };
        reader.readAsText(file);
    },

    impersonateTrainee(id) {
        IronAuth.impersonateTrainee(id);
    },

    openSettingsModal() {
        const config = getAppConfig();
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val !== undefined && val !== null ? val : "";
        };

        setVal("cfgName", config.coachInfo.name);
        setVal("cfgTitle", config.coachInfo.title);
        setVal("cfgWhatsapp", config.coachInfo.whatsapp);
        setVal("cfgVodafone", config.coachInfo.vodafoneCash);
        setVal("cfgInstapay", config.coachInfo.instapayUser);
        setVal("cfgStc", config.coachInfo.stcPay);
        setVal("cfgBarq", config.coachInfo.barqWallet || config.coachInfo.stcPay || "966563055827");
        setVal("cfgPaymentLink", config.coachInfo.paymentLink);
        setVal("cfgIban", config.coachInfo.bankIban);
        setVal("cfgMonthlyPrice", config.subscriptionPrice?.monthly || 500);
        setVal("cfgCurrency", config.subscriptionPrice?.currency || "ج.م / ر.س");
        setVal("cfgNewPassword", "");

        openModal("coachSettingsModal");
    },

    async saveCoachSettings(form) {
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const config = getAppConfig();
            config.coachInfo.name = form.coachName.value.trim() || config.coachInfo.name;
            config.coachInfo.title = form.coachTitle.value.trim() || config.coachInfo.title;
            config.coachInfo.whatsapp = form.coachWhatsapp.value.trim();
            config.coachInfo.vodafoneCash = form.coachVodafone.value.trim();
            config.coachInfo.instapayUser = form.coachInstapay.value.trim();
            config.coachInfo.stcPay = form.coachStc.value.trim();
            if (form.coachBarq) {
                config.coachInfo.barqWallet = form.coachBarq.value.trim();
            }
            config.coachInfo.bankIban = form.coachIban.value.trim();
            if (form.coachPaymentLink) {
                config.coachInfo.paymentLink = form.coachPaymentLink.value.trim();
            }

            if (form.coachMonthlyPrice) {
                config.subscriptionPrice.monthly = parseInt(form.coachMonthlyPrice.value) || 500;
            }
            if (form.coachCurrency && form.coachCurrency.value.trim()) {
                config.subscriptionPrice.currency = form.coachCurrency.value.trim();
            }

            const saveRes = await saveAppConfig(config);
            if (saveRes?.error) {
                throw new Error(saveRes.error.message || "Failed to save settings");
            }

            if (form.coachNewPassword && form.coachNewPassword.value.trim()) {
                await IronAuth.changeCoachPassword(form.coachNewPassword.value.trim());
            }

            closeModal("coachSettingsModal");
            showToast(isEn ? "Coach settings & payment info saved!" : "تم حفظ إعدادات الكوتش وبيانات الدفع بنجاح!", "success");

            const user = IronAuth.getCurrentUser();
            if (user && typeof IronApp !== "undefined") {
                IronApp.renderUserHeader(user);
            }
            this.renderCoachDashboard();
        } catch (err) {
            showToast(err?.message || (isEn ? "Failed to save coach settings" : "تعذر حفظ الإعدادات"), "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    }
};
