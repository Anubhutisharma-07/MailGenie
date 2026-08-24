package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailMultiLanguageTranslationModel {

    private static final Map<String, String> GREETINGS = new HashMap<>();

    static {
        GREETINGS.put("ES", "Hola {{RecipientName}},");
        GREETINGS.put("FR", "Bonjour {{RecipientName}},");
        GREETINGS.put("DE", "Hallo {{RecipientName}},");
        GREETINGS.put("EN", "Hi {{RecipientName}},");
    }

    public Map<String, String> translateGreeting(String languageCode, String recipientName) {
        Map<String, String> res = new HashMap<>();
        String template = GREETINGS.getOrDefault(languageCode.toUpperCase(), GREETINGS.get("EN"));
        res.put("languageCode", languageCode.toUpperCase());
        res.put("greeting", template.replace("{{RecipientName}}", recipientName));
        return res;
    }
}
