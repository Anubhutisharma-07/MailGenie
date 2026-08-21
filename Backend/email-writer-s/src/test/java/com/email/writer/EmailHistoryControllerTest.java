package com.email.writer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests to verify the CRUD endpoints of EmailHistoryController.
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class EmailHistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmailHistoryRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void testCreateAndGetHistory() throws Exception {
        EmailHistory history = EmailHistory.builder()
                .originalContent("Hello there")
                .tone("friendly")
                .generatedReply("Hello! Nice to meet you.")
                .build();

        // Create
        mockMvc.perform(post("/api/history")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(history)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.originalContent").value("Hello there"))
                .andExpect(jsonPath("$.tone").value("friendly"))
                .andExpect(jsonPath("$.generatedReply").value("Hello! Nice to meet you."));

        // Get All
        mockMvc.perform(get("/api/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].originalContent").value("Hello there"));
    }

    @Test
    void testUpdateCommentAndDeleteMapping() throws Exception {
        EmailHistory history = EmailHistory.builder()
                .originalContent("Meeting tomorrow")
                .tone("professional")
                .generatedReply("Dear Team, looking forward to meeting you tomorrow.")
                .createdAt(LocalDateTime.now())
                .build();

        EmailHistory saved = repository.save(history);

        // Update Comment
        mockMvc.perform(put("/api/history/" + saved.getId() + "/comment")
                .contentType(MediaType.APPLICATION_JSON)
                .content("\"This is a great reply!\""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userComment").value("This is a great reply!"));

        // Delete
        mockMvc.perform(delete("/api/history/" + saved.getId()))
                .andExpect(status().isNoContent());

        // Get All should be empty
        mockMvc.perform(get("/api/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
