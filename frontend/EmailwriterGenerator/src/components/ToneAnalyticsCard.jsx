import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Live feedback component showing real-time readability, formality, and PII warnings.
 */
export default function ToneAnalyticsCard({ text = '' }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!text.trim() || text.length < 10) {
            setAnalysis(null);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.post('/api/analysis/inspect', { content: text });
                setAnalysis(res.data);
            } catch (err) {
                console.error('Failed to run tone analysis', err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [text]);

    if (!analysis) return null;

    return (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
            <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-slate-800 dark:text-white">📊 Live Email Diagnostics</span>
                {analysis.piiCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">
                        ⚠️ {analysis.piiCount} PII Item(s) Masked
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded shadow-sm">
                    <span className="text-xs text-gray-500">Sentiment</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{analysis.sentiment.primarySentiment}</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-700 rounded shadow-sm">
                    <span className="text-xs text-gray-500">Formality</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{analysis.sentiment.formalityScore}%</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-700 rounded shadow-sm">
                    <span className="text-xs text-gray-500">Readability</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{analysis.readability.readingGradeLevel}</p>
                </div>
            </div>
        </div>
    );
}
