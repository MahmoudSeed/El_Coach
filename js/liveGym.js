/**
 * IronCoach Pro - Live Gym Workout Tracker & Audio Rest Timer
 * وضع التدريب النشط في الجيم، تسجيل الأوزان، مؤقت الراحة الصوتي التفاعلي، واستبدال التمارين البديلة
 */

const IronLiveGym = {
    currentWorkout: null,
    activeExerciseIndex: 0,
    timerInterval: null,
    timerSecondsRemaining: 0,
    timerTotalSeconds: 60,

    // حفظ مسودة الجلسة النشطة مرتبطة بمعرف المتدرب لمنع تداخل البيانات
    saveDraftSession() {
        if (this.currentWorkout) {
            try {
                const user = IronAuth.getCurrentUser();
                sessionStorage.setItem("iron_active_workout", JSON.stringify({
                    version: 2,
                    traineeId: user && user.id ? user.id : null,
                    workout: this.currentWorkout,
                    activeExerciseIndex: this.activeExerciseIndex
                }));
            } catch (e) {}
        } else {
            sessionStorage.removeItem("iron_active_workout");
        }
    },

    // بدء جلسة تمرين لبرنامج ويوم معين
    startWorkoutSession(programId, dayId) {
        const program = getProgramById(programId);
        if (!program) return false;

        const day = program.days.find(d => d.dayId === dayId);
        if (!day) return false;

        const user = IronAuth.getCurrentUser();
        const currentTraineeId = user && user.id ? user.id : null;

        // التحقق مما إذا كان هناك تمرين نشط محفوظ لنفس اليوم ونفس المتدرب فقط
        try {
            const savedRaw = sessionStorage.getItem("iron_active_workout");
            if (savedRaw) {
                const parsed = JSON.parse(savedRaw);
                if (parsed.version === 2 && parsed.traineeId === currentTraineeId && parsed.workout && parsed.workout.programId === programId && parsed.workout.dayId === dayId) {
                    this.currentWorkout = parsed.workout;
                    this.activeExerciseIndex = parsed.activeExerciseIndex || 0;
                    this.renderLiveGymModal();
                    return true;
                }
            }
        } catch (e) {}

        // تجهيز بيانات الجلسة مع حفظ الجولات مطابقة للتصميم المعتمد
        this.currentWorkout = {
            programId,
            programName: program.nameEn || program.nameAr,
            dayId,
            dayTitle: day.title,
            targetMuscles: day.targetMuscles,
            startedAt: new Date().toISOString(),
            exercises: day.exercises.map(item => {
                const exDetails = getExerciseById(item.exerciseId);
                const setsData = [];
                for (let i = 1; i <= item.sets; i++) {
                    setsData.push({
                        setNumber: i,
                        targetReps: item.reps,
                        weight: "",
                        actualReps: "",
                        completed: false
                    });
                }
                return {
                    exerciseId: item.exerciseId,
                    displayNameEn: item.displayNameEn || (exDetails ? exDetails.nameEn : item.exerciseId),
                    pair: item.pair || "",
                    details: exDetails,
                    setsTarget: item.sets,
                    repsTarget: item.reps,
                    restSec: item.restSec || 60,
                    sets: setsData
                };
            })
        };

        this.activeExerciseIndex = 0;
        this.saveDraftSession();
        this.renderLiveGymModal();
        return true;
    },

    // تشغيل تنبيه صوتي عبر Web Audio API بدون الحاجة لتحميل ملفات صوتية
    playTimerBeep() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            const playTone = (freq, start, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + duration);
            };

            playTone(587.33, 0, 0.15); // D5
            playTone(880, 0.18, 0.35);  // A5
        } catch (e) {
            console.log("Audio not supported or blocked");
        }
    },

    updateTimerDOM() {
        const timerText = document.getElementById("gymTimerCountdown");
        const progressBar = document.getElementById("gymTimerProgressBar");
        const m = Math.floor(Math.max(0, this.timerSecondsRemaining) / 60);
        const s = Math.max(0, this.timerSecondsRemaining) % 60;

        if (timerText) {
            timerText.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
        if (progressBar && this.timerTotalSeconds > 0) {
            const pct = Math.max(0, Math.min(100, Math.round((this.timerSecondsRemaining / this.timerTotalSeconds) * 100)));
            progressBar.style.width = `${pct}%`;
        }
    },

    // بدء مؤقت الراحة
    startRestTimer(seconds) {
        clearInterval(this.timerInterval);
        this.timerSecondsRemaining = seconds;
        this.timerTotalSeconds = seconds;

        const timerBox = document.getElementById("gymTimerBox");
        const timerText = document.getElementById("gymTimerCountdown");
        if (timerBox) timerBox.classList.remove("hidden");

        const tick = () => {
            this.updateTimerDOM();

            if (this.timerSecondsRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.playTimerBeep();
                const doneTxt = typeof IronI18n !== "undefined" ? IronI18n.t("timer_done") : "انتهت الراحة! ابدأ 🔥";
                if (timerText) timerText.innerText = doneTxt;
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                return;
            }
            this.timerSecondsRemaining--;
        };

        tick();
        this.timerInterval = setInterval(tick, 1000);
    },

    // تعديل وقت الراحة النشط (+15ث أو -15ث)
    adjustRestTimer(deltaSeconds) {
        this.timerSecondsRemaining = Math.max(0, this.timerSecondsRemaining + deltaSeconds);
        this.timerTotalSeconds = Math.max(this.timerTotalSeconds, this.timerSecondsRemaining);
        this.updateTimerDOM();
    },

    stopRestTimer() {
        clearInterval(this.timerInterval);
        const timerBox = document.getElementById("gymTimerBox");
        if (timerBox) timerBox.classList.add("hidden");
    },

    // وضع علامة إتمام على جولة معينة
    toggleSetComplete(exerciseIdx, setIdx) {
        if (!this.currentWorkout) return;
        const ex = this.currentWorkout.exercises[exerciseIdx];
        const s = ex.sets[setIdx];
        s.completed = !s.completed;

        if (s.completed) {
            this.startRestTimer(ex.restSec);
        }

        this.saveDraftSession();
        this.renderLiveGymModal();
    },

    // ريسيت (تصفير) جولات التمرين الحالي فقط
    resetExerciseSets(exerciseIdx) {
        if (!this.currentWorkout || !this.currentWorkout.exercises[exerciseIdx]) return;
        const ex = this.currentWorkout.exercises[exerciseIdx];
        ex.sets.forEach(s => {
            s.completed = false;
            s.weight = "";
            s.actualReps = "";
        });
        this.stopRestTimer();
        this.saveDraftSession();
        this.renderLiveGymModal();
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const msg = typeof IronI18n !== "undefined"
            ? IronI18n.t("gym_reset_ex_toast")
            : (isEn ? "Exercise sets reset successfully 🔄" : "تم عمل ريسيت لجولات هذا التمرين بنجاح 🔄");
        showToast(msg, "success");
    },

    // ريسيت (تصفير) جميع جولات وتمارين الجلسة الحالية بالكامل
    resetAllWorkoutSets() {
        if (!this.currentWorkout) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();
        const confirmMsg = typeof IronI18n !== "undefined"
            ? IronI18n.t("gym_reset_all_confirm")
            : (isEn ? "Reset all exercise sets and weights in this workout session?" : "هل تريد عمل ريسيت (تصفير) لجميع جولات وأوزان هذه الجلسة؟");
        if (!window.confirm(confirmMsg)) return;

        this.currentWorkout.exercises.forEach(ex => {
            ex.sets.forEach(s => {
                s.completed = false;
                s.weight = "";
                s.actualReps = "";
            });
        });
        this.stopRestTimer();
        this.saveDraftSession();
        this.renderLiveGymModal();
        const toastMsg = typeof IronI18n !== "undefined"
            ? IronI18n.t("gym_reset_all_toast")
            : (isEn ? "All sets in this session have been reset 🔄" : "تم عمل ريسيت لجميع جولات الجلسة بنجاح 🔄");
        showToast(toastMsg, "success");
    },

    // استبدال التمرين الحالي بتمرين بديل فوري
    swapCurrentExercise(exerciseIdx, newExerciseId) {
        if (!this.currentWorkout) return;
        const newDetails = getExerciseById(newExerciseId);
        if (!newDetails) return;

        const oldEx = this.currentWorkout.exercises[exerciseIdx];
        oldEx.exerciseId = newExerciseId;
        oldEx.displayNameEn = newDetails.nameEn;
        oldEx.details = newDetails;

        this.saveDraftSession();
        closeModal("altExercisesModal");
        this.renderLiveGymModal();
        showToast(`Swapped to: ${newDetails.nameEn}`, "success");
    },

    // فتح نافذة اختيار تمرين بديل
    openAlternativesModal(exerciseIdx) {
        const ex = this.currentWorkout.exercises[exerciseIdx];
        const alternatives = getAlternativeExercises(ex.exerciseId);
        const container = document.getElementById("altExercisesList");
        if (!container) return;

        if (alternatives.length === 0) {
            container.innerHTML = `<div class="text-center py-6 text-gray-400">No direct alternative listed. Use dumbbells or a cable machine targeting the same muscle.</div>`;
        } else {
            container.innerHTML = alternatives.map(altRaw => {
                const alt = typeof IronI18n !== "undefined" ? IronI18n.trExercise(altRaw) : altRaw;
                return `
                <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-emerald-500/50 transition">
                    <img src="${alt.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${alt.muscle}')" class="w-16 h-16 rounded-lg object-cover border border-slate-700 bg-slate-950" alt="${alt.nameEn}">
                    <div class="flex-1 text-left" dir="ltr">
                        <h4 class="font-black text-white text-sm">${alt.nameEn}</h4>
                        <div class="text-xs text-emerald-400 mt-0.5">${alt.equipment}</div>
                    </div>
                    <button onclick="IronLiveGym.swapCurrentExercise(${exerciseIdx}, '${alt.id}')" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition shadow-lg shadow-emerald-500/20">
                        ${typeof IronI18n !== "undefined" ? IronI18n.t("gym_alt_pick") : "اختيار كبديل"}
                    </button>
                </div>
            `;
            }).join("");
        }

        openModal("altExercisesModal");
    },

    // إنهاء التمرين وحفظ البيانات وأسماء التمارين المنجزة في سجل المتدرب
    async finishWorkout() {
        if (!this.currentWorkout) return;
        const isEn = typeof IronI18n !== "undefined" && IronI18n.isEn();

        const totalSets = this.currentWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
        const completedSets = this.currentWorkout.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);

        if (completedSets === 0) {
            const errMsg = typeof IronI18n !== "undefined"
                ? IronI18n.t("gym_err_no_sets")
                : (isEn ? "Please mark at least one set as Complete (✓) before saving the workout" : "يرجى إتمام جولة واحدة على الأقل (الضغط على Complete) قبل حفظ التمرين");
            showToast(errMsg, "error");
            return;
        }

        this.stopRestTimer();

        const user = IronAuth.getCurrentUser();
        const traineeId = user && user.id ? user.id : "guest";

        const totalVolumeKg = this.currentWorkout.exercises.reduce((acc, ex) => {
            return acc + ex.sets.reduce((sAcc, s) => {
                const w = parseFloat(s.weight) || 0;
                const r = parseInt(s.actualReps) || parseInt(ex.repsTarget) || 8;
                return sAcc + (s.completed && w > 0 ? w * r : 0);
            }, 0);
        }, 0);

        // استخراج أسماء التمارين التي تم إنجازها (كلياً أو جزئياً) مع عدد الجولات وأعلى وزن
        const completedExercises = this.currentWorkout.exercises
            .map(ex => {
                const doneSets = ex.sets.filter(s => s.completed);
                if (doneSets.length === 0) return null;
                const maxWeightKg = doneSets.reduce((max, s) => Math.max(max, parseFloat(s.weight) || 0), 0);
                return {
                    exerciseId: ex.exerciseId,
                    name: ex.displayNameEn || (ex.details ? ex.details.nameEn : ex.exerciseId),
                    completedSets: doneSets.length,
                    totalSets: ex.sets.length,
                    isFull: doneSets.length === ex.sets.length,
                    maxWeightKg: Math.round(maxWeightKg * 10) / 10
                };
            })
            .filter(Boolean);

        const entry = {
            id: "log_" + Date.now(),
            traineeId,
            date: new Date().toISOString(),
            programId: this.currentWorkout.programId,
            programName: this.currentWorkout.programName,
            dayTitle: this.currentWorkout.dayTitle,
            completedSets,
            totalSets,
            totalVolumeKg: Math.round(totalVolumeKg),
            completedExercises
        };
        if (typeof IronSupabase !== "undefined" && IronSupabase.isAvailable() && user?.id) {
            await IronSupabase.insertWorkoutLog(entry, user.traineeData?.authUserId || null);
        } else if (typeof IronSupabase !== "undefined") {
            IronSupabase.cache.workoutLogs.unshift(entry);
        }

        sessionStorage.removeItem("iron_active_workout");
        closeModal("liveGymModal");
        showToast(isEn ? "Great workout! 🔥 Session & completed exercises saved" : "عاش يا وحش! 🔥 تم حفظ الجلسة وأسماء التمارين المنجزة في سجلك", "success");
        this.currentWorkout = null;

        if (typeof IronApp !== "undefined") {
            if (IronApp.renderWorkoutLogs) IronApp.renderWorkoutLogs();
            if (IronApp.selectProgram) IronApp.selectProgram(IronApp.selectedProgramId);
        }
    },

    // رسم واجهة الجيم التفاعلية (التمارين بالإنجليزية ومطابقة لعدد الجولات والتكرارات بالتصميم)
    renderLiveGymModal() {
        const modal = document.getElementById("liveGymModalContent");
        if (!modal || !this.currentWorkout) return;

        const w = this.currentWorkout;
        const ex = w.exercises[this.activeExerciseIndex];
        const rawDetails = ex.details || { nameEn: ex.displayNameEn, gif: "", muscle: "Workout", execution: "" };
        const details = typeof IronI18n !== "undefined" ? IronI18n.trExercise(rawDetails) : rawDetails;
        const exerciseTitleEn = ex.displayNameEn || details.nameEn;

        const txt = (k, v) => typeof IronI18n !== "undefined" ? IronI18n.t(k, v) : k;
        const doneExercisesInSession = w.exercises
            .map(item => {
                const dCount = item.sets.filter(s => s.completed).length;
                if (dCount === 0) return null;
                return {
                    name: item.displayNameEn || item.details?.nameEn || item.exerciseId,
                    done: dCount,
                    total: item.sets.length,
                    full: dCount === item.sets.length
                };
            })
            .filter(Boolean);

        modal.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3 sm:mb-4">
                <div dir="ltr" class="text-left min-w-0 flex-1">
                    <span class="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block max-w-full truncate">${w.programName}</span>
                    <h3 class="text-base sm:text-lg font-black text-white mt-1 truncate">${w.dayTitle}</h3>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <button onclick="IronLiveGym.resetAllWorkoutSets()" class="px-2 sm:px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[11px] sm:text-xs rounded-lg transition whitespace-nowrap">
                        ${txt("gym_reset_all_btn")}
                    </button>
                    <button onclick="IronLiveGym.finishWorkout()" class="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[11px] sm:text-xs rounded-lg shadow-lg shadow-emerald-500/20 hover:opacity-90 whitespace-nowrap">
                        ${txt("gym_finish")}
                    </button>
                    <button onclick="closeModal('liveGymModal')" class="text-gray-400 hover:text-white text-xl p-1">✕</button>
                </div>
            </div>

            <!-- مؤشر التنقل بين تمارين اليوم (عمودان على الجوال، صفان متناسقان على الشاشات الأوسع) -->
            <div class="live-gym-ex-tabs grid gap-1.5 sm:gap-2 mb-3" dir="ltr" style="--gym-cols: ${Math.max(2, Math.ceil(w.exercises.length / 2))};">
                ${w.exercises.map((item, idx) => {
                    const label = item.displayNameEn || item.details?.nameEn || `Exercise ${idx + 1}`;
                    const prefix = item.pair ? `${item.pair}.` : `${idx + 1}.`;
                    const doneSetsCount = item.sets.filter(s => s.completed).length;
                    const totalSetsCount = item.sets.length;
                    const isAllDone = doneSetsCount === totalSetsCount && totalSetsCount > 0;
                    const isPartialDone = doneSetsCount > 0 && doneSetsCount < totalSetsCount;
                    const isActive = idx === this.activeExerciseIndex;
                    const progressBadge = isAllDone
                        ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'}">✓ ${doneSetsCount}/${totalSetsCount}</span>`
                        : isPartialDone
                        ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-amber-500/20 text-amber-400'}">⚡ ${doneSetsCount}/${totalSetsCount}</span>`
                        : '';
                    return `
                        <button onclick="IronLiveGym.activeExerciseIndex = ${idx}; IronLiveGym.saveDraftSession(); IronLiveGym.renderLiveGymModal();" 
                            class="px-2.5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between gap-1.5 text-left min-w-0 ${isActive ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : isAllDone ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30' : isPartialDone ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}">
                            <span class="truncate" title="${prefix} ${label}">${prefix} ${label}</span>
                            ${progressBadge}
                        </button>
                    `;
                }).join('')}
            </div>

            ${doneExercisesInSession.length > 0 ? `
                <div class="bg-slate-900/90 border border-sky-500/30 rounded-xl p-2.5 mb-4">
                    <div class="text-[11px] font-black wo-summary-heading mb-1.5">${txt("gym_done_exercises_bar", { count: doneExercisesInSession.length, total: w.exercises.length })}</div>
                    <div class="flex flex-wrap gap-1.5" dir="ltr">
                        ${doneExercisesInSession.map(d => `
                            <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border ${d.full ? 'wo-ex-pill-done' : 'wo-ex-pill-partial'}">
                                ${d.full ? '✓' : '⚡'} ${d.name} (${d.done}/${d.total})
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- بطاقة التمرين الحالي النشط -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                    <div class="relative w-full sm:w-44 h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                        <img src="${details.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${exerciseTitleEn}')" class="w-full h-full object-contain" alt="${exerciseTitleEn}">
                        ${ex.pair ? `
                            <div class="absolute top-2 left-2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[11px] font-black">
                                ${ex.pair}
                            </div>
                        ` : ''}
                    </div>

                    <div class="flex-1 w-full min-w-0">
                        <div class="flex justify-between items-start gap-2">
                            <div dir="ltr" class="text-left min-w-0">
                                <div class="text-[11px] text-emerald-400 font-bold uppercase tracking-wide mb-0.5">
                                    ${txt("gym_ex_of", { idx: this.activeExerciseIndex + 1, total: w.exercises.length })}
                                </div>
                                <h2 class="text-lg sm:text-xl font-black text-white leading-tight break-words">${exerciseTitleEn}</h2>
                                <div class="text-xs text-gray-400 font-mono mt-1">${details.equipment || ''}</div>
                            </div>
                            <!-- زر اقتراح بديل للجهاز المشغول -->
                            <button onclick="IronLiveGym.openAlternativesModal(${this.activeExerciseIndex})" 
                                class="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                                <span>${txt("gym_busy")}</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs my-2.5 sm:my-3 bg-slate-950/60 p-2 sm:p-2.5 rounded-xl border border-slate-800/80" dir="ltr">
                            <div>
                                <div class="text-[11px] sm:text-xs text-gray-400 font-bold">Sets</div>
                                <div class="font-black text-white text-sm sm:text-base">${ex.setsTarget}</div>
                            </div>
                            <div>
                                <div class="text-[11px] sm:text-xs text-gray-400 font-bold">Reps</div>
                                <div class="font-black text-emerald-400 text-sm sm:text-base">${ex.repsTarget}</div>
                            </div>
                            <div>
                                <div class="text-[11px] sm:text-xs text-gray-400 font-bold">Rest</div>
                                <div class="font-black text-amber-400 text-sm sm:text-base">${ex.restSec}s</div>
                            </div>
                        </div>

                        ${details.execution ? `<p class="text-xs text-gray-300 leading-relaxed"><strong class="text-emerald-400">${txt("gym_tech")}</strong> ${details.execution}</p>` : ''}
                    </div>
                </div>
            </div>

            <!-- جدول الجولات وتسجيل الأوزان -->
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4">
                <div class="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <h4 class="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                        <span>${txt("gym_log_title")} (${ex.setsTarget} × ${ex.repsTarget})</span>
                    </h4>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400 hidden sm:inline">${txt("gym_log_hint")}</span>
                        <button type="button" onclick="IronLiveGym.resetExerciseSets(${this.activeExerciseIndex})"
                            class="px-2.5 py-1 bg-slate-800 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 rounded-lg text-[11px] font-bold transition whitespace-nowrap">
                            ${txt("gym_reset_ex_btn")}
                        </button>
                    </div>
                </div>

                <div class="space-y-2 max-h-[38vh] overflow-y-auto pr-0.5 sm:pr-1">
                    <div class="grid grid-cols-12 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-[11px] font-bold text-gray-400 px-1.5 sm:px-2" dir="ltr">
                        <div class="col-span-2">Set</div>
                        <div class="col-span-3">Weight</div>
                        <div class="col-span-3">Reps</div>
                        <div class="col-span-4">Done</div>
                    </div>

                    ${ex.sets.map((s, sIdx) => `
                        <div class="grid grid-cols-12 gap-1.5 sm:gap-2 items-center p-1.5 sm:p-2 rounded-xl border transition ${s.completed ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950/60 border-slate-800'}">
                            <div class="col-span-2 text-center font-black ${s.completed ? 'text-emerald-400' : 'text-gray-300'} text-[11px] sm:text-xs" dir="ltr">
                                #${s.setNumber}
                            </div>
                            <div class="col-span-3">
                                <input type="number" placeholder="kg" value="${s.weight}" 
                                    oninput="IronLiveGym.currentWorkout.exercises[${this.activeExerciseIndex}].sets[${sIdx}].weight = this.value; IronLiveGym.saveDraftSession();"
                                    class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-center text-xs text-white font-bold focus:border-emerald-500 outline-none">
                            </div>
                            <div class="col-span-3">
                                <input type="number" placeholder="${ex.repsTarget}" value="${s.actualReps}" 
                                    oninput="IronLiveGym.currentWorkout.exercises[${this.activeExerciseIndex}].sets[${sIdx}].actualReps = this.value; IronLiveGym.saveDraftSession();"
                                    class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-center text-xs text-white font-bold focus:border-emerald-500 outline-none">
                            </div>
                            <div class="col-span-4 flex items-center justify-center">
                                <button onclick="IronLiveGym.toggleSetComplete(${this.activeExerciseIndex}, ${sIdx})"
                                    class="w-full py-1.5 px-1 rounded-lg font-bold text-[11px] sm:text-xs transition flex items-center justify-center gap-1 whitespace-nowrap ${s.completed ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-gray-300'}">
                                    <span>${s.completed ? 'Done ✓' : 'Complete'}</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};
