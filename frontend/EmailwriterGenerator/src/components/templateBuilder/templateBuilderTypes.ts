/**
 * Email Template Builder — Drag & Drop Builder with Live Preview
 * Type definitions for templates, components, blocks, versions, and analytics
 */

// ============================================================================
// Template Types
// ============================================================================

export type TemplateStatus = 'draft' | 'published' | 'archived' | 'in-review';
export type TemplateCategory = 'marketing' | 'transactional' | 'newsletter' | 'notification' | 'onboarding' | 'cold-outreach';
export type BlockType = 'header' | 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'columns' | 'social' | 'video' | 'code' | 'html' | 'footer';
export type ButtonStyle = 'filled' | 'outlined' | 'rounded' | 'ghost';
export type ImageLayout = 'full-width' | 'left' | 'right' | 'center' | 'background';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type DevicePreview = 'desktop' | 'mobile' | 'tablet';
export type ExportFormat = 'html' | 'mjml' | 'react-email' | 'plain-text';
export type VersionAction = 'created' | 'edited' | 'published' | 'archived' | 'duplicated';
export type ComponentDifficulty = 'beginner' | 'intermediate' | 'advanced';

// ============================================================================
// Core Interfaces
// ============================================================================

export interface TemplateBlock {
  id: string;
  type: BlockType;
  order: number;
  properties: Record<string, any>;
  styles: Record<string, string>;
  children?: TemplateBlock[];
  locked?: boolean;
  visible?: boolean;
  conditions?: BlockCondition[];
}

export interface BlockCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt';
  value: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  status: TemplateStatus;
  blocks: TemplateBlock[];
  globalStyles: {
    backgroundColor: string;
    fontFamily: string;
    maxWidth: number;
    textColor: string;
    linkColor: string;
    preheaderText: string;
  };
  subject: string;
  previewText: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
  avgOpenRate: number;
  avgClickRate: number;
  version: number;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  name: string;
  action: VersionAction;
  blocksSnapshot: TemplateBlock[];
  changedBy: string;
  changeNote: string;
  createdAt: string;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: BlockType;
  description: string;
  difficulty: ComponentDifficulty;
  previewHtml: string;
  block: TemplateBlock;
  tags: string[];
  usageCount: number;
  rating: number;
}

export interface SavedStyle {
  id: string;
  name: string;
  styles: Record<string, string>;
  appliedTo: BlockType[];
  createdAt: string;
}

export interface ABTestConfig {
  id: string;
  templateId: string;
  variantAName: string;
  variantBName: string;
  testMetric: 'open_rate' | 'click_rate' | 'conversion';
  splitPercentage: number;
  status: 'draft' | 'running' | 'completed';
  winner: 'A' | 'B' | null;
  startedAt: string | null;
  endedAt: string | null;
}

export interface TemplateAnalytics {
  templateId: string;
  templateName: string;
  totalSends: number;
  totalOpens: number;
  totalClicks: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  devicesBreakdown: { desktop: number; mobile: number; tablet: number };
  weeklyTrend: { week: string; opens: number; clicks: number }[];
  topLinks: { url: string; clicks: number }[];
  lastUsedAt: string;
}

// ============================================================================
// Helper Utilities
// ============================================================================

export const TEMPLATE_STATUS_COLORS: Record<TemplateStatus, string> = {
  draft: '#9e9e9e',
  published: '#4caf50',
  archived: '#607d8b',
  'in-review': '#ff9800',
};

export const TEMPLATE_CATEGORY_ICONS: Record<TemplateCategory, string> = {
  marketing: '📢',
  transactional: '🧾',
  newsletter: '📰',
  notification: '🔔',
  onboarding: '🎉',
  'cold-outreach': '🎯',
};

export const BLOCK_TYPE_ICONS: Record<BlockType, string> = {
  header: 'H', text: 'T', image: '🖼️', button: '🔘', divider: '—', spacer: '↕️',
  columns: '▥', social: '📱', video: '▶️', code: '</>', html: '⚡', footer: '📎',
};

export const DIFFICULTY_COLORS: Record<ComponentDifficulty, string> = {
  beginner: '#4caf50',
  intermediate: '#ff9800',
  advanced: '#f44336',
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}
