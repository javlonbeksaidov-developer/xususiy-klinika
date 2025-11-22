// Admin paneli uchun JavaScript - admin.js

// DOM yuklanganidan keyin ishga tushadi
document.addEventListener('DOMContentLoaded', function() {
    initAdminDashboard();
    initUserManagement();
    initStatistics();
    initSystemSettings();
});

// Admin dashboard boshqaruvi
function initAdminDashboard() {
    initCharts();
    initRealTimeUpdates();
    initQuickStats();
}

// Chartlarni ishga tushirish
function initCharts() {
    // Bemorlar oqimi grafigi
    const patientsChart = document.getElementById('patientsChart');
    if (patientsChart) {
        renderPatientsChart();
    }
    
    // Daromad grafigi
    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
        renderRevenueChart();
    }
}

// Bemorlar oqimi grafigi
function renderPatientsChart() {
    const ctx = document.getElementById('patientsChart').getContext('2d');
    
    // Demo ma'lumotlar
    const data = {
        labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
        datasets: [{
            label: 'Bemorlar Soni',
            data: [120, 150, 180, 200, 240, 280, 300, 320, 290, 260, 230, 280],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Daromad grafigi
function renderRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    const data = {
        labels: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'],
        datasets: [{
            label: 'Daromad (mln)',
            data: [4.2, 5.1, 3.8, 6.2, 7.5, 8.1, 5.9],
            backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(155, 89, 182, 0.8)',
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(155, 89, 182, 0.8)',
                'rgba(52, 152, 219, 0.8)'
            ],
            borderWidth: 0
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Real-time yangilanishlar
function initRealTimeUpdates() {
    // Har 30 soniyada statistikani yangilash
    setInterval(updateRealTimeStats, 30000);
    
    // WebSocket orqali real-time yangilanishlar
    initWebSocketConnection();
}

function updateRealTimeStats() {
    fetch('/admin/api/real-time-stats')
        .then(response => response.json())
        .then(data => {
            updateStatsDisplay(data);
        })
        .catch(error => {
            console.error('Real-time stats yangilashda xatolik:', error);
        });
}

function updateStatsDisplay(stats) {
    // Statistik kartalarni yangilash
    const elements = {
        'total-users': stats.totalUsers,
        'active-doctors': stats.activeDoctors,
        'registered-patients': stats.registeredPatients,
        'today-appointments': stats.todayAppointments
    };
    
    Object.keys(elements).forEach(key => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            animateValue(element, parseInt(element.textContent), elements[key], 1000);
        }
    });
}

// Qiymatni animatsiya bilan yangilash
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

// WebSocket ulanishi
function initWebSocketConnection() {
    // WebSocket logikasi keyinroq to'ldiriladi
    console.log('WebSocket connection initialized for admin dashboard');
}

// Tezkor statistikalar
function initQuickStats() {
    // Dashboard widgetlarini yangilash
    updateDashboardWidgets();
}

function updateDashboardWidgets() {
    // Widget ma'lumotlarini yangilash
    const widgets = document.querySelectorAll('.dashboard-widget');
    
    widgets.forEach(widget => {
        const widgetType = widget.getAttribute('data-widget');
        
        fetch(`/admin/api/widget-data?type=${widgetType}`)
            .then(response => response.json())
            .then(data => {
                updateWidgetContent(widget, data);
            })
            .catch(error => {
                console.error(`Widget ${widgetType} yangilashda xatolik:`, error);
            });
    });
}

function updateWidgetContent(widget, data) {
    const content = widget.querySelector('.widget-content');
    if (content) {
        content.innerHTML = `
            <div class="widget-value">${data.value}</div>
            <div class="widget-label">${data.label}</div>
            <div class="widget-trend ${data.trend}">
                <i class="fas fa-arrow-${data.trend === 'up' ? 'up' : 'down'}"></i>
                ${data.change}%
            </div>
        `;
    }
}

// Foydalanuvchi boshqaruvi
function initUserManagement() {
    initUserTable();
    initUserForms();
    initBulkActions();
}

// Foydalanuvchi jadvali
function initUserTable() {
    const userTable = document.getElementById('usersTable');
    if (userTable) {
        initDataTable(userTable);
        initUserFilters();
    }
}

// DataTable ishga tushirish
function initDataTable(table) {
    // Simple sort functionality
    const headers = table.querySelectorAll('th[data-sort]');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            const direction = this.getAttribute('data-direction') || 'asc';
            const newDirection = direction === 'asc' ? 'desc' : 'asc';
            
            this.setAttribute('data-direction', newDirection);
            sortUsersTable(column, newDirection);
        });
    });
}

