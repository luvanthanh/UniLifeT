
# Stage 1: Build ứng dụng bằng Maven và JDK 24
FROM maven:3.9-eclipse-temurin-24 AS build

WORKDIR /app

# Sao chép file cấu hình Maven
COPY pom.xml .

# Tải dependencies trước để tận dụng Docker cache
RUN mvn dependency:go-offline -B

# Sao chép mã nguồn
COPY src ./src

# Build file JAR, bỏ qua test ở bước đóng gói
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng bằng JRE 24
FROM eclipse-temurin:24-jre

WORKDIR /app

# Sao chép file JAR từ stage build
COPY --from=build /app/target/UniLifeT-0.0.1-SNAPSHOT.jar app.jar

# Cổng ứng dụng Spring Boot
EXPOSE 8080

# Khởi chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
