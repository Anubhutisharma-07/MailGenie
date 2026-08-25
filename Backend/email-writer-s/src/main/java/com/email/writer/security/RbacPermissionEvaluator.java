package com.email.writer.security;

import com.email.writer.entity.WorkspaceMembership;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * RBAC Permission Evaluator validating multi-tenant workspace capabilities.
 */
@Component
public class RbacPermissionEvaluator {

    private final Map<String, WorkspaceMembership.Role> userOrgRoles = new ConcurrentHashMap<>();

    public void assignRole(String userId, String orgId, WorkspaceMembership.Role role) {
        userOrgRoles.put(userId + ":" + orgId, role);
    }

    public boolean hasPermission(String userId, String orgId, String permission) {
        WorkspaceMembership.Role role = userOrgRoles.getOrDefault(userId + ":" + orgId, WorkspaceMembership.Role.VIEWER);

        return switch (permission.toUpperCase()) {
            case "MANAGE_BILLING", "DELETE_WORKSPACE" -> role == WorkspaceMembership.Role.OWNER;
            case "INVITE_MEMBER", "PUBLISH_GLOBAL_TEMPLATE" -> role == WorkspaceMembership.Role.OWNER || role == WorkspaceMembership.Role.ADMIN;
            case "CREATE_TEMPLATE", "GENERATE_EMAIL" -> role != WorkspaceMembership.Role.VIEWER;
            case "VIEW_TEMPLATES" -> true;
            default -> false;
        };
    }
}
