# Use Azul Zulu OpenJDK 23
FROM azul/zulu-openjdk:23

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean

# Create a working directory
WORKDIR /app

# Copy Spring Boot JAR
COPY target/*.jar app.jar

# Copy Python scripts (adjust path as needed)
COPY Categservice/ ./scripts/

# Install Python dependencies if you have a requirements.txt
COPY Categservice/requirements.txt . 
# RUN pip3 install --no-cache-dir -r requirements.txt

# Expose Spring Boot port
EXPOSE 8087

# Start Spring Boot app (Java will be the main entrypoint)
ENTRYPOINT ["java", "-jar", "app.jar"]

