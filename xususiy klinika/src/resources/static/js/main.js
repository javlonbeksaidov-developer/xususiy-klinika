// Asosiy JavaScript fayli - main.js

// DOM yuklanganidan keyin ishga tushadi
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Asosiy ilova ishga tushirish
function initApp() {
    initSidebar();
    initNotifications();
    initForms();
    initTables();
    initModals();
    initSearch();
    initDatePickers();
}

// Sidebar boshqaruvi
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Active menu itemni belgilash
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href)) {
            item.classList.add('active');
        }
    });
}

// Bildirishnomalar boshqaruvi
function initNotifications() {
    // Toast bildirishnomalar
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Automatik yopilish
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Qo'lda yopish
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    };
    
    // Xatolikni ko'rsatish
    window.showError = function(message) {
        showToast(message, 'error');
    };
    
    // Muvaffaqiyatni ko'rsatish
    window.showSuccess = function(message) {
        showToast(message, 'success');
    };
}

// Formalar boshqaruvi
function initForms() {
    // Barcha formlarni validatsiya qilish
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
    
    // Real-time validatsiya
    const inputs = document.querySelectorAll('input[data-validate]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Forma validatsiya funksiyasi
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Maydon validatsiyasi
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || 'Maydon';
    
    // Required validatsiya
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${fieldName} maydoni to'ldirilishi shart`);
        return false;
    }
    
    // Email validatsiya
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Iltimos, to\'g\'ri email manzilini kiriting');
            return false;
        }
    }
    
    // Telefon validatsiya
    if (field.name === 'telefon' && value) {
        const phoneRegex = /^\+998[0-9]{9}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Iltimos, to\'g\'ri telefon raqamini kiriting (+998901234567)');
            return false;
        }
    }
    
    // Parol validatsiya
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            showFieldError(field, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

// Maydon xatosini ko'rsatish
function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

// Maydon xatosini tozalash
function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Jadval boshqaruvi
function initTables() {
    // Jadval sortirovkasi
    const sortableHeaders = document.querySelectorAll('th[data-sort]');
    
    sortableHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const table = this.closest('table');
            const columnIndex = Array.from(this.parentNode.children).indexOf(this);
            const isAscending = this.classList.contains('sort-asc');
            
            // Barcha sort headerlarini tozalash
            sortableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Yangi tartibni belgilash
            this.classList.toggle('sort-asc', !isAscending);
            this.classList.toggle('sort-desc', isAscending);
            
            sortTable(table, columnIndex, !isAscending);
        });
    });
    
    // Jadval qidiruvi
    const tableSearch = document.querySelector('.table-search');
    if (tableSearch) {
        tableSearch.addEventListener('input', function() {
            const table = document.querySelector(this.getAttribute('data-table'));
            filterTable(table, this.value);
        });
    }
}

// Jadval sortirovkasi
function sortTable(table, columnIndex, ascending = true) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.children[columnIndex].textContent.trim();
        const bValue = b.children[columnIndex].textContent.trim();
        
        // Raqamli solishtirish
        if (!isNaN(aValue) && !isNaN(bValue)) {
            return ascending ? aValue - bValue : bValue - aValue;
        }
        
        // Matnli solishtirish
        return ascending ? 
            aValue.localeCompare(bValue) : 
            bValue.localeCompare(aValue);
    });
    
    // Yangi tartibda qayta joylashtirish
    rows.forEach(row => tbody.appendChild(row));
}

// Jadval filtrlash
function filterTable(table, searchText) {
    const rows = table.querySelectorAll('tbody tr');
    const searchLower = searchText.toLowerCase();
    
    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchLower) ? '' : 'none';
    });
}

// Modal oynalar boshqaruvi
function initModals() {
    // Modal ochish
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Modal yopish
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    // Modal yopish tugmalari
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Tashqariga bosganda yopish
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// Qidiruv boshqaruvi
function initSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        let timeout;
        
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const searchUrl = this.getAttribute('data-search-url');
                const searchValue = this.value.trim();
                
                if (searchUrl && searchValue.length >= 2) {
                    performSearch(searchUrl, searchValue);
                }
            }, 500);
        });
    });
}

// Qidiruv amalga oshirish
function performSearch(url, query) {
    fetch(`${url}?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            updateSearchResults(data);
        })
        .catch(error => {
            console.error('Qidiruv xatosi:', error);
            showError('Qidiruvda xatolik yuz berdi');
        });
}

// Sana tanlovchilar
function initDatePickers() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        // O'tgan sanalarni bloklash
        if (input.hasAttribute('data-future-only')) {
            input.min = new Date().toISOString().split('T')[0];
        }
        
        // O'tmish sanalarini bloklash
        if (input.hasAttribute('data-past-only')) {
            input.max = new Date().toISOString().split('T')[0];
        }
    });
}

// API so'rovlari uchun helper
window.apiRequest = function(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP xatosi! Status: ${response.status}`);
            }
            return response.json();
        });
};

// Yuklanish indikatori
window.showLoading = function() {
    const loader = document.createElement('div');
    loader.className = 'global-loader';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
};

window.hideLoading = function() {
    const loader = document.querySelector('.global-loader');
    if (loader) {
        loader.remove();
    }
};

// Tashqi click uchun event listener
document.addEventListener('click', function(e) {
    // Dropdown menularni yopish
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    // Modal yopish (ESC tugmasi)
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                closeModal(modal.id);
            }
        });
    }
});

// Online/offline status
window.addEventListener('online', function() {
    showSuccess('Internet ulandi');
});

window.addEventListener('offline', function() {
    showError('Internet ulanmadi');
});

// Sayt yangilanishlari
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}