# 🏥 Xususiy Klinika Boshqaruv Tizimi

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

## 📋 Loyiha Haqida
Xususiy klinika uchun to'liq funksionallikdagi boshqaruv tizimi. Loyiha 4 turdagi foydalanuvchilar (Admin, Doktor, Qabulxona, Bemor) uchun maxsus interfeyslar va funksionallikni taqdim etadi.

### ✨ Asosiy Xususiyatlar
- 👥 **Foydalanuvchi Boshqaruvi** - 4 xil role bilan boshqaruv
- 🩺 **Doktor Panel** - bemorlarni ko'rikdan o'tkazish, tashxis qo'yish
- 📋 **Qabulxona** - bemorlarni ro'yxatga olish, navbat boshqarish
- 👤 **Bemor Kabineti** - shaxsiy kabinet, tibbiy yozuvlar
- 💰 **To'lov Tizimi** - xizmatlar uchun to'lov qabul qilish
- 📱 **SMS Xabarnomalar** - bildirishnomalar yuborish
- 📊 **Hisobotlar** - statistika va analitika
- 🛡️ **Xavfsizlik** - Spring Security bilan himoya

## 🏗️ Texnologiyalar
### Backend
- **Java 17** - asosiy dasturlash tili
- **Spring Boot 3.2.0** - framework
- **Spring Security** - autentifikatsiya va avtorizatsiya
- **Spring Data JPA** - ma'lumotlar bazasi boshqaruvi
- **MySQL 8.0** - asosiy ma'lumotlar bazasi
- **Redis** - session va cache boshqaruvi
- **JWT** - token-based autentifikatsiya

### Frontend
- **Thymeleaf** - server-side templating
- **HTML5/CSS3** - interfeys dizayni
- **JavaScript** - interaktivlik
- **Bootstrap** - responsive dizayn
- **Font Awesome** - ikonkalar

### Infrastructure
- **Docker** - containerizatsiya
- **Docker Compose** - multi-container boshqaruv
- **Nginx** - reverse proxy
- **Maven** - build va dependency boshqaruv

## 📁 Loyiha Strukturasi
xususiy-klinika/
├── 📁 src/
│ ├── 📁 main/
│ │ ├── 📁 java/com/klinika/
│ │ │ ├── 🚀 KlinikaApplication.java
│ │ │ ├── 🎮 controller/ # REST va MVC controllerlar
│ │ │ ├── 💼 service/ # Biznes logika
│ │ │ ├── 🗄️ repository/ # Data access layer
│ │ │ ├── 🏗️ entity/ # Database modellar
│ │ │ ├── ⚙️ config/ # Konfiguratsiya
│ │ │ └── 🛡️ security/ # Xavfsizlik
│ │ └── 📁 resources/
│ │ ├── ⚙️ application.properties
│ │ ├── 📁 static/ # CSS, JS, images
│ │ └── 📁 templates/ # HTML sahifalar
│ └── 📁 test/ # Unit testlar
├── 🐳 Dockerfile
├── 📄 docker-compose.yml
└── 📖 README.md

