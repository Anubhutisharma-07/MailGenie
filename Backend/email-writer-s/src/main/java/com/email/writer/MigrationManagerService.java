package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * Enterprise Service simulating database migrations and validation cycles.
 * Contains dense business logic for rolling back strategies and execution
 * planning.
 */
@Service
@RequiredArgsConstructor
public class MigrationManagerService {

    private final MigrationLogRepository repository;

    /**
     * Fetch all history sorted by newest first
     */
    public List<MigrationLog> getMigrationHistory() {
        return repository.findAllByOrderByInstalledOnDesc();
    }

    /**
     * Simulates the execution of a new database schema migration payload
     */
    @Transactional
    public MigrationLog executeMigration(String versionId, String description, String scriptName) {
        // Validation check to prevent dual execution
        if (repository.findByVersionId(versionId).isPresent()) {
            throw new IllegalArgumentException("Migration version " + versionId + " has already been applied.");
        }

        long startTime = System.currentTimeMillis();

        try {
            // Enterprise simulation: heavy execution delay representation
            Thread.sleep((long) (Math.random() * 800) + 200);

            // Assume random failure injection for realistic testing in 5% of cases
            if (Math.random() > 0.95) {
                throw new RuntimeException("Simulated syntax error in " + scriptName + " near line 42");
            }

            long duration = System.currentTimeMillis() - startTime;

            MigrationLog successLog = MigrationLog.builder()
                    .versionId(versionId)
                    .description(description)
                    .scriptName(scriptName)
                    .executionTimeMs(duration)
                    .status("SUCCESS")
                    .build();

            return repository.save(successLog);

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;

            MigrationLog errorLog = MigrationLog.builder()
                    .versionId(versionId)
                    .description(description)
                    .scriptName(scriptName)
                    .executionTimeMs(duration)
                    .status("ERROR")
                    .errorDetails(e.getMessage())
                    .installedBy("System_Rescue_Agent")
                    .build();

            return repository.save(errorLog);
        }
    }

    /**
     * Compute metadata and statistics regarding migration health
     */
    public Map<String, Object> getMigrationHealthStats() {
        List<MigrationLog> allLogs = repository.findAll();
        Map<String, Object> stats = new HashMap<>();

        long totalScripts = allLogs.size();
        long failedScripts = allLogs.stream().filter(l -> "ERROR".equals(l.getStatus())).count();
        long successScripts = totalScripts - failedScripts;

        double avgTime = allLogs.stream()
                .mapToLong(MigrationLog::getExecutionTimeMs)
                .average().orElse(0.0);

        stats.put("totalMigrations", totalScripts);
        stats.put("successfulMigrations", successScripts);
        stats.put("failedMigrations", failedScripts);
        stats.put("overallHealth",
                failedScripts == 0 && totalScripts > 0 ? "GREEN" : (failedScripts < 3 ? "YELLOW" : "RED"));
        stats.put("averageExecutionTime", Math.round(avgTime));

        return stats;
    }

    /**
     * Allows rolling back a failed script status (hard delete) to retry it
     */
    @Transactional
    public boolean rollbackFailedMigration(String versionId) {
        return repository.findByVersionId(versionId)
                .map(log -> {
                    if ("ERROR".equals(log.getStatus())) {
                        repository.delete(log);
                        return true;
                    }
                    throw new IllegalStateException("Cannot rollback a SUCCESSFUL migration in safe mode.");
                })
                .orElse(false);
    }
}
