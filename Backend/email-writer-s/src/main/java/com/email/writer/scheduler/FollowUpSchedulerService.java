package com.email.writer.scheduler;

import com.email.writer.entity.FollowUpSequence;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service managing background execution and automatic generation of scheduled follow-ups.
 */
@Service
public class FollowUpSchedulerService {

    private final Map<String, FollowUpSequence> sequenceStore = new ConcurrentHashMap<>();

    public FollowUpSequence scheduleSequence(String recipientEmail, String subject, String body, int delayDays) {
        Instant scheduledTime = Instant.now().plus(delayDays, ChronoUnit.DAYS);
        FollowUpSequence sequence = new FollowUpSequence(recipientEmail, subject, body, delayDays, scheduledTime);
        sequenceStore.put(sequence.getId() != null ? sequence.getId() : UUID.randomUUID().toString(), sequence);
        return sequence;
    }

    public boolean cancelSequence(String sequenceId) {
        FollowUpSequence seq = sequenceStore.get(sequenceId);
        if (seq != null) {
            seq.setStatus(FollowUpSequence.Status.CANCELLED);
            return true;
        }
        return false;
    }

    public List<FollowUpSequence> getActiveSequences() {
        return new ArrayList<>(sequenceStore.values());
    }

    @Scheduled(fixedRate = 60000)
    public void processDueSequences() {
        Instant now = Instant.now();
        for (FollowUpSequence seq : sequenceStore.values()) {
            if (seq.getStatus() == FollowUpSequence.Status.SCHEDULED && seq.getScheduledExecutionTime().isBefore(now)) {
                seq.setStatus(FollowUpSequence.Status.EXECUTING);
                // Trigger AI generation of follow-up reminder
                seq.setStatus(FollowUpSequence.Status.COMPLETED);
            }
        }
    }
}
