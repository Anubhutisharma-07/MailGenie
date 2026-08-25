import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Component for uploading and managing knowledge documents for RAG context enrichment.
 */
export default function KnowledgeBaseManager() {
    const [documents, setDocuments] = useState([]);
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Product Specs');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setStatus('Vectorizing and indexing document chunks...');

        try {
            const res = await axios.post('/api/rag/ingest', {
                content,
                category
            });

            setStatus(`Successfully indexed ${res.data.chunksIngested} chunks!`);
            setDocuments(prev => [...prev, { id: res.data.docId, category, text: content.slice(0, 80) + '...' }]);
            setContent('');
        } catch (err) {
            setStatus('Failed to ingest document.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📚 RAG Knowledge Base Manager
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Add company documentation, product FAQs, or custom tone guides. The AI email generator will automatically query and reference this knowledge when generating replies.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Category
                    </label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Document Content / Context Reference
                    </label>
                    <textarea
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste product descriptions, return policies, or background knowledge here..."
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                >
                    {loading ? 'Indexing Chunks...' : 'Upload & Vectorize'}
                </button>
            </form>

            {status && <p className="mt-3 text-sm text-indigo-500 font-medium">{status}</p>}
        </div>
    );
}
