package com.email.writer;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class EmailMultiLanguageTranslationModelTest {

    @Test
    public void testSpanishGreetingTranslation() {
        EmailMultiLanguageTranslationModel model = new EmailMultiLanguageTranslationModel();
        Map<String, String> result = model.translateGreeting("ES", "Carlos");
        assertEquals("Hola Carlos,", result.get("greeting"));
    }
}
