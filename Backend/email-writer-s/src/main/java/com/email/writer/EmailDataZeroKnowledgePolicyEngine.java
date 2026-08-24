package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailDataZeroKnowledgePolicyEngine {

    public boolean validateZeroRetentionPolicy(boolean isPersistenceAllowed) {
        // Enforces zero-data-retention policy for enterprise security standard
        return !isPersistenceAllowed;
    }
}
