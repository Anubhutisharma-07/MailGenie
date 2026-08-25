package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookDeliveryLogRepository extends JpaRepository<WebhookDeliveryLog, Long> {
    List<WebhookDeliveryLog> findAllByOrderByExecutedAtDesc();

    List<WebhookDeliveryLog> findBySubscriptionIdOrderByExecutedAtDesc(Long subscriptionId);
}
