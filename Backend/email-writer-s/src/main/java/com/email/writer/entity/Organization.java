package com.email.writer.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Multi-tenant organization account entity.
 */
@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String domain;

    @Column(nullable = false)
    private String tier = "ENTERPRISE"; // FREE, PRO, ENTERPRISE

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Organization() {}

    public Organization(String name, String domain, String tier) {
        this.name = name;
        this.domain = domain;
        this.tier = tier;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public Instant getCreatedAt() { return createdAt; }
}
