package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for EmailTemplate CRUD operations.
 */
@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
}
