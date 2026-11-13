/**
 * IronCoach Pro - Coach Admin Master Panel
 * لوحة تحكم وإدارة الكوتش للمشتركين والاشتراكات والإعدادات
 */

const IronCoachPanel = {
    filterStatus: "all",

    // رسم واجهة لوحة تحكم الكوتش
    renderCoachDashboard() {
        const container = document.getElementById("coachDashboardView");
        if (!container) return;

        const trainees = IronAuth.getAllTrainees().map(t => IronAuth.refreshSubscriptionStatus(t));
        const config = getAppConfig();

        const activeCount = trainees.filter(t => t.status === "active").length;
        const expiringCount = trainees.filter(t => t.status === "expiring").length;
        const expiredCount = trainees.filter(t => t.status === "expired").length;

        let filteredTrainees = trainees;
        if (this.filterStatus !== "all") {
            filteredTrainees = trainees.filter(t => t.status === this.filterStatus);
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- شريط الترحيب والإحصائيات السريعة -->
                <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                                <span>👑 لوحة تحكم الكوتش الرسمية</span>
                            </div>
                            <h2 class="text-2xl font-black text-white">أهلاً بك، ${config.coachInfo.name} 👋</h2>
                            <p class="text-xs text-gray-400 mt-1">${config.coachInfo.title} | متابعة المشتركين وتحديث الخطط</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="openModal('addTraineeModal')" class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2">
                                <span>+ إضافة مشترك جديد</span>
                            </button>
                            <button onclick="openModal('coachSettingsModal')" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2">
                                <span>⚙️ إعدادات الدفع والواتساب</span>
                            </button>
                        </div>
                    </div>

                    <!-- شبكة الإحصائيات -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                            <div class="text-xs text-gray-400 font-bold mb-1">إجمالي المتدربين</div>
                            <div class="text-2xl font-black text-white">${trainees.length}</div>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                            <div class="text-xs text-emerald-400 font-bold mb-1">اشتراكات سارية</div>
                            <div class="text-2xl font-black text-emerald-400">${activeCount}</div>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                            <div class="text-xs text-amber-400 font-bold mb-1">تنتهي قريباً (≤3 أيام)</div>
                            <div class="text-2xl font-black text-amber-400">${expiringCount}</div>
                        </div>
                        <div class="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                            <div class="text-xs text-rose-400 font-bold mb-1">اشتراكات منتهية</div>
                            <div class="text-2xl font-black text-rose-400">${expiredCount}</div>
                        </div>
                    </div>
                </div>

                <!-- شريط فلترة المشتركين -->
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <h3 class="text-lg font-black text-white flex items-center gap-2">
                        <span>قائمة المشتركين (${filteredTrainees.length})</span>
                    </h3>
                    <div class="flex items-center gap-2">
                        <button onclick="IronCoachPanel.setFilter('all')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'all' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-gray-300'}">الكل</button>
                        <button onclick="IronCoachPanel.setFilter('active')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'active' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-gray-300'}">السارية (${activeCount})</button>
                        <button onclick="IronCoachPanel.setFilter('expiring')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'expiring' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-gray-300'}">تنتهي قريباً (${expiringCount})</button>
                        <button onclick="IronCoachPanel.setFilter('expired')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'expired' ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-gray-300'}">منتهية (${expiredCount})</button>
                    </div>
                </div>

                <!-- بطاقات المشتركين -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${filteredTrainees.map(t => {
                        const statusBadge = t.status === 'active' 
                            ? `<span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">نشط (باقي ${t.daysLeft} يوم)</span>`
                            : t.status === 'expiring'
                            ? `<span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">ينتهي قريباً (${t.daysLeft} يوم)</span>`
                            : `<span class="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">منتهي الاشتراك ⚠️</span>`;

                        return `
                            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
                                <div>
                                    <div class="flex justify-between items-start gap-2 mb-3">
                                        <div>
                                            <h4 class="font-black text-white text-base">${t.name}</h4>
                                            <span class="text-xs text-gray-400 font-mono">@${t.username} • ${t.phone || 'بدون هاتف'}</span>
                                        </div>
                                        ${statusBadge}
                                    </div>

                                    <div class="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 my-3">
                                        <div>
                                            <span class="text-gray-400">الهدف:</span>
                                            <div class="font-bold text-white">${t.goal || 'تنشيف'}</div>
                                        </div>
                                        <div>
                                            <span class="text-gray-400">السعرات:</span>
                                            <div class="font-bold text-emerald-400">${t.calories || 2000} kcal</div>
                                        </div>
                                        <div>
                                            <span class="text-gray-400">الوزن:</span>
                                            <div class="font-bold text-white">${t.weight} كجم</div>
                                        </div>
                                        <div>
                                            <span class="text-gray-400">البرنامج:</span>
                                            <div class="font-bold text-cyan-400 truncate">${t.program || 'PPL'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-2">
                                    <button onclick="IronCoachPanel.renewTrainee('${t.id}')" class="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                                        <span>تجديد 30 يوماً 🔄</span>
                                    </button>
                                    <button onclick="IronCoachPanel.impersonateTrainee('${t.id}')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1" title="معاينة حساب المتدرب">
                                        <span>👁️ دخول لحسابه</span>
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    setFilter(status) {
        this.filterStatus = status;
        this.renderCoachDashboard();
    },

    renewTrainee(id) {
        const renewed = IronAuth.renewSubscription(id, 30);
        if (renewed) {
            showToast(`تم تجديد اشتراك ${renewed.name} لمدة 30 يوماً إضافية بنجاح!`, "success");
            this.renderCoachDashboard();
        }
    },

    impersonateTrainee(id) {
        const trainees = IronAuth.getAllTrainees();
        const trainee = trainees.find(t => t.id === id);
        if (trainee) {
            const traineeUser = {
                role: "trainee",
                id: trainee.id,
                name: trainee.name,
                username: trainee.username,
                status: trainee.status,
                daysLeft: trainee.daysLeft,
                traineeData: trainee,
                isImpersonating: true
            };
            localStorage.setItem("iron_session", JSON.stringify(traineeUser));
            window.location.reload();
        }
    },

    saveCoachSettings(form) {
        const config = getAppConfig();
        config.coachInfo.name = form.coachName.value;
        config.coachInfo.title = form.coachTitle.value;
        config.coachInfo.whatsapp = form.coachWhatsapp.value;
        config.coachInfo.vodafoneCash = form.coachVodafone.value;
        config.coachInfo.instapayUser = form.coachInstapay.value;
        config.coachInfo.stcPay = form.coachStc.value;
        config.coachInfo.bankIban = form.coachIban.value;
        config.coachInfo.paymentLink = form.coachPaymentLink.value;

        saveAppConfig(config);
        closeModal("coachSettingsModal");
        showToast("تم حفظ إعدادات الكوتش وبيانات الدفع بنجاح!", "success");
        this.renderCoachDashboard();
    }
};
