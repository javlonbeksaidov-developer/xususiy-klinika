// Qabulxona paneli uchun JavaScript - qabulxona.js

// DOM yuklanganidan keyin ishga tushadi
document.addEventListener('DOMContentLoaded', function() {
    initReceptionDashboard();
    initQueueManagement();
    initPatientRegistration();
    initPaymentSystem();
    initSMSsystem();
});

// Qabulxona dashboard boshqaruvi
function initReceptionDashboard() {
    loadDashboardStats();
    initRealTimeUpdates();
    initAutoRefresh();
}

// Dashboard statistikalarini yuklash
function loadDashboardStats() {
    fetch('/qabulxona/api/dashboard-stats')
        .then(response => response.json())
        .then(stats => {
            updateStatsDisplay(stats);
        })
        .catch(error => {
            console.error('Statistika yuklashda xatolik:', error);
        });
}

function updateStatsDisplay(stats) {
    // Asosiy statistik kartalar
    const statElements = {
        'todayPatients': stats.todayPatients,
        'waitingPatients': stats.waitingPatients,
        'todayRevenue': stats.todayRevenue,
        'activeDoctors': stats.activeDoctors
    };

    Object.keys(statElements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            animateValue(element, parseInt(element.textContent) || 0, statElements[key], 1000);
        }
    });

    // Umumiy summani yangilash
    const totalAmount = document.getElementById('totalAmount');
    if (totalAmount) {
        totalAmount.innerHTML = `<strong>${formatCurrency(stats.totalRevenue)}</strong>`;
    }
}

// Real-time yangilanishlar
function initRealTimeUpdates() {
    // WebSocket orqali real-time yangilanishlar
    initReceptionWebSocket();
    
    // Har 30 soniyada ma'lumotlarni yangilash
    setInterval(loadDashboardStats, 30000);
}

function initReceptionWebSocket() {
    // WebSocket ulanishi navbat yangilanishlari uchun
    try {
        const socket = new WebSocket(`ws://${window.location.host}/qabulxona/queue`);
        
        socket.onopen = function() {
            console.log('Qabulxona WebSocket ulandi');
        };
        
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            handleRealtimeUpdate(data);
        };
        
        socket.onclose = function() {
            console.log('Qabulxona WebSocket ulanishi uzildi');
            // Qayta ulanish
            setTimeout(initReceptionWebSocket, 5000);
        };
        
    } catch (error) {
        console.error('WebSocket ulanishida xatolik:', error);
    }
}

function handleRealtimeUpdate(data) {
    switch (data.type) {
        case 'QUEUE_UPDATE':
            updateQueueDisplay(data.queue);
            break;
        case 'NEW_PATIENT':
            addNewPatientToQueue(data.patient);
            break;
        case 'PATIENT_CALLED':
            handlePatientCalled(data.patient);
            break;
        case 'DOCTOR_STATUS':
            updateDoctorStatus(data.doctor);
            break;
        case 'NEW_PAYMENT':
            addNewPayment(data.payment);
            break;
    }
}

// Avtomatik yangilash
function initAutoRefresh() {
    // Har 2 daqiqada to'liq yangilash
    setInterval(() => {
        loadWaitingQueue();
        loadDoctorsStatus();
    }, 120000);
}

// Navbat boshqaruvi
function initQueueManagement() {
    loadWaitingQueue();
    initQueueControls();
    initPatientCalling();
}

// Kutish navbatini yuklash
function loadWaitingQueue() {
    fetch('/qabulxona/api/waiting-queue')
        .then(response => response.json())
        .then(queue => {
            updateQueueDisplay(queue);
        })
        .catch(error => {
            console.error('Navbat yuklashda xatolik:', error);
        });
}

function updateQueueDisplay(queue) {
    // Joriy va keyingi bemorlarni yangilash
    updateCurrentNextPatients(queue.current, queue.next);
    
    // Kutish ro'yxatini yangilash
    updateWaitingList(queue.waiting);
    
    // Kutayotganlar sonini yangilash
    updateWaitingCount(queue.waiting.length);
}