## 🚀 O'rnatish va Ishlatish
### Oldin Shartlar
- Java 17 yoki undan yuqori
- Maven 3.6+
- Docker va Docker Compose
- MySQL 8.0 (agar Docker ishlatilmasa)
### 1. Loyihani Yuklab Olish
```bash
git clone https://github.com/your-username/xususiy-klinika.git
cd xususiy-klinika

2. Environment Sozlamalari
.env faylini yaratish:
# Database
DB_ROOT_PASSWORD=your_root_password
DB_NAME=klinika_db
DB_USER=klinika_user
DB_PASSWORD=klinika_password
# Redis
REDIS_PASSWORD=redis_password
# Application
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your_jwt_secret_key
# SMS Service
SMS_API_KEY=your_sms_api_key
SMS_API_SECRET=your_sms_api_secret
# Payment
PAYMENT_MERCHANT_ID=your_merchant_id
PAYMENT_MERCHANT_KEY=your_merchant_key

3. Docker bilan Ishlatish (Tavsiya etiladi)
# Barcha servicelarni ishga tushirish
docker-compose up -d
# Faqat asosiy servicelarni ishga tushirish
docker-compose up -d mysql-db redis klinika-app

4. Manual O'rnatish
# Loyihani build qilish
mvn clean package -DskipTests
# Ma'lumotlar bazasini sozlash
mysql -u root -p < database/init.sql
# Ilovani ishga tushirish
java -jar target/xususiy-klinika-1.0.0.jar
🌐 Default Login Ma'lumotlari
Ilova ishga tushgandan so'ng quyidagi loginlar bilan kirishingiz mumkin:

👑 Admin Panel
URL: http://localhost:8080/admin/dashboard
Telefon: +998901234567
Parol: admin123

🩺 Doktor Panel
URL: http://localhost:8080/doktor/dashboard
Telefon: +998901234568
Parol: doktor123

📋 Qabulxona Panel
URL: http://localhost:8080/qabulxona/dashboard
Telefon: +998901234569
Parol: qabul123

👤 Bemor Panel
URL: http://localhost:8080/bemor/dashboard
Telefon: +998901234570
Parol: bemor123

🔧 Konfiguratsiya
Ma'lumotlar Bazasi
spring.datasource.url=jdbc:mysql://localhost:3306/klinika_db
spring.datasource.username=klinika_user
spring.datasource.password=klinika_password

Xavfsizlik
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

SMS Xizmati
sms.provider=playmobile
sms.url=https://api.playmobile.uz/send

🧪 Testlash
Unit Testlar
# Barcha testlarni ishga tushirish
mvn test
# Faqat service testlari
mvn test -Dtest=*ServiceTest
# Test coverage hisobot
mvn jacoco:report
Integration Testlar
# Docker bilan testlash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

📊 Monitoring va Logging
Health Check
URL: http://localhost:8081/actuator/health
Details: http://localhost:8081/actuator/info
Log Files
# Application logs
tail -f logs/application.log
# Docker logs
docker logs klinika-application -f

🗄️ Ma'lumotlar Bazasi Diagrammasi
users
├── id (PK)
├── ism
├── familiya
├── telefon
├── role
└── ...
bemorlar (inherits users)
├── qon_guruhi
├── ogirlik
├── boy
├── qandli_diabet
└── ...
doktorlar (inherits users)
├── mutaxassislik
├── ish_tajribasi
├── narx_per_konsultatsiya
└── ...
tashxislar
├── id (PK)
├── bemor_id (FK)
├── doktor_id (FK)
├── tashxis_nomi
└── ...
retseptlar
├── id (PK)
├── tashxis_id (FK)
├── dori_nomi
├── miqdori
└── ...

🔐 Xavfsizlik Xususiyatlari
Role-based Access Control - har bir role uchun maxsus huquqlar
JWT Authentication - stateless autentifikatsiya
Password Encryption - BCrypt password hashing
CSRF Protection - Cross-Site Request Forgery himoyasi
SQL Injection Prevention - JPA parametrli so'rovlar
XSS Protection - Thymeleaf automatic escaping

📈 Scaling va Performance
Caching Strategy
Redis - session va frequent data caching
Spring Cache - method-level caching
Database Indexing - performance optimization

Monitoring
Spring Actuator - application metrics
Docker Healthchecks - container monitorig
Custom Metrics - business metrics

🐛 Muammolarni Hal Qilish
Umumiy Muammolar
1.Database connection error
MySQL service tekshirish
Environment variables tekshirish
2.Port already in use
# Portni ozod qilish
sudo lsof -i :8080
kill -9 <PID>
3.Docker container not starting
# Loglarni ko'rish
docker logs klinika-application
# Container ni qayta ishga tushirish
docker-compose restart klinika-app

Log Files
Application logs: /app/logs/application.log
Docker logs: docker logs klinika-application
Database logs: docker logs klinika-mysql

🤝 Contributing
Repository ni fork qiling
Yangi branch yarating (git checkout -b feature/amazing-feature)
O'zgarishlarni commit qiling (git commit -m 'Add amazing feature')
Branch ga push qiling (git push origin feature/amazing-feature)
Pull Request yarating

📝 Lisensiya
Bu loyiha MIT lisenziyasi ostida tarqatilmoqda. Batafsil ma'lumot uchun LICENSE faylini ko'ring.

👨‍💻 Developerlar
Asosiy Developer - Ismingiz
Project Manager - [Manager Ismi]
QA Engineer - [QA Ismi]

📞 Aloqa
Agar savollaringiz bo'lsa, quyidagi manzillar orqali bog'lanishingiz mumkin:
Email: dev@assalom-klinika.uz
Telegram: @assalom_klinika
Website: https://assalom-klinika.uz

🙏 Minnatdorchilik
Spring Boot Team
MySQL Community
Docker Community
Bootstrap Team