// Doktor paneli uchun JavaScript - doktor.js

// DOM yuklanganidan keyin ishga tushadi
document.addEventListener('DOMContentLoaded', function() {
    initDoctorDashboard();
    initPatientManagement();
    initDiagnosisSystem();
    initScheduleManagement();
    initPrescriptionSystem();
});

// Doktor dashboard boshqaruvi
function initDoctorDashboard() {
    initRealTimeSchedule();
    initQuickStats();
    initTodayAppointments();
    initWorkSchedule();
}

// Real-time navbat yangilanishlari
function initRealTimeSchedule() {
    // WebSocket orqali real-time yangilanishlar
    initScheduleWebSocket();
    
    // Har 30 soniyada navbatni yangilash
    setInterval(updateTodaySchedule, 30000);
    
    // Navbat ovozli ogohlantirish
    initVoiceNotifications();
}

function initScheduleWebSocket() {
    // WebSocket ulanishi (keyinroq to'ldiriladi)
    console.log('Doktor schedule WebSocket initialized');
}

function updateTodaySchedule() {
    const doktorId = getCurrentDoctorId();
    
    fetch(`/doktor/api/today-schedule?doktorId=${doktorId}`)
        .then(response => response.json())
        .then(schedule => {
            updateScheduleDisplay(schedule);
        })
        .catch(error => {
            console.error('Navbat yangilashda xatolik:', error);
        });
}

function updateScheduleDisplay(schedule) {
    const scheduleList = document.querySelector('.schedule-list');
    if (scheduleList && schedule.appointments) {
        scheduleList.innerHTML = schedule.appointments.map(appointment => `
            <div class="schedule-item ${appointment.urgent ? 'urgent' : ''} ${appointment.completed ? 'completed' : ''}">
                <div class="patient-info">
                    <div class="patient-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="patient-details">
                        <h4>${appointment.patientName}</h4>
                        <p>${appointment.service} • ${appointment.age} yosh</p>
                        ${appointment.note ? `<span class="patient-note">${appointment.note}</span>` : ''}
                    </div>
                </div>
                <div class="appointment-time">
                    <span class="time">${appointment.time}</span>
                    <span class="date">${appointment.date}</span>
                </div>
                <div class="appointment-actions">
                    ${!appointment.completed ? `
                        <button class="btn btn-sm btn-success" onclick="startAppointment(${appointment.id})">
                            <i class="fas fa-play"></i>
                            Boshlash
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-outline" onclick="viewMedicalRecord(${appointment.recordId})">
                            <i class="fas fa-file-medical"></i>
                            Yozuv
                        </button>
                    `}
                </div>
            </div>
        `).join('');
    }
}

// Ovozli ogohlantirish
function initVoiceNotifications() {
    if ('speechSynthesis' in window) {
        // Ovozli ogohlantirish faqat ruxsat so'ralganda
        console.log('Ovozli ogohlantirish mavjud');
    }
}

