package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailSignatureAutoGenerator {

    public String appendSignature(String body, String senderName, String senderTitle, String company) {
        if (body == null) body = "";
        StringBuilder sig = new StringBuilder(body);
        sig.append("\n\n--\n");
        if (senderName != null && !senderName.isEmpty()) sig.append(senderName).append("\n");
        if (senderTitle != null && !senderTitle.isEmpty()) sig.append(senderTitle).append(" | ");
        if (company != null && !company.isEmpty()) sig.append(company);
        return sig.toString().trim();
    }
}
