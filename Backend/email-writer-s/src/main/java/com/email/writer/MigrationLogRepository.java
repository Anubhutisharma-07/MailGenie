package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * Spring Data JPA Repository for Enterprise DB Migration Logs
 */
@Repository
public interface MigrationLogRepository extends JpaRepository<MigrationLog, Long> {
    Optional<MigrationLog> findByVersionId(String versionId);

    List<MigrationLog> findAllByOrderByInstalledOnDesc();
}
