// Bemor paneli uchun JavaScript - bemor.js

// DOM yuklanganidan keyin ishga tushadi
document.addEventListener('DOMContentLoaded', function() {
    initPatientDashboard();
    initAppointmentSystem();
    initMedicalRecords();
    initPrescriptionSystem();
    initLabResults();
    initNotifications();
});

// Bemor dashboard boshqaruvi
function initPatientDashboard() {
    loadPatientOverview();
    initRealTimeUpdates();
    initEmergencySystem();
}

// Bemor umumiy ma'lumotlarini yuklash
function loadPatientOverview() {
    fetch('/bemor/api/overview')
        .then(response => response.json())
        .then(data => {
            updatePatientOverview(data);
        })
        .catch(error => {
            console.error('Bemor ma\'lumotlarini yuklashda xatolik:', error);
        });
}

function updatePatientOverview(data) {
    // Statistik kartalarni yangilash
    const stats = {
        'jamiQabullar': data.totalAppointments,
        'jamiRetseptlar': data.totalPrescriptions,
        'jamiTahlillar': data.totalLabTests,
        'jamiTulovlar': data.totalPayments
    };

    Object.keys(stats).forEach(key => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            animateValue(element, parseInt(element.textContent) || 0, stats[key], 1000);
        }
    });
}

// Real-time yangilanishlar
function initRealTimeUpdates() {
    // WebSocket orqali real-time yangilanishlar
    initPatientWebSocket();
    
    // Har 1 daqiqada yangilash
    setInterval(checkForUpdates, 60000);
}

function initPatientWebSocket() {
    try {
        const socket = new WebSocket(`ws://${window.location.host}/bemor/updates`);
        
        socket.onopen = function() {
            console.log('Bemor WebSocket ulandi');
        };
        
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            handlePatientUpdate(data);
        };
        
        socket.onclose = function() {
            console.log('Bemor WebSocket ulanishi uzildi');
            setTimeout(initPatientWebSocket, 5000);
        };
        
    } catch (error) {
        console.error('Bemor WebSocket ulanishida xatolik:', error);
    }
}

function handlePatientUpdate(data) {
    switch (data.type) {
        case 'APPOINTMENT_REMINDER':
            showAppointmentReminder(data.appointment);
            break;
        case 'NEW_LAB_RESULT':
            showNewLabResultNotification(data.result);
            break;
        case 'PRESCRIPTION_READY':
            showPrescriptionReady(data.prescription);
            break;
        case 'DOCTOR_MESSAGE':
            showDoctorMessage(data.message);
            break;
    }
}

// Shoshilinch tizim
function initEmergencySystem() {
    // Geolocation for emergency services
    if ('geolocation' in navigator) {
        console.log('Geolocation qo\'llab-quvvatlanadi');
    }
}

// Qabul tizimi
function initAppointmentSystem() {
    loadUpcomingAppointments();
    initAppointmentActions();
    initAppointmentBooking();
}

// Keyingi qabullarni yuklash
function loadUpcomingAppointments() {
    fetch('/bemor/api/appointments/upcoming')
        .then(response => response.json())
        .then(appointments => {
            updateUpcomingAppointments(appointments);
        })
        .catch(error => {
            console.error('Qabullarni yuklashda xatolik:', error);
        });
}

