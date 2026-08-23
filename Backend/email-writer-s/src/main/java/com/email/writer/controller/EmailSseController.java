package com.email.writer.controller;

import com.email.writer.EmailRequest;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;

/**
 * Server-Sent Events (SSE) streaming controller providing unidirectional streaming fallback.
 */
@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailSseController {

    @PostMapping(value = "/stream/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamEmailReplySSE(@RequestBody EmailRequest request) {
        String sampleReply = "Thank you for reaching out. Based on your note regarding '" 
                + request.getEmailContent() 
                + "', I am pleased to confirm that we are proceeding as discussed.";

        String[] words = sampleReply.split(" ");

        return Flux.fromArray(words)
                .delayElements(Duration.ofMillis(100))
                .map(word -> ServerSentEvent.<String>builder()
                        .event("chunk")
                        .data(word + " ")
                        .build())
                .concatWith(Flux.just(ServerSentEvent.<String>builder()
                        .event("complete")
                        .data("[DONE]")
                        .build()));
    }
}
