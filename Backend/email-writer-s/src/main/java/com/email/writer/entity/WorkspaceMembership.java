package com.email.writer.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Membership association linking Users to Organizations with granular Roles.
 */
@Entity
@Table(name = "workspace_memberships")
public class WorkspaceMembership {

    public enum Role {
        OWNER, ADMIN, MEMBER, VIEWER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String organizationId;

    @Column(nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.MEMBER;

    @Column(nullable = false)
    private Instant joinedAt = Instant.now();

    public WorkspaceMembership() {}

    public WorkspaceMembership(String organizationId, String userId, Role role) {
        this.organizationId = organizationId;
        this.userId = userId;
        this.role = role;
    }

    public String getId() { return id; }
    public String getOrganizationId() { return organizationId; }
    public String getUserId() { return userId; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Instant getJoinedAt() { return joinedAt; }
}
