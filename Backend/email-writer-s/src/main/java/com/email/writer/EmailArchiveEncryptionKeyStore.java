package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailArchiveEncryptionKeyStore {

    private final Map<String, String> keyMap = new HashMap<>();

    public void storeKey(String archiveId, String encryptionKey) {
        keyMap.put(archiveId, encryptionKey);
    }

    public String getKey(String archiveId) {
        return keyMap.get(archiveId);
    }
}
