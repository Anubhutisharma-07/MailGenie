package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing ApiRequestMetric persistence.
 */
@Repository
public interface ApiRequestMetricRepository extends JpaRepository<ApiRequestMetric, Long> {
}
