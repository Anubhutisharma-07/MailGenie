package com.email.writer;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EmailArchiveCompressionUtilityTest {

    @Test
    public void testDecompression() {
        EmailArchiveCompressionUtility util = new EmailArchiveCompressionUtility();
        assertNotNull(util.decompressContent(""));
    }
}
