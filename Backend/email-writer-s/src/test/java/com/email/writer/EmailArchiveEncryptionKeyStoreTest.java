package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailArchiveEncryptionKeyStoreTest {

    @Test
    public void testKeyStore() {
        EmailArchiveEncryptionKeyStore store = new EmailArchiveEncryptionKeyStore();
        store.storeKey("ARC-001", "KEY-ABC");
        assertEquals("KEY-ABC", store.getKey("ARC-001"));
    }
}