function sortUsersTable(column, direction) {
    const table = document.getElementById('usersTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.querySelector(`td[data-${column}]`).getAttribute(`data-${column}`);
        const bValue = b.querySelector(`td[data-${column}]`).getAttribute(`data-${column}`);
        
        if (direction === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
    
    // Yangi tartibda qayta joylashtirish
    rows.forEach(row => tbody.appendChild(row));
}

// Foydalanuvchi filtrlari
function initUserFilters() {
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('userSearch');
    
    if (roleFilter) {
        roleFilter.addEventListener('change', filterUsers);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterUsers);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterUsers, 300));
    }
}

function filterUsers() {
    const role = document.getElementById('roleFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('userSearch').value.toLowerCase();
    
    const rows = document.querySelectorAll('#usersTable tbody tr');
    
    rows.forEach(row => {
        const userRole = row.getAttribute('data-role');
        const userStatus = row.getAttribute('data-status');
        const userName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const userPhone = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        const roleMatch = !role || userRole === role;
        const statusMatch = !status || userStatus === status;
        const searchMatch = !search || userName.includes(search) || userPhone.includes(search);
        
        row.style.display = roleMatch && statusMatch && searchMatch ? '' : 'none';
    });
}

// Foydalanuvchi formlari
function initUserForms() {
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserFormSubmit);
        initPasswordToggle();
    }
}

function handleUserFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    // Parolni tekshirish
    if (userData.password !== userData.confirmPassword) {
        showError('Parollar mos kelmadi');
        return;
    }
    
    // Formani yuborish
    submitUserForm(userData);
}

function submitUserForm(userData) {
    showLoading();
    
    fetch('/admin/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccess('Foydalanuvchi muvaffaqiyatli yaratildi');
            setTimeout(() => {
                window.location.href = '/admin/users';
            }, 1500);
        } else {
            showError(data.message || 'Foydalanuvchi yaratishda xatolik');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Server xatosi: ' + error.message);
    });
}

// Parolni ko'rsatish/yashirish
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            this.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });
    });
}

// Bir nechta amallar
function initBulkActions() {
    const selectAll = document.getElementById('selectAll');
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    const bulkActions = document.getElementById('bulkActions');
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const isChecked = this.checked;
            userCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            toggleBulkActions();
        });
    }
    
    userCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleBulkActions);
    });
}

function toggleBulkActions() {
    const checkedBoxes = document.querySelectorAll('.user-checkbox:checked');
    const bulkActions = document.getElementById('bulkActions');
    
    if (checkedBoxes.length > 0) {
        bulkActions.style.display = 'block';
    } else {
        bulkActions.style.display = 'none';
    }
}

// Statistikalar boshqaruvi
function initStatistics() {
    initStatFilters();
    initReportGeneration();
}

// Statistika filtrlari
function initStatFilters() {
    const dateRange = document.getElementById('dateRange');
    const statType = document.getElementById('statType');
    
    if (dateRange) {
        dateRange.addEventListener('change', updateStatistics);
    }
    
    if (statType) {
        statType.addEventListener('change', updateStatistics);
    }
}

function updateStatistics() {
    const dateRange = document.getElementById('dateRange').value;
    const statType = document.getElementById('statType').value;
    
    showLoading();
    
    fetch(`/admin/api/statistics?range=${dateRange}&type=${statType}`)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            renderStatistics(data);
        })
        .catch(error => {
            hideLoading();
            showError('Statistika yangilashda xatolik: ' + error.message);
        });
}

function renderStatistics(data) {
    // Statistik ma'lumotlarni chiqarish
    const container = document.getElementById('statisticsContainer');
    if (container) {
        container.innerHTML = `
            <div class="stat-grid">
                ${data.metrics.map(metric => `
                    <div class="stat-item">
                        <h4>${metric.label}</h4>
                        <div class="stat-value">${metric.value}</div>
                        <div class="stat-change ${metric.trend}">
                            <i class="fas fa-arrow-${metric.trend}"></i>
                            ${metric.change}%
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Hisobot generatsiya
function initReportGeneration() {
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', generateReport);
    }
}

function generateReport(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = Object.fromEntries(formData);
    
    showLoading();
    
    fetch('/admin/api/generate-report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
    })
    .then(response => response.blob())
    .then(blob => {
        hideLoading();
        // PDF yoki Excel faylni yuklab olish
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showSuccess('Hisobot muvaffaqiyatli yaratildi');
    })
    .catch(error => {
        hideLoading();
        showError('Hisobot yaratishda xatolik: ' + error.message);
    });
}