function notifyNextPatient(patientName) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Keyingi bemor, ${patientName}`;
        utterance.lang = 'uz-UZ';
        utterance.rate = 0.8;
        
        speechSynthesis.speak(utterance);
    }
}

// Tezkor statistikalar
function initQuickStats() {
    updateDoctorStats();
    setInterval(updateDoctorStats, 60000); // Har 1 daqiqada
}

function updateDoctorStats() {
    const doktorId = getCurrentDoctorId();
    
    fetch(`/doktor/api/stats?doktorId=${doktorId}`)
        .then(response => response.json())
        .then(stats => {
            updateStatsDisplay(stats);
        })
        .catch(error => {
            console.error('Statistika yangilashda xatolik:', error);
        });
}

function updateStatsDisplay(stats) {
    // Statistik kartalarni yangilash
    const elements = {
        'today-patients': stats.todayPatients,
        'total-patients': stats.totalPatients,
        'next-appointments': stats.nextAppointments,
        'rating': stats.rating
    };
    
    Object.keys(elements).forEach(key => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            animateValue(element, parseFloat(element.textContent), elements[key], 1000);
        }
    });
}

// Bugungi qabullar
function initTodayAppointments() {
    loadTodayAppointments();
}

function loadTodayAppointments() {
    const doktorId = getCurrentDoctorId();
    
    fetch(`/doktor/api/today-appointments?doktorId=${doktorId}`)
        .then(response => response.json())
        .then(appointments => {
            renderTodayAppointments(appointments);
        })
        .catch(error => {
            console.error('Bugungi qabullarni yuklashda xatolik:', error);
        });
}

function renderTodayAppointments(appointments) {
    const container = document.querySelector('.today-appointments');
    if (container && appointments.length > 0) {
        container.innerHTML = appointments.map(apt => `
            <div class="appointment-item ${apt.status}">
                <div class="apt-time">${apt.time}</div>
                <div class="apt-patient">${apt.patientName}</div>
                <div class="apt-service">${apt.service}</div>
                <div class="apt-status">${getStatusBadge(apt.status)}</div>
            </div>
        `).join('');
    }
}

// Ish jadvali boshqaruvi
function initWorkSchedule() {
    initScheduleCalendar();
    initScheduleSettings();
}

function initScheduleCalendar() {
    // Haftalik jadvalni yuklash
    loadWeeklySchedule();
}

function loadWeeklySchedule() {
    const doktorId = getCurrentDoctorId();
    
    fetch(`/doktor/api/weekly-schedule?doktorId=${doktorId}`)
        .then(response => response.json())
        .then(schedule => {
            renderWeeklySchedule(schedule);
        })
        .catch(error => {
            console.error('Ish jadvalini yuklashda xatolik:', error);
        });
}

function renderWeeklySchedule(schedule) {
    // Haftalik jadvalni chiqarish
    console.log('Weekly schedule loaded:', schedule);
}

// Bemor boshqaruvi
function initPatientManagement() {
    initPatientSearch();
    initPatientForms();
    initMedicalHistory();
}

// Bemor qidiruvi
function initPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchPatients, 300));
    }
}

function searchPatients(query) {
    if (query.length < 2) return;
    
    fetch(`/doktor/api/patients/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(patients => {
            displayPatientResults(patients);
        })
        .catch(error => {
            console.error('Bemor qidiruvida xatolik:', error);
        });
}

