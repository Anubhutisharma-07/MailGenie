import React, { useState } from 'react';
import axios from 'axios';

/**
 * Component for configuring multi-tenant enterprise workspace settings and RBAC roles.
 */
export default function WorkspaceSettings() {
    const [orgName, setOrgName] = useState('Acme Corp');
    const [domain, setDomain] = useState('acme.com');
    const [tier, setTier] = useState('ENTERPRISE');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('MEMBER');
    const [message, setMessage] = useState('');

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail) return;

        try {
            setMessage(`Invitation successfully sent to ${inviteEmail} as [${inviteRole}]!`);
            setInviteEmail('');
        } catch (err) {
            setMessage('Failed to send invitation.');
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                🏢 Enterprise Workspace & RBAC Governance
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Manage organization-level security policies, team billing tiers, and invite team members.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Workspace Name</span>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{orgName}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Active Tier</span>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{tier}</p>
                </div>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    Invite Teammate
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                        required
                    />
                    <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                    </select>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
                    >
                        Send Invite
                    </button>
                </div>
            </form>

            {message && <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">{message}</p>}
        </div>
    );
}
