/**
 * IronCoach Pro - Coach Admin Master Panel
 * لوحة تحكم وإدارة الكوتش للمشتركين والاشتراكات والإعدادات والنسخ الاحتياطي
 */

const IronCoachPanel = {
    filterStatus: "all",
    searchQuery: "",

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
            filteredTrainees = filteredTrainees.filter(t => t.status === this.filterStatus);
        }

        if (this.searchQuery && this.searchQuery.trim() !== "") {
            const q = this.searchQuery.trim().toLowerCase();
            filteredTrainees = filteredTrainees.filter(t =>
                (t.name && t.name.toLowerCase().includes(q)) ||
                (t.username && t.username.toLowerCase().includes(q)) ||
                (t.phone && t.phone.toLowerCase().includes(q)) ||
                (t.goal && t.goal.toLowerCase().includes(q))
            );
        }

        container.innerHTML = `
            <div class="space-y-6">
                <!-- شريط الترحيب والإحصائيات السريعة -->
                <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                    <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                                <span>👑 لوحة تحكم الكوتش الرسمية</span>
                            </div>
                            <h2 class="text-2xl font-black text-white">أهلاً بك، ${config.coachInfo.name} 👋</h2>
                            <p class="text-xs text-gray-400 mt-1">${config.coachInfo.title} | إدارة المشتركين، تعديل الخطط، والنسخ الاحتياطي</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="openModal('addTraineeModal')" class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5">
                                <span>+ إضافة مشترك جديد</span>
                            </button>
                            <button onclick="IronCoachPanel.openSettingsModal()" class="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5">
                                <span>⚙️ إعدادات الدفع</span>
                            </button>
                            <button onclick="IronCoachPanel.exportBackup()" class="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5" title="تحميل نسخة احتياطية لكافة المشتركين والبيانات">
                                <span>📥 نسخ احتياطي</span>
                            </button>
                            <label class="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer" title="استعادة بيانات من ملف JSON">
                                <span>📤 استعادة</span>
                                <input type="file" accept=".json,application/json" onchange="IronCoachPanel.importBackup(this)" class="hidden">
                            </label>
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

                <!-- شريط البحث وفلترة المشتركين -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                    <div class="flex items-center gap-3 flex-1">
                        <h3 class="text-base font-black text-white whitespace-nowrap">
                            <span>المشتركين (${filteredTrainees.length})</span>
                        </h3>
                        <input type="text" id="coachTraineeSearchInput" value="${this.searchQuery}"
                            oninput="IronCoachPanel.handleSearch(this.value)"
                            placeholder="🔍 ابحث بالاسم، اسم المستخدم، أو رقم الهاتف..."
                            class="w-full max-w-sm bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold placeholder-gray-500 outline-none">
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <button onclick="IronCoachPanel.setFilter('all')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'all' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-gray-300'}">الكل (${trainees.length})</button>
                        <button onclick="IronCoachPanel.setFilter('active')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'active' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-gray-300'}">السارية (${activeCount})</button>
                        <button onclick="IronCoachPanel.setFilter('expiring')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'expiring' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-gray-300'}">تنتهي قريباً (${expiringCount})</button>
                        <button onclick="IronCoachPanel.setFilter('expired')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${this.filterStatus === 'expired' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-800 text-gray-300'}">منتهية (${expiredCount})</button>
                    </div>
                </div>

                <!-- بطاقات المشتركين -->
                ${filteredTrainees.length === 0 ? `
                    <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 text-center text-gray-400 text-sm font-bold">
                        لا يوجد مشتركين يطابقون البحث أو الفلتر المحدد حالياً.
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${filteredTrainees.map(t => {
                            const statusBadge = t.status === 'active'
                                ? `<span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">نشط (باقي ${t.daysLeft} يوم)</span>`
                                : t.status === 'expiring'
                                ? `<span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">ينتهي قريباً (${t.daysLeft} يوم)</span>`
                                : `<span class="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">منتهي الاشتراك ⚠️</span>`;

                            const checkinsCount = Array.isArray(t.history) ? t.history.length : 0;

                            return `
                                <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition flex flex-col justify-between">
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
                                                <div class="font-bold text-white truncate">${t.goal || 'تنشيف'}</div>
                                            </div>
                                            <div>
                                                <span class="text-gray-400">السعرات:</span>
                                                <div class="font-bold text-emerald-400">${t.calories || 2000} kcal</div>
                                            </div>
                                            <div>
                                                <span class="text-gray-400">الوزن / المتابعات:</span>
                                                <div class="font-bold text-white">${t.weight} كجم (${checkinsCount} قراءات)</div>
                                            </div>
                                            <div>
                                                <span class="text-gray-400">البرنامج:</span>
                                                <div class="font-bold text-cyan-400 truncate">${t.program || 'PPL'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-2 pt-3 border-t border-slate-800 mt-2">
                                        <div class="flex items-center gap-2">
                                            <button onclick="IronCoachPanel.renewTrainee('${t.id}')" class="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                                                <span>🔄 تجديد +30 يوم</span>
                                            </button>
                                            <button onclick="IronCoachPanel.impersonateTrainee('${t.id}')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1" title="معاينة حساب المتدرب">
                                                <span>👁️ حسابه</span>
                                            </button>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <button onclick="IronCoachPanel.openEditTraineeModal('${t.id}')" class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1">
                                                <span>✏️ تعديل البيانات</span>
                                            </button>
                                            <button onclick="IronCoachPanel.messageTraineeWhatsapp('${t.id}')" class="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-xl text-[11px] font-bold transition" title="مراسلة المتدرب عبر واتساب">
                                                <span>💬 واتساب</span>
                                            </button>
                                            <button onclick="IronCoachPanel.deleteTrainee('${t.id}')" class="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-xl text-[11px] font-bold transition" title="حذف المشترك">
                                                <span>🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
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

    renewTrainee(id) {
        const renewed = IronAuth.renewSubscription(id, 30);
        if (renewed) {
            showToast(`تم تجديد اشتراك ${renewed.name} لمدة 30 يوماً إضافية بنجاح!`, "success");
            this.renderCoachDashboard();
        }
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

        openModal("editTraineeModal");
    },

    saveEditedTrainee(e) {
        e.preventDefault();
        const form = e.target;
        const id = document.getElementById("editTId")?.value;
        if (!id) return;

        const updated = IronAuth.editTrainee(id, {
            name: document.getElementById("editTName")?.value.trim(),
            phone: document.getElementById("editTPhone")?.value.trim(),
            username: document.getElementById("editTUsername")?.value.trim(),
            newPassword: document.getElementById("editTPassword")?.value.trim(),
            weight: document.getElementById("editTWeight")?.value,
            height: document.getElementById("editTHeight")?.value,
            age: document.getElementById("editTAge")?.value,
            gender: document.getElementById("editTGender")?.value,
            goal: document.getElementById("editTGoal")?.value,
            calories: document.getElementById("editTCalories")?.value,
            daysLeft: document.getElementById("editTDaysLeft")?.value,
            program: document.getElementById("editTProgram")?.value
        });

        if (updated) {
            closeModal("editTraineeModal");
            showToast(`تم تحديث بيانات وخطة المشترك ${updated.name} بنجاح! ✅`, "success");
            this.renderCoachDashboard();
        }
    },

    deleteTrainee(id) {
        const trainees = IronAuth.getAllTrainees();
        const target = trainees.find(t => t.id === id);
        if (!target) return;

        if (!window.confirm(`هل أنت متأكد من حذف حساب المشترك "${target.name}" نهائياً؟`)) {
            return;
        }

        const deleted = IronAuth.deleteTrainee(id);
        if (deleted) {
            showToast(`تم حذف حساب المشترك ${deleted.name} من المنصة`, "success");
            this.renderCoachDashboard();
        }
    },

    messageTraineeWhatsapp(id) {
        const trainees = IronAuth.getAllTrainees().map(t => IronAuth.refreshSubscriptionStatus(t));
        const t = trainees.find(item => item.id === id);
        if (!t) return;

        const cleanPhone = (t.phone || "").replace(/\D/g, "");
        if (!cleanPhone) {
            showToast("لم يتم تسجيل رقم هاتف لهذا المشترك بعد. يمكنك إضافته من زر التعديل.", "error");
            return;
        }

        const msg = t.status === "expired"
            ? `أهلاً بك يا ${t.name} 👋، معك الكوتش من منصة أيرون كوتش. نود تذكيرك بانتهاء مدة اشتراكك الشهري، تواصل معي لتجديد خطتك ومواصلة التقدم! 💪`
            : `أهلاً بك يا بطل (${t.name}) 👋، معك الكوتش لمتابعة التزامك بالخطة (${t.program} - ${t.calories} سعرة). طمني كيف أخبار التمارين والدايت معك هذا الأسبوع؟ 🔥`;

        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    },

    exportBackup() {
        const backup = IronAuth.exportBackupData();
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
        showToast("تم تصدير النسخة الاحتياطية لبيانات المنصة بنجاح! 📥", "success");
    },

    importBackup(input) {
        if (!input.files || !input.files[0]) return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                const result = IronAuth.importBackupData(parsed);
                if (result.success) {
                    showToast(`تم استعادة النسخة الاحتياطية بنجاح (${result.count} مشتركين)! 🚀`, "success");
                    this.renderCoachDashboard();
                } else {
                    showToast(result.message || "فشل استيراد الملف", "error");
                }
            } catch (err) {
                showToast("ملف JSON غير صالح", "error");
            }
            input.value = "";
        };
        reader.readAsText(file);
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
        setVal("cfgPaymentLink", config.coachInfo.paymentLink);
        setVal("cfgIban", config.coachInfo.bankIban);
        setVal("cfgMonthlyPrice", config.subscriptionPrice?.monthly || 500);
        setVal("cfgCurrency", config.subscriptionPrice?.currency || "ج.م / ر.س");
        setVal("cfgNewPassword", "");

        openModal("coachSettingsModal");
    },

    saveCoachSettings(form) {
        const config = getAppConfig();
        config.coachInfo.name = form.coachName.value.trim() || config.coachInfo.name;
        config.coachInfo.title = form.coachTitle.value.trim() || config.coachInfo.title;
        config.coachInfo.whatsapp = form.coachWhatsapp.value.trim();
        config.coachInfo.vodafoneCash = form.coachVodafone.value.trim();
        config.coachInfo.instapayUser = form.coachInstapay.value.trim();
        config.coachInfo.stcPay = form.coachStc.value.trim();
        config.coachInfo.bankIban = form.coachIban.value.trim();
        config.coachInfo.paymentLink = form.coachPaymentLink.value.trim();

        if (form.coachMonthlyPrice) {
            config.subscriptionPrice.monthly = parseInt(form.coachMonthlyPrice.value) || 500;
        }
        if (form.coachCurrency && form.coachCurrency.value.trim()) {
            config.subscriptionPrice.currency = form.coachCurrency.value.trim();
        }
        if (form.coachNewPassword && form.coachNewPassword.value.trim()) {
            config.coachInfo.passwordHash = hashPassword(form.coachNewPassword.value.trim());
        }

        saveAppConfig(config);
        closeModal("coachSettingsModal");
        showToast("تم حفظ إعدادات الكوتش وبيانات الدفع بنجاح!", "success");

        const user = IronAuth.getCurrentUser();
        if (user && typeof IronApp !== "undefined") {
            IronApp.renderUserHeader(user);
        }
        this.renderCoachDashboard();
    }
};
