package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailLegalHoldComplianceService {

    private final Set<String> legalHoldSet = new HashSet<>();

    public void applyLegalHold(String emailId) {
        legalHoldSet.add(emailId);
    }

    public void releaseLegalHold(String emailId) {
        legalHoldSet.remove(emailId);
    }

    public boolean isUnderLegalHold(String emailId) {
        return legalHoldSet.contains(emailId);
    }
}
