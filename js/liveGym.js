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
                if (timerText) timerText.innerText = "انتهت الراحة! ابدأ 🔥";
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
            container.innerHTML = alternatives.map(alt => `
                <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-emerald-500/50 transition">
                    <img src="${alt.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${alt.muscle}')" class="w-16 h-16 rounded-lg object-cover border border-slate-700 bg-slate-950" alt="${alt.nameEn}">
                    <div class="flex-1 text-left" dir="ltr">
                        <h4 class="font-black text-white text-sm">${alt.nameEn}</h4>
                        <div class="text-xs text-emerald-400 mt-0.5">${alt.equipment}</div>
                    </div>
                    <button onclick="IronLiveGym.swapCurrentExercise(${exerciseIdx}, '${alt.id}')" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition shadow-lg shadow-emerald-500/20">
                        اختيار كبديل
                    </button>
                </div>
            `).join("");
        }

        openModal("altExercisesModal");
    },

    // إنهاء التمرين وحفظ البيانات في سجل المتدرب
    finishWorkout() {
        if (!this.currentWorkout) return;
        this.stopRestTimer();

        const user = IronAuth.getCurrentUser();
        const traineeId = user && user.id ? user.id : "guest";

        const totalSets = this.currentWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
        const completedSets = this.currentWorkout.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
        const totalVolumeKg = this.currentWorkout.exercises.reduce((acc, ex) => {
            return acc + ex.sets.reduce((sAcc, s) => {
                const w = parseFloat(s.weight) || 0;
                const r = parseInt(s.actualReps) || parseInt(ex.repsTarget) || 8;
                return sAcc + (s.completed && w > 0 ? w * r : 0);
            }, 0);
        }, 0);

        const logs = JSON.parse(localStorage.getItem("iron_workout_logs") || "[]");
        logs.unshift({
            id: "log_" + Date.now(),
            traineeId,
            date: new Date().toISOString(),
            programId: this.currentWorkout.programId,
            programName: this.currentWorkout.programName,
            dayTitle: this.currentWorkout.dayTitle,
            completedSets: completedSets || totalSets,
            totalSets,
            totalVolumeKg: Math.round(totalVolumeKg)
        });
        localStorage.setItem("iron_workout_logs", JSON.stringify(logs.slice(0, 100)));

        sessionStorage.removeItem("iron_active_workout");
        closeModal("liveGymModal");
        showToast("عاش يا وحش! 🔥 تم إنهاء التمرين وحفظ الجلسة في سجلك بنجاح", "success");
        this.currentWorkout = null;

        if (typeof IronApp !== "undefined" && IronApp.renderWorkoutLogs) {
            IronApp.renderWorkoutLogs();
        }
    },

    // رسم واجهة الجيم التفاعلية (التمارين بالإنجليزية ومطابقة لعدد الجولات والتكرارات بالتصميم)
    renderLiveGymModal() {
        const modal = document.getElementById("liveGymModalContent");
        if (!modal || !this.currentWorkout) return;

        const w = this.currentWorkout;
        const ex = w.exercises[this.activeExerciseIndex];
        const details = ex.details || { nameEn: ex.displayNameEn, gif: "", muscle: "Workout", execution: "" };
        const exerciseTitleEn = ex.displayNameEn || details.nameEn;

        modal.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div dir="ltr" class="text-left">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${w.programName}</span>
                    <h3 class="text-lg font-black text-white mt-1">${w.dayTitle}</h3>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="IronLiveGym.finishWorkout()" class="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-lg shadow-lg shadow-emerald-500/20 hover:opacity-90">
                        إنهاء وحفظ التمرين ✅
                    </button>
                    <button onclick="closeModal('liveGymModal')" class="text-gray-400 hover:text-white text-xl p-1">✕</button>
                </div>
            </div>

            <!-- مؤشر التنقل بين تمارين اليوم (بالإنجليزية ومطابق لترتيب التصميم) -->
            <div class="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin" dir="ltr">
                ${w.exercises.map((item, idx) => {
                    const label = item.displayNameEn || item.details?.nameEn || `Exercise ${idx + 1}`;
                    const prefix = item.pair ? `${item.pair}.` : `${idx + 1}.`;
                    return `
                        <button onclick="IronLiveGym.activeExerciseIndex = ${idx}; IronLiveGym.saveDraftSession(); IronLiveGym.renderLiveGymModal();" 
                            class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${idx === this.activeExerciseIndex ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}">
                            <span>${prefix} ${label}</span>
                            ${item.sets.every(s => s.completed) ? '<span class="text-xs">✓</span>' : ''}
                        </button>
                    `;
                }).join('')}
            </div>

            <!-- بطاقة التمرين الحالي النشط -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4">
                <div class="flex flex-col sm:flex-row gap-4 items-center">
                    <div class="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                        <img src="${details.gif}" onerror="this.onerror=null;this.src=IronApp.getExerciseFallbackSvg('${exerciseTitleEn}')" class="w-full h-full object-contain" alt="${exerciseTitleEn}">
                        ${ex.pair ? `
                            <div class="absolute top-2 left-2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[11px] font-black">
                                ${ex.pair}
                            </div>
                        ` : ''}
                    </div>

                    <div class="flex-1 w-full">
                        <div class="flex justify-between items-start gap-2">
                            <div dir="ltr" class="text-left">
                                <div class="text-[11px] text-emerald-400 font-bold uppercase tracking-wide mb-0.5">
                                    Exercise ${this.activeExerciseIndex + 1} of ${w.exercises.length}
                                </div>
                                <h2 class="text-xl font-black text-white leading-tight">${exerciseTitleEn}</h2>
                                <div class="text-xs text-gray-400 font-mono mt-1">${details.equipment || ''}</div>
                            </div>
                            <!-- زر اقتراح بديل للجهاز المشغول -->
                            <button onclick="IronLiveGym.openAlternativesModal(${this.activeExerciseIndex})" 
                                class="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1 flex-shrink-0">
                                <span>⚡ الجهاز مشغول؟</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-3 gap-2 text-center text-xs my-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80" dir="ltr">
                            <div>
                                <div class="text-gray-400 font-bold">Sets</div>
                                <div class="font-black text-white text-base">${ex.setsTarget}</div>
                            </div>
                            <div>
                                <div class="text-gray-400 font-bold">Reps</div>
                                <div class="font-black text-emerald-400 text-base">${ex.repsTarget}</div>
                            </div>
                            <div>
                                <div class="text-gray-400 font-bold">Rest</div>
                                <div class="font-black text-amber-400 text-base">${ex.restSec}s</div>
                            </div>
                        </div>

                        ${details.execution ? `<p class="text-xs text-gray-300 leading-relaxed"><strong class="text-emerald-400">التكنيك:</strong> ${details.execution}</p>` : ''}
                    </div>
                </div>
            </div>

            <!-- جدول الجولات وتسجيل الأوزان -->
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-black text-sm text-white flex items-center gap-2">
                        <span>📝 تسجيل الجولات والأوزان (${ex.setsTarget} × ${ex.repsTarget})</span>
                    </h4>
                    <span class="text-xs text-gray-400">اضغط علامة (✓) لبدء مؤقت الراحة</span>
                </div>

                <div class="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
                    <div class="grid grid-cols-12 gap-2 text-center text-[11px] font-bold text-gray-400 px-2" dir="ltr">
                        <div class="col-span-2">Set</div>
                        <div class="col-span-3">Weight (kg)</div>
                        <div class="col-span-3">Reps (${ex.repsTarget})</div>
                        <div class="col-span-4">Done</div>
                    </div>

                    ${ex.sets.map((s, sIdx) => `
                        <div class="grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition ${s.completed ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950/60 border-slate-800'}">
                            <div class="col-span-2 text-center font-black ${s.completed ? 'text-emerald-400' : 'text-gray-300'} text-xs" dir="ltr">
                                Set ${s.setNumber}
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
                                    class="w-full py-1.5 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1 ${s.completed ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-gray-300'}">
                                    <span>${s.completed ? 'Completed ✓' : 'Complete'}</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};