function displayPatientResults(patients) {
    const resultsContainer = document.getElementById('patientResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = patients.map(patient => `
            <div class="patient-result" onclick="selectPatient(${patient.id})">
                <div class="patient-avatar-sm">
                    <i class="fas fa-user"></i>
                </div>
                <div class="patient-info">
                    <h5>${patient.fullName}</h5>
                    <p>${patient.phone} • ${patient.age} yosh</p>
                </div>
            </div>
        `).join('');
    }
}

// Bemor formlari
function initPatientForms() {
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', handlePatientFormSubmit);
    }
}

function handlePatientFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const patientData = Object.fromEntries(formData);
    
    // Formani yuborish
    submitPatientForm(patientData);
}

function submitPatientForm(patientData) {
    showLoading();
    
    fetch('/doktor/api/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccess('Bemor ma\'lumotlari saqlandi');
            // Formani tozalash yoki boshqa amal
        } else {
            showError(data.message || 'Bemor ma\'lumotlarini saqlashda xatolik');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Server xatosi: ' + error.message);
    });
}

// Tibbiy tarix
function initMedicalHistory() {
    // Bemorning tibbiy tarixini yuklash
}

// Tashxis tizimi
function initDiagnosisSystem() {
    initDiagnosisForm();
    initDiagnosisTemplates();
    initICD10Search();
}

// Tashxis formasi
function initDiagnosisForm() {
    const diagnosisForm = document.getElementById('diagnosisForm');
    if (diagnosisForm) {
        diagnosisForm.addEventListener('submit', handleDiagnosisSubmit);
        initSymptomChecker();
    }
}

function handleDiagnosisSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const diagnosisData = Object.fromEntries(formData);
    
    // Tashxisni yuborish
    submitDiagnosis(diagnosisData);
}

function submitDiagnosis(diagnosisData) {
    showLoading();
    
    fetch('/doktor/api/diagnoses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosisData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccess('Tashxis muvaffaqiyatli saqlandi');
            // Retsept yozish sahifasiga o'tish
            setTimeout(() => {
                window.location.href = `/doktor/retsept?diagnosisId=${data.diagnosisId}`;
            }, 1500);
        } else {
            showError(data.message || 'Tashxisni saqlashda xatolik');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Server xatosi: ' + error.message);
    });
}

// Tashxis shablonlari
function initDiagnosisTemplates() {
    loadDiagnosisTemplates();
}

function loadDiagnosisTemplates() {
    fetch('/doktor/api/diagnosis-templates')
        .then(response => response.json())
        .then(templates => {
            renderDiagnosisTemplates(templates);
        })
        .catch(error => {
            console.error('Tashxis shablonlarini yuklashda xatolik:', error);
        });
}

function renderDiagnosisTemplates(templates) {
    const container = document.getElementById('diagnosisTemplates');
    if (container) {
        container.innerHTML = templates.map(template => `
            <div class="template-item" onclick="useTemplate(${template.id})">
                <h5>${template.name}</h5>
                <p>${template.description}</p>
                <div class="template-tags">
                    ${template.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
}

// ICD-10 qidiruvi
function initICD10Search() {
    const icdSearch = document.getElementById('icd10Search');
    if (icdSearch) {
        icdSearch.addEventListener('input', debounce(searchICD10, 300));
    }
}

function searchICD10(query) {
    if (query.length < 2) return;
    
    fetch(`/doktor/api/icd10/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(codes => {
            displayICD10Results(codes);
        })
        .catch(error => {
            console.error('ICD-10 qidiruvida xatolik:', error);
        });
}

// Simptom tekshiruvi
function initSymptomChecker() {
    const symptomInput = document.getElementById('symptoms');
    if (symptomInput) {
        symptomInput.addEventListener('input', debounce(suggestSymptoms, 300));
    }
}

function suggestSymptoms(query) {
    if (query.length < 2) return;
    
    fetch(`/doktor/api/symptoms/suggest?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(symptoms => {
            displaySymptomSuggestions(symptoms);
        })
        .catch(error => {
            console.error('Simptom takliflarida xatolik:', error);
        });
}

// Navbat boshqaruvi
function initScheduleManagement() {
    initAppointmentBooking();
    initScheduleSettings();
    initTimeSlotManagement();
}

// Qabul bron qilish
function initAppointmentBooking() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleAppointmentBooking);
        initTimeSlotLoader();
    }
}

function initTimeSlotLoader() {
    // Bemor qabul vaqtini yuklash
    loadAvailableTimeSlots();
}

function loadAvailableTimeSlots() {
    const doktorId = getCurrentDoctorId();
    const date = document.getElementById('appointmentDate').value;
    
    if (!date) return;
    
    fetch(`/doktor/api/time-slots?doktorId=${doktorId}&date=${date}`)
        .then(response => response.json())
        .then(slots => {
            renderTimeSlots(slots);
        })
        .catch(error => {
            console.error('Vaqt bo\'shliqlarini yuklashda xatolik:', error);
        });
}

function handleAppointmentBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData);
    
    submitAppointmentBooking(bookingData);
}

// Retsept tizimi
function initPrescriptionSystem() {
    initPrescriptionForm();
    initDrugDatabase();
    initPrescriptionTemplates();
}

// Retsept formasi
function initPrescriptionForm() {
    const prescriptionForm = document.getElementById('prescriptionForm');
    if (prescriptionForm) {
        prescriptionForm.addEventListener('submit', handlePrescriptionSubmit);
        initDrugSearch();
    }
}

function handlePrescriptionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const prescriptionData = Object.fromEntries(formData);
    
    submitPrescription(prescriptionData);
}

