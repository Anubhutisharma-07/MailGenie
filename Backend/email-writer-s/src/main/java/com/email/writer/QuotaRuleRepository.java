package com.email.writer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuotaRuleRepository extends JpaRepository<QuotaRule, Long> {
    Optional<QuotaRule> findByTierName(String tierName);
}
