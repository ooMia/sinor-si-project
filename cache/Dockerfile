FROM gradle:jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build

FROM bellsoft/liberica-openjre-alpine AS runner
RUN mkdir /app
COPY --from=build /home/gradle/src/build/libs/*.jar /app/spring-boot-application.jar
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom","-jar","/app/spring-boot-application.jar"]

#ENTRYPOINT ["java", "-jar", "/path/to/volume/yourapp.jar", "--spring.config.location=file:/path/to/volume/application.properties"]
#ARG JAR_FILE=build/libs/*-SNAPSHOT.jar
#COPY ${JAR_FILE} app.jar
#ENTRYPOINT [ \
#   "java", \
#   "-jar", \
#   "/app.jar" \
#]
