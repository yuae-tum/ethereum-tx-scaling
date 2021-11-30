FROM openjdk:11.0.13-jdk

WORKDIR /app
COPY target/tx-requesting.jar tx-requesting.jar

ENTRYPOINT ["java", "-jar", "./tx-requesting.jar"]