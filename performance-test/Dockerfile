FROM openjdk:11.0.13-jdk

WORKDIR /app
COPY target/performance-test.jar performance-test.jar

ENTRYPOINT ["java", "-jar", "./performance-test.jar"]