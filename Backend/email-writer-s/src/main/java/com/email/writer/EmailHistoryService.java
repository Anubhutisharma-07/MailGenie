package com.email.writer;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class managing business logic and transactions for email generation history CRUD.
 */
@Service
@RequiredArgsConstructor
public class EmailHistoryService {

    private final EmailHistoryRepository repository;

    /**
     * Save a generated email record to database.
     */
    @Transactional
    public EmailHistory saveHistory(EmailHistory history) {
        return repository.save(history);
    }

    /**
     * Retrieve all email generation records sorted by creation date descending.
     */
    public List<EmailHistory> getAllHistory() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    /**
     * Retrieve a specific email record by ID.
     */
    public Optional<EmailHistory> getHistoryById(Long id) {
        return repository.findById(id);
    }

    /**
     * Update the user comment/note for a specific email history record.
     */
    @Transactional
    public Optional<EmailHistory> updateComment(Long id, String comment) {
        return repository.findById(id).map(history -> {
            history.setUserComment(comment);
            return repository.save(history);
        });
    }

    /**
     * Delete an email history record by ID.
     */
    @Transactional
    public boolean deleteHistory(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