function submitPrescription(prescriptionData) {
    showLoading();
    
    fetch('/doktor/api/prescriptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccess('Retsept muvaffaqiyatli yaratildi');
            // Retseptni chop etish
            printPrescription(data.prescriptionId);
        } else {
            showError(data.message || 'Retsept yaratishda xatolik');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Server xatosi: ' + error.message);
    });
}

// Dori-darmonlar bazasi
function initDrugDatabase() {
    initDrugSearch();
    initDrugInteractions();
}

function initDrugSearch() {
    const drugSearch = document.getElementById('drugSearch');
    if (drugSearch) {
        drugSearch.addEventListener('input', debounce(searchDrugs, 300));
    }
}

function searchDrugs(query) {
    if (query.length < 2) return;
    
    fetch(`/doktor/api/drugs/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(drugs => {
            displayDrugResults(drugs);
        })
        .catch(error => {
            console.error('Dori qidiruvida xatolik:', error);
        });
}

// Utility funksiyalar
function getCurrentDoctorId() {
    // Joriy doktor ID sini olish
    return document.body.getAttribute('data-doctor-id') || 1;
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        element.textContent = end === Math.floor(end) ? Math.floor(value) : value.toFixed(1);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">Kutilmoqda</span>',
        'confirmed': '<span class="badge badge-success">Tasdiqlangan</span>',
        'completed': '<span class="badge badge-info">Yakunlangan</span>',
        'cancelled': '<span class="badge badge-danger">Bekor qilingan</span>'
    };
    return badges[status] || '<span class="badge badge-secondary">Noma\'lum</span>';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global doktor funksiyalari
window.doctor = {
    startConsultation: function(patientId) {
        showLoading();
        // Konsultatsiyani boshlash
        setTimeout(() => {
            hideLoading();
            window.location.href = `/doktor/consultation?patientId=${patientId}`;
        }, 1000);
    },
    
    completeAppointment: function(appointmentId) {
        fetch(`/doktor/api/appointments/${appointmentId}/complete`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Qabul yakunlandi');
                // Navbatni yangilash
                updateTodaySchedule();
            } else {
                showError('Qabulni yakunlashda xatolik');
            }
        })
        .catch(error => {
            showError('Server xatosi: ' + error.message);
        });
    },
    
    cancelAppointment: function(appointmentId, reason) {
        if (!reason) {
            reason = prompt('Bekor qilish sababini kiriting:');
            if (!reason) return;
        }
        
        fetch(`/doktor/api/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: reason })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Qabul bekor qilindi');
                updateTodaySchedule();
            } else {
                showError('Qabulni bekor qilishda xatolik');
            }
        })
        .catch(error => {
            showError('Server xatosi: ' + error.message);
        });
    },
    
    printPrescription: function(prescriptionId) {
        window.open(`/doktor/prescriptions/${prescriptionId}/print`, '_blank');
    },
    
    generateMedicalCertificate: function(patientId, diagnosis) {
        showLoading();
        
        fetch('/doktor/api/medical-certificates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patientId: patientId,
                diagnosis: diagnosis
            })
        })
        .then(response => response.blob())
        .then(blob => {
            hideLoading();
            // PDF sertifikatni yuklab olish
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `medical-certificate-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showSuccess('Tibbiy guvohnoma yaratildi');
        })
        .catch(error => {
            hideLoading();
            showError('Guvohnoma yaratishda xatolik: ' + error.message);
        });
    }
};

// Hafta navigatsiyasi
let currentWeek = new Date();

function prevWeek() {
    currentWeek.setDate(currentWeek.getDate() - 7);
    updateWeekDisplay();
    loadWeeklySchedule();
}

function nextWeek() {
    currentWeek.setDate(currentWeek.getDate() + 7);
    updateWeekDisplay();
    loadWeeklySchedule();
}

function updateWeekDisplay() {
    const weekDisplay = document.getElementById('currentWeek');
    if (weekDisplay) {
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        weekDisplay.textContent = `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}`;
    }
}

// Dastlabki haftani ko'rsatish
updateWeekDisplay();