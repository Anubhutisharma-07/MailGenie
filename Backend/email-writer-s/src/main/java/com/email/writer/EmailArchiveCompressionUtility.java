package com.email.writer;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class EmailArchiveCompressionUtility {

    public String decompressContent(String compressedBase64) {
        if (compressedBase64 == null || compressedBase64.isEmpty()) return "";
        try {
            byte[] bytes = Base64.getDecoder().decode(compressedBase64);
            java.io.ByteArrayInputStream bais = new java.io.ByteArrayInputStream(bytes);
            java.util.zip.GZIPInputStream gzip = new java.util.zip.GZIPInputStream(bais);
            java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(gzip, java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder out = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                out.append(line);
            }
            return out.toString();
        } catch (Exception e) {
            return "";
        }
    }
}
