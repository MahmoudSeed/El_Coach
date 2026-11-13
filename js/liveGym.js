/**
 * IronCoach Pro - Live Gym Workout Tracker & Audio Rest Timer
 * وضع التدريب النشط في الجيم، تسجيل الأوزان، مؤقت الراحة الصوتي، واستبدال التمارين البديلة
 */

const IronLiveGym = {
    currentWorkout: null,
    activeExerciseIndex: 0,
    timerInterval: null,
    timerSecondsRemaining: 0,
    timerTotalSeconds: 60,

    // بدء جلسة تمرين لبرنامج ويوم معين
    startWorkoutSession(programId, dayId) {
        const program = getProgramById(programId);
        if (!program) return false;

        const day = program.days.find(d => d.dayId === dayId);
        if (!day) return false;

        // تجهيز بيانات الجلسة مع حفظ الجولات
        this.currentWorkout = {
            programId,
            programName: program.nameAr,
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
                    details: exDetails,
                    setsTarget: item.sets,
                    repsTarget: item.reps,
                    restSec: item.restSec || 90,
                    rpe: item.rpe || 8,
                    note: item.note || "",
                    sets: setsData
                };
            })
        };

        this.activeExerciseIndex = 0;
        this.renderLiveGymModal();
        return true;
    },

    // تشغيل تنبيه صوتي عبر Web Audio API بدون الحاجة لتحميل ملفات صوتية
    playTimerBeep() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // نغمة مزدوجة لطيفة
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

    // بدء مؤقت الراحة
    startRestTimer(seconds) {
        clearInterval(this.timerInterval);
        this.timerSecondsRemaining = seconds;
        this.timerTotalSeconds = seconds;

        const timerBox = document.getElementById("gymTimerBox");
        const timerText = document.getElementById("gymTimerCountdown");
        if (timerBox) timerBox.classList.remove("hidden");

        const updateDisplay = () => {
            const m = Math.floor(this.timerSecondsRemaining / 60);
            const s = this.timerSecondsRemaining % 60;
            if (timerText) {
                timerText.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
            }

            if (this.timerSecondsRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.playTimerBeep();
                if (timerText) timerText.innerText = "انتهت الراحة! ابدأ الجولة 🔥";
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            }
            this.timerSecondsRemaining--;
        };

        updateDisplay();
        this.timerInterval = setInterval(updateDisplay, 1000);
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
            // تشغيل مؤقت الراحة المحدد للتمرين
            this.startRestTimer(ex.restSec);
        }

        this.renderLiveGymModal();
    },

    // استبدال التمرين الحالي بتمرين بديل فوري
    swapCurrentExercise(exerciseIdx, newExerciseId) {
        if (!this.currentWorkout) return;
        const newDetails = getExerciseById(newExerciseId);
        if (!newDetails) return;

        const oldEx = this.currentWorkout.exercises[exerciseIdx];
        oldEx.exerciseId = newExerciseId;
        oldEx.details = newDetails;

        // إغلاق نافذة البدائل وتحديث شاشة التمرين
        closeModal("altExercisesModal");
        this.renderLiveGymModal();
        showToast(`تم استبدال التمرين بـ: ${newDetails.nameAr}`, "success");
    },

    // فتح نافذة اختيار تمرين بديل
    openAlternativesModal(exerciseIdx) {
        const ex = this.currentWorkout.exercises[exerciseIdx];
        const alternatives = getAlternativeExercises(ex.exerciseId);
        const container = document.getElementById("altExercisesList");
        if (!container) return;

        if (alternatives.length === 0) {
            container.innerHTML = `<div class="text-center py-6 text-gray-400">لا توجد تمارين بديلة محددة لهذا التمرين حالياً. يمكنك استخدام الدمبلز كبديل عام.</div>`;
        } else {
            container.innerHTML = alternatives.map(alt => `
                <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-emerald-500/50 transition">
                    <img src="${alt.gif}" class="w-16 h-16 rounded-lg object-cover border border-slate-700" alt="${alt.nameAr}">
                    <div class="flex-1">
                        <h4 class="font-bold text-white text-sm">${alt.nameAr}</h4>
                        <span class="text-xs text-emerald-400 font-mono">${alt.nameEn}</span>
                        <div class="text-xs text-gray-400 mt-1">الأداة: ${alt.equipment}</div>
                    </div>
                    <button onclick="IronLiveGym.swapCurrentExercise(${exerciseIdx}, '${alt.id}')" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition shadow-lg shadow-emerald-500/20">
                        اختيار كبديل
                    </button>
                </div>
            `).join("");
        }

        openModal("altExercisesModal");
    },

    // إنهاء التمرين وحفظ البيانات
    finishWorkout() {
        if (!this.currentWorkout) return;
        clearInterval(this.timerInterval);

        const logs = JSON.parse(localStorage.getItem("iron_workout_logs") || "[]");
        logs.unshift({
            id: "log_" + Date.now(),
            date: new Date().toISOString(),
            programName: this.currentWorkout.programName,
            dayTitle: this.currentWorkout.dayTitle,
            completedSets: this.currentWorkout.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)
        });
        localStorage.setItem("iron_workout_logs", JSON.stringify(logs.slice(0, 50)));

        closeModal("liveGymModal");
        showToast("عاش يا وحش! 🔥 تم إنهاء التمرين وتسجيل تقدمك بنجاح", "success");
        this.currentWorkout = null;
    },

    // رسم واجهة الجيم التفاعلية
    renderLiveGymModal() {
        const modal = document.getElementById("liveGymModalContent");
        if (!modal || !this.currentWorkout) return;

        const w = this.currentWorkout;
        const ex = w.exercises[this.activeExerciseIndex];
        const details = ex.details;

        modal.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${w.programName}</span>
                    <h3 class="text-lg font-black text-white mt-1">${w.dayTitle}</h3>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="IronLiveGym.finishWorkout()" class="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-lg shadow-lg shadow-emerald-500/20 hover:opacity-90">
                        إنهاء التمرين ✅
                    </button>
                    <button onclick="closeModal('liveGymModal')" class="text-gray-400 hover:text-white text-xl p-1">✕</button>
                </div>
            </div>

            <!-- مؤشر التنقل بين تمارين اليوم -->
            <div class="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
                ${w.exercises.map((item, idx) => `
                    <button onclick="IronLiveGym.activeExerciseIndex = ${idx}; IronLiveGym.renderLiveGymModal();" 
                        class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${idx === this.activeExerciseIndex ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}">
                        <span>تمرين ${idx + 1}</span>
                        ${item.sets.every(s => s.completed) ? '<span class="text-xs">✓</span>' : ''}
                    </button>
                `).join('')}
            </div>

            <!-- بطاقة التمرين الحالي النشط -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4">
                <div class="flex flex-col sm:flex-row gap-4 items-center">
                    <div class="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                        <img src="${details.gif}" class="w-full h-full object-contain" alt="${details.nameAr}">
                        <div class="absolute top-2 right-2 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
                            ${details.muscle}
                        </div>
                    </div>

                    <div class="flex-1 w-full text-right">
                        <div class="flex justify-between items-start gap-2">
                            <div>
                                <h2 class="text-lg font-black text-white">${details.nameAr}</h2>
                                <div class="text-xs text-gray-400 font-mono mb-2">${details.nameEn}</div>
                            </div>
                            <!-- زر اقتراح بديل للجهاز المشغول -->
                            <button onclick="IronLiveGym.openAlternativesModal(${this.activeExerciseIndex})" 
                                class="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1">
                                <span>⚡ الجهاز مشغول؟</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-3 gap-2 text-center text-xs my-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            <div>
                                <div class="text-gray-400">الجولات</div>
                                <div class="font-black text-white text-sm">${ex.setsTarget}</div>
                            </div>
                            <div>
                                <div class="text-gray-400">التكرارات</div>
                                <div class="font-black text-emerald-400 text-sm">${ex.repsTarget}</div>
                            </div>
                            <div>
                                <div class="text-gray-400">الراحة</div>
                                <div class="font-black text-amber-400 text-sm">${ex.restSec}ث</div>
                            </div>
                        </div>

                        <p class="text-xs text-gray-300 leading-relaxed"><strong class="text-emerald-400">الأداء:</strong> ${details.execution.substring(0, 120)}...</p>
                    </div>
                </div>
            </div>

            <!-- جدول الجولات وتسجيل الأوزان -->
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-black text-sm text-white flex items-center gap-2">
                        <span>📝 تسجيل الجولات والأوزان</span>
                    </h4>
                    <span class="text-xs text-gray-400">اضغط علامة (✓) لبدء مؤقت الراحة</span>
                </div>

                <div class="space-y-2">
                    <div class="grid grid-cols-12 gap-2 text-center text-[11px] font-bold text-gray-400 px-2">
                        <div class="col-span-2">الجولة</div>
                        <div class="col-span-3">الوزن (كجم)</div>
                        <div class="col-span-3">العدّات</div>
                        <div class="col-span-4">إتمام الجولة</div>
                    </div>

                    ${ex.sets.map((s, sIdx) => `
                        <div class="grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition ${s.completed ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950/60 border-slate-800'}">
                            <div class="col-span-2 text-center font-black ${s.completed ? 'text-emerald-400' : 'text-gray-300'} text-xs">
                                #${s.setNumber}
                            </div>
                            <div class="col-span-3">
                                <input type="number" placeholder="مثال: 60" value="${s.weight}" 
                                    oninput="IronLiveGym.currentWorkout.exercises[${this.activeExerciseIndex}].sets[${sIdx}].weight = this.value"
                                    class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-center text-xs text-white font-bold focus:border-emerald-500 outline-none">
                            </div>
                            <div class="col-span-3">
                                <input type="number" placeholder="${ex.repsTarget}" value="${s.actualReps}" 
                                    oninput="IronLiveGym.currentWorkout.exercises[${this.activeExerciseIndex}].sets[${sIdx}].actualReps = this.value"
                                    class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-center text-xs text-white font-bold focus:border-emerald-500 outline-none">
                            </div>
                            <div class="col-span-4 flex items-center justify-center">
                                <button onclick="IronLiveGym.toggleSetComplete(${this.activeExerciseIndex}, ${sIdx})"
                                    class="w-full py-1.5 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1 ${s.completed ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-gray-300'}">
                                    <span>${s.completed ? 'مكتملة ✓' : 'تمت الجولة'}</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};
