# Dockerfile - Xususiy Klinika Spring Boot Ilovasi

# Build bosqichi
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Ishlash katalogini o'rnatish
WORKDIR /app

# Dependencies fayllarini nusxalash
COPY pom.xml .
COPY src ./src

# Ilovani build qilish
RUN mvn clean package -DskipTests

# Run bosqichi
FROM eclipse-temurin:17-jre-alpine

# Metadata
LABEL maintainer="dev@assalom-klinika.uz"
LABEL version="1.0.0"
LABEL description="Xususiy Klinika Boshqaruv Tizimi"

# Security sozlamalari
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Tashkent /etc/localtime && \
    echo "Asia/Tashkent" > /etc/timezone

# Yangi user yaratish (security uchun)
RUN addgroup -S spring && adduser -S spring -G spring

# Spring Profil va boshqa environment o'zgaruvchilari
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
ENV SPRING_CONFIG_LOCATION=file:/app/config/
ENV SPRING_LOGGING_LEVEL=INFO

# Health check porti
ENV MANAGEMENT_SERVER_PORT=8081

# Katalog yaratish va user huquqlarini o'rnatish
RUN mkdir -p /app/config /app/logs /app/uploads && \
    chown -R spring:spring /app

# User ni o'zgartirish
USER spring

# Working directory
WORKDIR /app

# JAR faylini build bosqichidan nusxalash
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

# Portlarni ochish
EXPOSE 8080 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Entrypoint
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar"]