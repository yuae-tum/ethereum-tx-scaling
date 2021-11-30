FROM openjdk:11.0.13-jdk

WORKDIR /app
COPY target/tx-creation.jar tx-creation.jar

ENTRYPOINT ["java", "-jar", "./tx-creation.jar"]