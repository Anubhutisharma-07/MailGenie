package com.email.writer.observability;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Custom Actuator health indicator verifying upstream AI provider endpoint readiness.
 */
@Component
public class HealthIndicatorConfig implements HealthIndicator {

    @Override
    public Health health() {
        boolean groqAvailable = checkUrlAvailability("https://api.groq.com/openai/v1/models");
        boolean geminiAvailable = checkUrlAvailability("https://generativelanguage.googleapis.com");

        if (groqAvailable && geminiAvailable) {
            return Health.up()
                    .withDetail("groqApi", "AVAILABLE")
                    .withDetail("geminiApi", "AVAILABLE")
                    .build();
        } else if (groqAvailable || geminiAvailable) {
            return Health.status("DEGRADED")
                    .withDetail("groqApi", groqAvailable ? "AVAILABLE" : "UNREACHABLE")
                    .withDetail("geminiApi", geminiAvailable ? "AVAILABLE" : "UNREACHABLE")
                    .build();
        } else {
            return Health.down()
                    .withDetail("groqApi", "UNREACHABLE")
                    .withDetail("geminiApi", "UNREACHABLE")
                    .build();
        }
    }

    private boolean checkUrlAvailability(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(2000);
            connection.setReadTimeout(2000);
            int code = connection.getResponseCode();
            return code > 0;
        } catch (Exception e) {
            return false;
        }
    }
}
