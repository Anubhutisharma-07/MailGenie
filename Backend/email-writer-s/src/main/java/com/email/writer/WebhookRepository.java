package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WebhookRepository extends JpaRepository<WebhookSubscription, Long> {
    List<WebhookSubscription> findByIsActiveTrue();

    List<WebhookSubscription> findByEventTypeAndIsActiveTrue(String eventType);
}