function updateCurrentNextPatients(current, next) {
    const currentPatient = document.getElementById('currentPatient');
    const nextPatient = document.getElementById('nextPatient');
    
    if (currentPatient) {
        if (current) {
            currentPatient.innerHTML = `
                <div class="current-label">Hozirgi Bemor:</div>
                <div class="patient-name">${current.patientName}</div>
                <div class="doctor-name">${current.doctorName}</div>
            `;
        } else {
            currentPatient.innerHTML = `
                <div class="current-label">Hozirgi Bemor:</div>
                <div class="patient-name">-</div>
                <div class="doctor-name">-</div>
            `;
        }
    }
    
    if (nextPatient) {
        if (next) {
            nextPatient.innerHTML = `
                <div class="next-label">Keyingi Bemor:</div>
                <div class="patient-name">${next.patientName}</div>
                <div class="doctor-name">${next.doctorName}</div>
            `;
        } else {
            nextPatient.innerHTML = `
                <div class="next-label">Keyingi Bemor:</div>
                <div class="patient-name">-</div>
                <div class="doctor-name">-</div>
            `;
        }
    }
}

function updateWaitingList(waitingPatients) {
    const waitingItems = document.getElementById('waitingItems');
    if (!waitingItems) return;
    
    if (waitingPatients.length === 0) {
        waitingItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>Hozircha kutayotgan bemorlar yo'q</p>
            </div>
        `;
        return;
    }
    
    waitingItems.innerHTML = waitingPatients.map((patient, index) => `
        <div class="waiting-item ${patient.urgent ? 'urgent' : ''}">
            <div class="waiting-item-info">
                <div class="waiting-number">${index + 1}</div>
                <div class="waiting-patient-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="waiting-patient-details">
                    <h5>${patient.patientName}</h5>
                    <p>${patient.serviceType} • ${patient.age} yosh</p>
                    ${patient.note ? `<div class="patient-note">${patient.note}</div>` : ''}
                </div>
            </div>
            <div class="waiting-doctor">
                <div class="waiting-doctor-name">${patient.doctorName}</div>
                <div class="waiting-doctor-room">Xona: ${patient.roomNumber}</div>
                <div class="waiting-time">${formatTime(patient.waitingTime)}</div>
            </div>
            <div class="waiting-actions">
                <button class="btn btn-sm btn-success" onclick="callPatient(${patient.id})">
                    <i class="fas fa-bullhorn"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="skipPatient(${patient.id})">
                    <i class="fas fa-forward"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateWaitingCount(count) {
    const waitingCount = document.getElementById('waitingCount');
    if (waitingCount) {
        waitingCount.textContent = `${count} kishi`;
    }
}

// Navbat kontrollari
function initQueueControls() {
    // Navbat boshqaruv tugmalari
}

// Bemor chaqirish
function initPatientCalling() {
    // Bemor chaqirish funksionalligi
}

function callNextPatient() {
    showLoading();
    
    fetch('/qabulxona/api/call-next-patient', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccess('Keyingi bemor chaqirildi');
            openCallPatientModal(data.patient);
        } else {
            showError('Bemor chaqirishda xatolik: ' + data.message);
        }
    })
    .catch(error => {
        hideLoading();
        showError('Server xatosi: ' + error.message);
    });
}

function openCallPatientModal(patient) {
    document.getElementById('calledPatientName').textContent = patient.patientName;
    document.getElementById('calledDoctorName').textContent = patient.doctorName;
    document.getElementById('calledRoomNumber').textContent = patient.roomNumber;
    
    openModal('callPatientModal');
    
    // Avtomatik e'lon qilish
    setTimeout(announcePatient, 1000);
}

