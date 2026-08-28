package com.email.writer.controller;

import com.email.writer.entity.FollowUpSequence;
import com.email.writer.scheduler.FollowUpSchedulerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller managing automated follow-up sequences.
 */
@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "*")
public class FollowUpCampaignController {

    private final FollowUpSchedulerService schedulerService;

    public FollowUpCampaignController(FollowUpSchedulerService schedulerService) {
        this.schedulerService = schedulerService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<FollowUpSequence> scheduleCampaign(@RequestBody Map<String, Object> request) {
        String recipient = (String) request.get("recipientEmail");
        String subject = (String) request.get("originalSubject");
        String body = (String) request.get("originalBody");
        int delayDays = ((Number) request.getOrDefault("delayDays", 3)).intValue();

        FollowUpSequence seq = schedulerService.scheduleSequence(recipient, subject, body, delayDays);
        return ResponseEntity.ok(seq);
    }

    @GetMapping("/active")
    public ResponseEntity<List<FollowUpSequence>> listActiveSequences() {
        return ResponseEntity.ok(schedulerService.getActiveSequences());
    }

    @DeleteMapping("/{sequenceId}")
    public ResponseEntity<Map<String, Boolean>> cancelSequence(@PathVariable String sequenceId) {
        boolean cancelled = schedulerService.cancelSequence(sequenceId);
        return ResponseEntity.ok(Map.of("cancelled", cancelled));
    }
}