// Tizim sozlamalari
function initSystemSettings() {
    initSettingsForm();
    initBackupSystem();
    initSystemHealth();
}

// Sozlamalar formasi
function initSettingsForm() {
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', saveSettings);
        loadCurrentSettings();
    }
}

function loadCurrentSettings() {
    fetch('/admin/api/settings')
        .then(response => response.json())
        .then(settings => {
            // Sozlamalarni formaga yuklash
            Object.keys(settings).forEach(key => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = settings[key];
                    } else {
                        input.value = settings[key];
                    }
                }
            });
        })
        .catch(error => {
            console.error('Sozlamalarni yuklashda xatolik:', error);
        });
}

function saveSettings(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const settings = Object.fromEntries(formData);
    
    showLoading();
    
    fetch('/admin/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccess('Sozlamalar muvaffaqiyatli saqlandi');
        } else {
            showError('Sozlamalarni saqlashda xatolik');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Server xatosi: ' + error.message);
    });
}

// Backup tizimi
function initBackupSystem() {
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', createBackup);
    }
}

function createBackup() {
    if (!confirm('Ma\'lumotlar bazasining zaxira nusxasini yaratmoqchimisiz?')) {
        return;
    }
    
    showLoading();
    
    fetch('/admin/api/backup', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showSuccess('Zaxira nusxasi muvaffaqiyatli yaratildi');
            updateBackupList();
        } else {
            showError('Zaxira nusxasi yaratishda xatolik');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Server xatosi: ' + error.message);
    });
}

function updateBackupList() {
    fetch('/admin/api/backups')
        .then(response => response.json())
        .then(backups => {
            const list = document.getElementById('backupList');
            if (list) {
                list.innerHTML = backups.map(backup => `
                    <div class="backup-item">
                        <span>${backup.name}</span>
                        <span>${backup.size}</span>
                        <span>${backup.date}</span>
                        <button onclick="downloadBackup('${backup.name}')" class="btn btn-sm btn-primary">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Backup ro\'yxatini yangilashda xatolik:', error);
        });
}

function downloadBackup(filename) {
    window.open(`/admin/api/backup/download?file=${filename}`, '_blank');
}

// Tizim sog'lig'i
function initSystemHealth() {
    updateSystemHealth();
    setInterval(updateSystemHealth, 60000); // Har 1 daqiqada
}

function updateSystemHealth() {
    fetch('/admin/api/system-health')
        .then(response => response.json())
        .then(health => {
            updateHealthDisplay(health);
        })
        .catch(error => {
            console.error('Tizim sog\'lig\'ini yangilashda xatolik:', error);
        });
}

function updateHealthDisplay(health) {
    const container = document.getElementById('systemHealth');
    if (container) {
        container.innerHTML = `
            <div class="health-grid">
                ${health.components.map(component => `
                    <div class="health-item ${component.status}">
                        <div class="health-icon">
                            <i class="fas fa-${getHealthIcon(component.status)}"></i>
                        </div>
                        <div class="health-info">
                            <h5>${component.name}</h5>
                            <p>${component.message}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function getHealthIcon(status) {
    const icons = {
        'healthy': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[status] || 'question-circle';
}

// Utility funksiyalar
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

// Global admin funksiyalari
window.admin = {
    deleteUser: function(userId) {
        if (confirm('Bu foydalanuvchini o\'chirishni tasdiqlaysizmi?')) {
            fetch(`/admin/api/users/${userId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess('Foydalanuvchi muvaffaqiyatli o\'chirildi');
                    // Jadvalni yangilash
                    location.reload();
                } else {
                    showError('Foydalanuvchini o\'chirishda xatolik');
                }
            })
            .catch(error => {
                showError('Server xatosi: ' + error.message);
            });
        }
    },
    
    toggleUserStatus: function(userId, currentStatus) {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        
        fetch(`/admin/api/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess(`Foydalanuvchi ${newStatus === 'active' ? 'faollashtirildi' : 'bloklandi'}`);
                location.reload();
            } else {
                showError('Holatni yangilashda xatolik');
            }
        })
        .catch(error => {
            showError('Server xatosi: ' + error.message);
        });
    }
};