function callPatient(patientId) {
    fetch(`/qabulxona/api/call-patient/${patientId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('Bemor chaqirildi');
            openCallPatientModal(data.patient);
        } else {
            showError('Bemor chaqirishda xatolik');
        }
    })
    .catch(error => {
        showError('Server xatosi: ' + error.message);
    });
}

function skipPatient(patientId) {
    if (!confirm('Bu bemorni o\'tkazib yubormoqchimisiz?')) {
        return;
    }
    
    fetch(`/qabulxona/api/skip-patient/${patientId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('Bemor o\'tkazib yuborildi');
            loadWaitingQueue();
        } else {
            showError('Bemorni o\'tkazib yuborishda xatolik');
        }
    })
    .catch(error => {
        showError('Server xatosi: ' + error.message);
    });
}

function announcePatient() {
    const patientName = document.getElementById('calledPatientName').textContent;
    const doctorName = document.getElementById('calledDoctorName').textContent;
    const roomNumber = document.getElementById('calledRoomNumber').textContent;
    
    // Ovozli e'lon qilish
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Hurmatli ${patientName}, iltimos, ${doctorName} doktoriga, ${roomNumber} xonasiga boring`;
        utterance.lang = 'uz-UZ';
        utterance.rate = 0.8;
        
        speechSynthesis.speak(utterance);
    }
    
    // Ekran e'loni
    showOnDisplayScreen(patientName, doctorName, roomNumber);
    
    // Modalni yopish
    setTimeout(() => {
        closeModal('callPatientModal');
        loadWaitingQueue();
    }, 5000);
}

function showOnDisplayScreen(patientName, doctorName, roomNumber) {
    // Display ekranda ko'rsatish logikasi
    console.log(`DISPLAY: ${patientName} -> ${doctorName} (${roomNumber})`);
}

// Bemor ro'yxatdan o'tkazish
function initPatientRegistration() {
    loadRecentPatients();
    initPatientForm();
    initQuickRegistration();
}

// Oxirgi qo'shilgan bemorlarni yuklash
function loadRecentPatients() {
    fetch('/qabulxona/api/recent-patients')
        .then(response => response.json())
        .then(patients => {
            updateRecentPatientsTable(patients);
        })
        .catch(error => {
            console.error('Oxirgi bemorlarni yuklashda xatolik:', error);
        });
}

function updateRecentPatientsTable(patients) {
    const tableBody = document.getElementById('recentPatientsTable');
    if (!tableBody) return;
    
    if (patients.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-user-slash"></i>
                        <p>Hozircha qo'shilgan bemorlar yo'q</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = patients.map(patient => `
        <tr>
            <td>
                <div class="patient-cell">
                    <div class="patient-avatar-sm">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="patient-name">${patient.fullName}</div>
                        <div class="patient-age">${patient.age} yosh</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="patient-phone">${patient.phone}</div>
            </td>
            <td>
                <div class="record-number">${patient.recordNumber}</div>
            </td>
            <td>
                <div class="registration-time">${formatDateTime(patient.registrationTime)}</div>
            </td>
            <td>
                <span class="status-badge ${patient.status.toLowerCase()}">${getStatusText(patient.status)}</span>
            </td>
            <td>
                <div class="patient-actions">
                    <button class="btn btn-sm btn-outline" onclick="viewPatient(${patient.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editPatient(${patient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="createAppointment(${patient.id})">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Tezkor ro'yxatdan o'tkazish
function initQuickRegistration() {
    // Tezkor ro'yxatdan o'tkazish formasi
}

// To'lov tizimi
function initPaymentSystem() {
    loadTodayPayments();
    initPaymentForm();
    initPaymentCalculation();
}

// Bugungi to'lovlarni yuklash
function loadTodayPayments() {
    fetch('/qabulxona/api/today-payments')
        .then(response => response.json())
        .then(payments => {
            updateTodayPayments(payments);
        })
        .catch(error => {
            console.error('Bugungi to\'lovlarni yuklashda xatolik:', error);
        });
}

function updateTodayPayments(payments) {
    const container = document.getElementById('todayPayments');
    if (!container) return;
    
    if (payments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>Bugungi to'lovlar yo'q</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = payments.map(payment => `
        <div class="payment-item">
            <div class="payment-info">
                <div class="payment-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="payment-details">
                    <h5>${payment.patientName}</h5>
                    <p>${payment.serviceType}</p>
                </div>
            </div>
            <div class="payment-amount-time">
                <div class="payment-amount">${formatCurrency(payment.amount)}</div>
                <div class="payment-time">${formatTime(payment.paymentTime)}</div>
            </div>
        </div>
    `).join('');
}

// SMS tizimi
function initSMSsystem() {
    initSMSForm();
    initSMSTemplates();
    initBulkSMS();
}

// Doktorlar holati
function loadDoctorsStatus() {
    fetch('/qabulxona/api/doctors-status')
        .then(response => response.json())
        .then(doctors => {
            updateDoctorsStatus(doctors);
        })
        .catch(error => {
            console.error('Doktorlar holatini yuklashda xatolik:', error);
        });
}

function updateDoctorsStatus(doctors) {
    const container = document.getElementById('doctorsList');
    if (!container) return;
    
    container.innerHTML = doctors.map(doctor => `
        <div class="doctor-status-item ${doctor.status.toLowerCase()}">
            <div class="doctor-status-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="doctor-status-info">
                <div class="doctor-status-name">${doctor.fullName}</div>
                <div class="doctor-status-specialty">${doctor.specialty}</div>
                <div class="doctor-status-details">
                    ${doctor.currentPatient ? `Bemor: ${doctor.currentPatient}` : 'Bemor yo\'q'}
                    ${doctor.waitingCount > 0 ? ` • Navbatda: ${doctor.waitingCount}` : ''}
                </div>
            </div>
            <div class="doctor-status-indicator"></div>
        </div>
    `).join('');
}

// Utility funksiyalar
function formatCurrency(amount) {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS'
    }).format(amount);
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

function getStatusText(status) {
    const statusMap = {
        'WAITING': 'Kutmoqda',
        'IN_PROGRESS': 'Jarayonda',
        'COMPLETED': 'Yakunlangan',
        'CANCELLED': 'Bekor qilingan'
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

function refreshQueue() {
    showLoading();
    loadWaitingQueue();
    setTimeout(() => {
        hideLoading();
        showSuccess('Navbat yangilandi');
    }, 1000);
}

// Global qabulxona funksiyalari
window.reception = {
    createQuickPatient: function(patientData) {
        showLoading();
        
        return fetch('/qabulxona/api/patients/quick', {
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
                showSuccess('Bemor tez ro\'yxatdan o\'tkazildi');
                return data.patient;
            } else {
                throw new Error(data.message || 'Bemor ro\'yxatdan o\'tkazishda xatolik');
            }
        });
    },
    
    processPayment: function(paymentData) {
        showLoading();
        
        return fetch('/qabulxona/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.success) {
                showSuccess('To\'lov muvaffaqiyatli amalga oshirildi');
                return data.payment;
            } else {
                throw new Error(data.message || 'To\'lov amalga oshirishda xatolik');
            }
        });
    },
    
    sendSMS: function(smsData) {
        showLoading();
        
        return fetch('/qabulxona/api/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(smsData)
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.success) {
                showSuccess('SMS muvaffaqiyatli yuborildi');
                return data.result;
            } else {
                throw new Error(data.message || 'SMS yuborishda xatolik');
            }
        });
    },
    
    generateDailyReport: function() {
        showLoading();
        
        fetch('/qabulxona/api/reports/daily')
        .then(response => response.blob())
        .then(blob => {
            hideLoading();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `kunlik-hisobot-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showSuccess('Kunlik hisobot yaratildi');
        })
        .catch(error => {
            hideLoading();
            showError('Hisobot yaratishda xatolik: ' + error.message);
        });
    }
};

// Modal funksiyalari
function createAppointment(patientId) {
    // Bemorga qabul bron qilish
    fetch(`/qabulxona/api/patients/${patientId}`)
        .then(response => response.json())
        .then(patient => {
            document.getElementById('patientSelect').value = patientId;
            openModal('appointmentModal');
        })
        .catch(error => {
            showError('Bemor ma\'lumotlarini yuklashda xatolik');
        });
}

function generateDailyReport() {
    window.reception.generateDailyReport();
}

// Dastlabki yuklash
loadDoctorsStatus();