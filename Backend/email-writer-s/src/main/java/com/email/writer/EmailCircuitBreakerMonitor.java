package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailCircuitBreakerMonitor {

    private String state = "CLOSED";
    private int consecutiveFailures = 0;

    public String registerCallResult(boolean isSuccess) {
        if (isSuccess) {
            consecutiveFailures = 0;
            state = "CLOSED";
        } else {
            consecutiveFailures++;
            if (consecutiveFailures >= 5) {
                state = "OPEN";
            }
        }
        return state;
    }

    public String getState() { return state; }
}
