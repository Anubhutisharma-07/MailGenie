package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserQuotaMetricRepository extends JpaRepository<UserQuotaMetric, Long> {
    Optional<UserQuotaMetric> findByUserId(String userId);
}
