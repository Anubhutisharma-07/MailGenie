package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for EmailHistory CRUD operations.
 */
@Repository
public interface EmailHistoryRepository extends JpaRepository<EmailHistory, Long> {
}
