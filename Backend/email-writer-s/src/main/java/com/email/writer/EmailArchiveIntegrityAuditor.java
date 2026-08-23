package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailArchiveIntegrityAuditor {

    public boolean verifyArchiveIntegrity(String expectedChecksum, String actualChecksum) {
        if (expectedChecksum == null || actualChecksum == null) return false;
        return expectedChecksum.equals(actualChecksum);
    }
}