function updateUpcomingAppointments(appointments) {
    const container = document.getElementById('upcomingAppointments');
    const emptyState = document.getElementById('noAppointments');
    
    if (!container) return;
    
    if (appointments.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = appointments.map(appointment => `
        <div class="appointment-item ${appointment.urgent ? 'urgent' : ''} ${appointment.status === 'COMPLETED' ? 'completed' : ''}">
            <div class="appointment-info">
                <div class="appointment-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="appointment-details">
                    <h4>${appointment.serviceType}</h4>
                    <p class="appointment-doctor">${appointment.doctorName}</p>
                    <p>${appointment.notes || ''}</p>
                </div>
            </div>
            <div class="appointment-time">
                <span class="appointment-date">${formatDate(appointment.appointmentDate)}</span>
                <span class="appointment-hour">${formatTime(appointment.appointmentTime)}</span>
            </div>
            <div class="appointment-status status-${appointment.status.toLowerCase()}">
                ${getAppointmentStatusText(appointment.status)}
            </div>
            <div class="appointment-actions">
                <button class="btn btn-sm btn-outline" onclick="viewAppointmentDetails(${appointment.id})">
                    <i class="fas fa-eye"></i>
                </button>
                ${appointment.status === 'UPCOMING' ? `
                    <button class="btn btn-sm btn-primary" onclick="rescheduleAppointment(${appointment.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${appointment.id})">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Qabul amallari
function initAppointmentActions() {
    // Qabul bilan bog'liq amallar
}

function viewAppointmentDetails(appointmentId) {
    fetch(`/bemor/api/appointments/${appointmentId}`)
        .then(response => response.json())
        .then(appointment => {
            showAppointmentDetailsModal(appointment);
        })
        .catch(error => {
            showError('Qabul ma\'lumotlarini yuklashda xatolik');
        });
}

function showAppointmentDetailsModal(appointment) {
    const modalContent = `
        <div class="appointment-detail">
            <div class="detail-section">
                <h4>Qabul Tafsilotlari</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Doktor:</label>
                        <span>${appointment.doctorName}</span>
                    </div>
                    <div class="detail-item">
                        <label>Mutaxassislik:</label>
                        <span>${appointment.doctorSpecialty}</span>
                    </div>
                    <div class="detail-item">
                        <label>Sana:</label>
                        <span>${formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Vaqt:</label>
                        <span>${formatTime(appointment.appointmentTime)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Xizmat turi:</label>
                        <span>${appointment.serviceType}</span>
                    </div>
                    <div class="detail-item">
                        <label>Holat:</label>
                        <span class="status-badge status-${appointment.status.toLowerCase()}">
                            ${getAppointmentStatusText(appointment.status)}
                        </span>
                    </div>
                </div>
            </div>
            ${appointment.notes ? `
            <div class="detail-section">
                <h4>Qo'shimcha Izohlar</h4>
                <p>${appointment.notes}</p>
            </div>
            ` : ''}
            ${appointment.preparationInstructions ? `
            <div class="detail-section">
                <h4>Tayyorgarlik Ko'rsatmalari</h4>
                <p>${appointment.preparationInstructions}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('appointmentDetails').innerHTML = modalContent;
    openModal('appointmentDetailsModal');
}

function rescheduleAppointment(appointmentId) {
    if (confirm('Bu qabulni qayta rejalashtirmoqchimisiz?')) {
        // Qayta rejalashtirish sahifasiga o'tish
        window.location.href = `/bemor/qabul-bron?reschedule=${appointmentId}`;
    }
}

function cancelAppointment(appointmentId) {
    if (confirm('Bu qabulni bekor qilmoqchimisiz?')) {
        const reason = prompt('Bekor qilish sababini kiriting (ixtiyoriy):');
        
        fetch(`/bemor/api/appointments/${appointmentId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: reason })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Qabul bekor qilindi');
                loadUpcomingAppointments();
                closeModal('appointmentDetailsModal');
            } else {
                showError('Qabulni bekor qilishda xatolik: ' + data.message);
            }
        })
        .catch(error => {
            showError('Server xatosi: ' + error.message);
        });
    }
}

// Qabul bron qilish
function initAppointmentBooking() {
    // Qabul bron qilish funksionalligi
}

// Tibbiy yozuvlar
function initMedicalRecords() {
    loadMedicalRecords();
    initRecordViewer();
}

function loadMedicalRecords() {
    fetch('/bemor/api/medical-records')
        .then(response => response.json())
        .then(records => {
            updateMedicalRecords(records);
        })
        .catch(error => {
            console.error('Tibbiy yozuvlarni yuklashda xatolik:', error);
        });
}

function updateMedicalRecords(records) {
    const container = document.getElementById('medicalRecords');
    const emptyState = document.getElementById('noRecords');
    
    if (!container) return;
    
    if (records.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = records.map(record => `
        <div class="record-item">
            <div class="record-info">
                <div class="record-icon">
                    <i class="fas fa-stethoscope"></i>
                </div>
                <div class="record-details">
                    <h4>${record.diagnosis}</h4>
                    <p class="record-doctor">${record.doctorName}</p>
                    <p>${record.description || ''}</p>
                </div>
            </div>
            <div class="record-date">
                <span class="record-date-day">${formatDate(record.recordDate)}</span>
                <span class="record-date-full">${formatDateTime(record.recordDate)}</span>
            </div>
            <div class="record-actions">
                <button class="btn btn-sm btn-outline" onclick="viewMedicalRecord(${record.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="downloadMedicalRecord(${record.id})">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function viewMedicalRecord(recordId) {
    window.open(`/bemor/tibbiy-yozuv/${recordId}`, '_blank');
}

function downloadMedicalRecord(recordId) {
    showLoading();
    
    fetch(`/bemor/api/medical-records/${recordId}/download`)
        .then(response => response.blob())
        .then(blob => {
            hideLoading();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `tibbiy-yozuv-${recordId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showSuccess('Tibbiy yozuv yuklab olindi');
        })
        .catch(error => {
            hideLoading();
            showError('Yozuv yuklab olishda xatolik: ' + error.message);
        });
}

// Retsept tizimi
function initPrescriptionSystem() {
    loadPrescriptions();
    initPrescriptionActions();
}

function loadPrescriptions() {
    fetch('/bemor/api/prescriptions')
        .then(response => response.json())
        .then(prescriptions => {
            updatePrescriptions(prescriptions);
        })
        .catch(error => {
            console.error('Retseptlarni yuklashda xatolik:', error);
        });
}

function updatePrescriptions(prescriptions) {
    const container = document.getElementById('prescriptionsList');
    const emptyState = document.getElementById('noPrescriptions');
    
    if (!container) return;
    
    if (prescriptions.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = prescriptions.map(prescription => `
        <div class="prescription-item">
            <div class="prescription-info">
                <div class="prescription-icon">
                    <i class="fas fa-prescription"></i>
                </div>
                <div class="prescription-details">
                    <h4>${prescription.medicationName}</h4>
                    <p class="prescription-medicine">${prescription.dosage}</p>
                    <p>${prescription.instructions || ''}</p>
                </div>
            </div>
            <div class="prescription-date">
                <span class="prescription-date-day">${formatDate(prescription.prescribedDate)}</span>
                <span class="prescription-status status-${prescription.status.toLowerCase()}">
                    ${getPrescriptionStatusText(prescription.status)}
                </span>
            </div>
            <div class="prescription-actions">
                <button class="btn btn-sm btn-outline" onclick="viewPrescription(${prescription.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="downloadPrescription(${prescription.id})">
                    <i class="fas fa-download"></i>
                </button>
                ${prescription.status === 'ACTIVE' ? `
                    <button class="btn btn-sm btn-success" onclick="remindPrescription(${prescription.id})">
                        <i class="fas fa-bell"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function viewPrescription(prescriptionId) {
    window.open(`/bemor/retsept/${prescriptionId}`, '_blank');
}

function downloadPrescription(prescriptionId) {
    showLoading();
    
    fetch(`/bemor/api/prescriptions/${prescriptionId}/download`)
        .then(response => response.blob())
        .then(blob => {
            hideLoading();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `retsept-${prescriptionId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showSuccess('Retsept yuklab olindi');
        })
        .catch(error => {
            hideLoading();
            showError('Retsept yuklab olishda xatolik: ' + error.message);
        });
}

function remindPrescription(prescriptionId) {
    if ('Notification' in window && Notification.permission === 'granted') {
        // Retsept eslatmasini sozlash
        showSuccess('Retsept eslatmasi sozlandi');
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showSuccess('Retsept eslatmasi sozlandi');
            }
        });
    }
}

// Tahlil natijalari
function initLabResults() {
    loadLabResults();
    initResultAnalysis();
}

function loadLabResults() {
    fetch('/bemor/api/lab-results')
        .then(response => response.json())
        .then(results => {
            updateLabResults(results);
        })
        .catch(error => {
            console.error('Tahlil natijalarini yuklashda xatolik:', error);
        });
}

function updateLabResults(results) {
    const container = document.getElementById('labResults');
    const emptyState = document.getElementById('noLabResults');
    
    if (!container) return;
    
    if (results.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = results.map(result => `
        <div class="lab-result-item">
            <div class="lab-result-header">
                <div class="lab-result-title">
                    <div class="lab-result-icon">
                        <i class="fas fa-vial"></i>
                    </div>
                    <div class="lab-result-name">
                        <h5>${result.testName}</h5>
                        <p>${result.labName}</p>
                    </div>
                </div>
                <div class="lab-result-date">
                    ${formatDate(result.testDate)}
                </div>
            </div>
            <div class="lab-result-values">
                ${result.values.map(value => `
                    <div class="lab-value ${getValueStatus(value)}">
                        <span class="lab-value-name">${value.name}</span>
                        <span class="lab-value-result">
                            ${value.value} ${value.unit}
                            ${value.referenceRange ? `<small>(${value.referenceRange})</small>` : ''}
                        </span>
                    </div>
                `).join('')}
            </div>
            <div class="lab-result-actions">
                <button class="btn btn-sm btn-outline" onclick="viewLabResult(${result.id})">
                    <i class="fas fa-eye"></i> Ko'rish
                </button>
                <button class="btn btn-sm btn-primary" onclick="downloadLabResult(${result.id})">
                    <i class="fas fa-download"></i> Yuklab olish
                </button>
            </div>
        </div>
    `).join('');
}

function getValueStatus(value) {
    if (value.status === 'NORMAL') return 'normal';
    if (value.status === 'HIGH' || value.status === 'LOW') return 'abnormal';
    if (value.status === 'CRITICAL') return 'warning';
    return 'normal';
}

function viewLabResult(resultId) {
    window.open(`/bemor/tahlil/${resultId}`, '_blank');
}

function downloadLabResult(resultId) {
    showLoading();
    
    fetch(`/bemor/api/lab-results/${resultId}/download`)
        .then(response => response.blob())
        .then(blob => {
            hideLoading();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `tahlil-natijasi-${resultId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showSuccess('Tahlil natijasi yuklab olindi');
        })
        .catch(error => {
            hideLoading();
            showError('Tahlil natijasini yuklab olishda xatolik: ' + error.message);
        });
}

// Bildirishnomalar
function initNotifications() {
    requestNotificationPermission();
    setupPeriodicChecks();
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function setupPeriodicChecks() {
    // Har 5 daqiqada yangiliklarni tekshirish
    setInterval(checkForUpdates, 300000);
}

function checkForUpdates() {
    fetch('/bemor/api/check-updates')
        .then(response => response.json())
        .then(updates => {
            if (updates.newResults) {
                showNotification('Sizda yangi tahlil natijalari mavjud');
            }
            if (updates.upcomingAppointments) {
                showNotification('Ertangi kunga qabullingiz bor');
            }
            if (updates.newPrescriptions) {
                showNotification('Yangi retseptingiz mavjud');
            }
        })
        .catch(error => console.error('Yangiliklarni tekshirishda xatolik:', error));
}

function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('As-Salom Klinikasi', {
            body: message,
            icon: '/images/logo.png',
            tag: 'patient-update'
        });
    }
    
    // Brauzer ichidagi bildirishnoma
    showToast(message, 'info');
}

// Utility funksiyalar
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTime(dateTimeString) {
    return new Date(dateTimeString).toLocaleString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getAppointmentStatusText(status) {
    const statusMap = {
        'UPCOMING': 'Rejalashtirilgan',
        'IN_PROGRESS': 'Jarayonda',
        'COMPLETED': 'Yakunlangan',
        'CANCELLED': 'Bekor qilingan'
    };
    return statusMap[status] || status;
}

function getPrescriptionStatusText(status) {
    const statusMap = {
        'ACTIVE': 'Faol',
        'COMPLETED': 'Yakunlangan',
        'EXPIRED': 'Muddati o\'tgan'
    };
    return statusMap[status] || status;
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Global bemor funksiyalari
window.patient = {
    refreshData: function() {
        showLoading();
        Promise.all([
            loadPatientOverview(),
            loadUpcomingAppointments(),
            loadMedicalRecords(),
            loadPrescriptions(),
            loadLabResults()
        ]).then(() => {
            hideLoading();
            showSuccess('Ma\'lumotlar yangilandi');
        }).catch(error => {
            hideLoading();
            showError('Ma\'lumotlarni yangilashda xatolik');
        });
    },
    
    contactSupport: function() {
        openModal('supportModal');
    },
    
    emergencyCall: function() {
        if (confirm('Shoshilinch tibbiy yordam kerakmi?\n\n103 raqamiga qo\'ng\'iroq qilamizmi?')) {
            window.location.href = 'tel:103';
        }
    },
    
    shareMedicalData: function(doctorId) {
        if (confirm('Tibbiy ma\'lumotlaringizni ushbu doktor bilan baham ko\'rmoqchimisiz?')) {
            fetch('/bemor/api/share-medical-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doctorId: doctorId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess('Ma\'lumotlar muvaffaqiyatli baham ko\'rildi');
                } else {
                    showError('Ma\'lumotlarni baham ko\'rishda xatolik');
                }
            })
            .catch(error => {
                showError('Server xatosi: ' + error.message);
            });
        }
    }
};

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw-bemor.js')
            .then(function(registration) {
                console.log('Bemor ServiceWorker registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('Bemor ServiceWorker registration failed: ', registrationError);
            });
    });
}

// Periodic data sync
setInterval(() => {
    if (navigator.onLine) {
        window.patient.refreshData();
    }
}, 300000); // 5 minutes