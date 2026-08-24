package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailJwtTokenAuthenticationValidator {

    public boolean validateJwtStructure(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7);
        String[] parts = token.split("\\.");
        return parts.length == 3;
    }
}
