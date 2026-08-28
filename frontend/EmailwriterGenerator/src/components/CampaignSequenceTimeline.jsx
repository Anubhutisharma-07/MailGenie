import React, { useState } from 'react';
import axios from 'axios';

/**
 * Component visualizing the multi-stage follow-up campaign schedule.
 */
export default function CampaignSequenceTimeline() {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [delayDays, setDelayDays] = useState(3);
    const [status, setStatus] = useState('');

    const handleSchedule = async (e) => {
        e.preventDefault();
        if (!recipient || !body) return;

        try {
            await axios.post('/api/campaigns/schedule', {
                recipientEmail: recipient,
                originalSubject: subject,
                originalBody: body,
                delayDays
            });
            setStatus(`Follow-up sequence queued for ${recipient} in ${delayDays} days!`);
            setRecipient('');
            setSubject('');
            setBody('');
        } catch (err) {
            setStatus('Failed to schedule sequence.');
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ⏱️ Automated Follow-Up Campaign Engine
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Schedule smart AI follow-ups automatically if the recipient does not reply within your chosen timeframe.
            </p>

            <form onSubmit={handleSchedule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="recipient@company.com"
                        className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                        required
                    />
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Subject Line"
                        className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                        required
                    />
                </div>

                <textarea
                    rows={3}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Original Email Body context..."
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                    required
                />

                <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        Follow-up after (days):
                    </label>
                    <select
                        value={delayDays}
                        onChange={(e) => setDelayDays(Number(e.target.value))}
                        className="px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                    >
                        <option value={2}>2 Days</option>
                        <option value={3}>3 Days</option>
                        <option value={5}>5 Days</option>
                        <option value={7}>7 Days</option>
                    </select>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
                    >
                        Schedule Sequence
                    </button>
                </div>
            </form>

            {status && <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">{status}</p>}
        </div>
    );
}
