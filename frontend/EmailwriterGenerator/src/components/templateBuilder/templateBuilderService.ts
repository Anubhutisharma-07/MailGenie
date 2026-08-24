import type {
  Template, TemplateVersion, ComponentLibraryItem, SavedStyle, ABTestConfig, TemplateAnalytics,
  TemplateBlock, BlockType,
} from './templateBuilderTypes';

// ============================================================================
// Helper to create blocks
// ============================================================================

function makeBlock(type: BlockType, props: Record<string, any> = {}, styles: Record<string, string> = {}): TemplateBlock {
  return { id: `blk-${Math.random().toString(36).slice(2, 9)}`, type, order: 0, properties: props, styles, visible: true };
}

// ============================================================================
// Templates
// ============================================================================

export const mockTemplates: Template[] = [
  {
    id: 'tpl-001', name: 'Summer Sale Campaign', description: 'High-impact promotional email with hero image, CTA, and social proof',
    category: 'marketing', status: 'published',
    blocks: [
      makeBlock('header', { text: '☀️ SUMMER SALE' }, { backgroundColor: '#1a1a2e', color: '#ffd700', fontSize: '28px', textAlign: 'center', padding: '40px 20px' }),
      makeBlock('image', { src: 'https://picsum.photos/600/300', alt: 'Summer Sale Banner', layout: 'full-width' }, { width: '100%' }),
      makeBlock('text', { text: 'Up to 50% off everything. Limited time only!' }, { fontSize: '18px', color: '#333', textAlign: 'center', padding: '20px 40px' }),
      makeBlock('button', { text: 'Shop Now →', url: 'https://shop.example.com', style: 'filled' }, { backgroundColor: '#ff6b35', color: '#fff', borderRadius: '8px', padding: '14px 40px', fontSize: '16px' }),
      makeBlock('divider', { color: '#eee', thickness: '1px' }, { margin: '30px 0' }),
      makeBlock('social', { platforms: ['twitter', 'instagram', 'facebook'] }, { textAlign: 'center', padding: '20px' }),
      makeBlock('footer', { text: 'Unsubscribe | View in browser' }, { fontSize: '12px', color: '#999', textAlign: 'center', padding: '20px' }),
    ],
    globalStyles: { backgroundColor: '#ffffff', fontFamily: 'Helvetica Neue, Arial', maxWidth: 600, textColor: '#333333', linkColor: '#ff6b35', preheaderText: 'Don\'t miss out — 50% off everything!' },
    subject: '☀️ 50% Off Everything — Today Only!', previewText: 'Don\'t miss out — 50% off everything!',
    tags: ['sale', 'promotional', 'high-impact'], createdAt: '2026-07-10T09:00:00Z', updatedAt: '2026-08-20T14:00:00Z',
    createdBy: 'marketing@company.com', usageCount: 3, avgOpenRate: 0.48, avgClickRate: 0.14, version: 5,
  },
  {
    id: 'tpl-002', name: 'Weekly Newsletter Template', description: 'Clean newsletter layout with header, 3 article blocks, and CTA',
    category: 'newsletter', status: 'published',
    blocks: [
      makeBlock('header', { text: '📬 Weekly Digest' }, { backgroundColor: '#0d1117', color: '#00e5ff', fontSize: '24px', textAlign: 'center', padding: '30px 20px' }),
      makeBlock('text', { text: 'Here\'s what happened this week in the world of email...' }, { fontSize: '16px', color: '#555', padding: '20px 40px' }),
      makeBlock('columns', { columns: 2, gap: '20px' }, { padding: '10px 40px' }),
      makeBlock('image', { src: 'https://picsum.photos/280/160', alt: 'Article 1', layout: 'full-width' }, { borderRadius: '8px' }),
      makeBlock('text', { text: 'Article 1 headline goes here with a brief summary.' }, { fontSize: '14px', color: '#333', padding: '10px 0' }),
      makeBlock('button', { text: 'Read More', url: '#', style: 'outlined' }, { borderColor: '#00e5ff', color: '#00e5ff', borderRadius: '6px', padding: '8px 24px' }),
      makeBlock('divider', { color: '#e0e0e0', thickness: '1px' }, { margin: '20px 0' }),
      makeBlock('footer', { text: '© 2026 MailGenie | Manage preferences' }, { fontSize: '11px', color: '#999', textAlign: 'center', padding: '20px' }),
    ],
    globalStyles: { backgroundColor: '#f8f9fa', fontFamily: 'Inter, sans-serif', maxWidth: 600, textColor: '#333333', linkColor: '#00e5ff', preheaderText: 'Your weekly digest is ready' },
    subject: '📬 This Week: AI Tips, New Features & More', previewText: 'Your weekly digest is ready',
    tags: ['newsletter', 'weekly', 'clean'], createdAt: '2026-06-15T10:00:00Z', updatedAt: '2026-08-18T11:00:00Z',
    createdBy: 'content@company.com', usageCount: 12, avgOpenRate: 0.42, avgClickRate: 0.11, version: 8,
  },
  {
    id: 'tpl-003', name: 'Welcome Onboarding', description: 'Multi-step onboarding email with checklist and getting started CTA',
    category: 'onboarding', status: 'published',
    blocks: [
      makeBlock('header', { text: '🎉 Welcome to MailGenie!' }, { backgroundColor: '#4caf50', color: '#fff', fontSize: '26px', textAlign: 'center', padding: '40px 20px' }),
      makeBlock('text', { text: 'We\'re thrilled to have you on board. Let\'s get you set up in 3 easy steps:' }, { fontSize: '16px', color: '#333', padding: '20px 40px' }),
      makeBlock('text', { text: '✅ Step 1: Complete your profile\n✅ Step 2: Create your first template\n✅ Step 3: Send a test email' }, { fontSize: '15px', color: '#555', padding: '10px 50px', lineHeight: '2' }),
      makeBlock('button', { text: 'Get Started →', url: 'https://app.example.com/onboarding', style: 'filled' }, { backgroundColor: '#4caf50', color: '#fff', borderRadius: '8px', padding: '14px 40px', fontSize: '16px' }),
      makeBlock('spacer', { height: '20px' }, {}),
      makeBlock('video', { url: 'https://youtube.com/watch?v=example', thumbnail: 'https://picsum.photos/560/315', title: 'Quick Start Guide' }, { borderRadius: '8px', padding: '0 40px' }),
      makeBlock('footer', { text: 'Need help? Reply to this email or visit our docs.' }, { fontSize: '12px', color: '#999', textAlign: 'center', padding: '20px' }),
    ],
    globalStyles: { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', maxWidth: 600, textColor: '#333333', linkColor: '#4caf50', preheaderText: 'Welcome aboard! Let\'s get started.' },
    subject: '🎉 Welcome to MailGenie — Let\'s Get Started!', previewText: 'Welcome aboard! Let\'s get started.',
    tags: ['onboarding', 'welcome', 'checklist'], createdAt: '2026-05-20T14:00:00Z', updatedAt: '2026-08-10T09:00:00Z',
    createdBy: 'product@company.com', usageCount: 8, avgOpenRate: 0.65, avgClickRate: 0.32, version: 4,
  },
  {
    id: 'tpl-004', name: 'Security Alert Template', description: 'Critical notification with urgent styling and action CTA',
    category: 'notification', status: 'published',
    blocks: [
      makeBlock('header', { text: '🔒 Security Alert' }, { backgroundColor: '#f44336', color: '#fff', fontSize: '22px', textAlign: 'center', padding: '25px 20px' }),
      makeBlock('text', { text: 'We detected a sign-in from a new device. If this was you, no action is needed.' }, { fontSize: '15px', color: '#333', padding: '20px 40px' }),
      makeBlock('text', { text: '📍 Location: San Francisco, CA\n🕐 Time: Aug 22, 2026 at 3:45 PM\n💻 Device: Chrome on macOS' }, { fontSize: '14px', color: '#555', padding: '10px 40px', fontFamily: 'monospace', lineHeight: '1.8' }),
      makeBlock('button', { text: 'Review Activity', url: 'https://account.example.com/security', style: 'filled' }, { backgroundColor: '#f44336', color: '#fff', borderRadius: '6px', padding: '12px 32px', fontSize: '15px' }),
      makeBlock('divider', { color: '#eee', thickness: '1px' }, { margin: '25px 0' }),
      makeBlock('footer', { text: 'If you didn\'t make this change, secure your account immediately.' }, { fontSize: '12px', color: '#999', textAlign: 'center', padding: '20px' }),
    ],
    globalStyles: { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', maxWidth: 580, textColor: '#333333', linkColor: '#f44336', preheaderText: 'New sign-in detected on your account' },
    subject: '🔒 Action Required: New Sign-in Detected', previewText: 'New sign-in detected on your account',
    tags: ['security', 'urgent', 'notification'], createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-08-01T12:00:00Z',
    createdBy: 'security@company.com', usageCount: 5, avgOpenRate: 0.88, avgClickRate: 0.72, version: 3,
  },
  {
    id: 'tpl-005', name: 'Cold Outreach — SaaS', description: 'Personalized cold email with pain points and social proof',
    category: 'cold-outreach', status: 'in-review',
    blocks: [
      makeBlock('text', { text: 'Hi {{first_name}},' }, { fontSize: '16px', color: '#333', padding: '20px 40px 5px' }),
      makeBlock('text', { text: 'I noticed {{company}} has been growing fast — congrats! But I bet your email team is drowning in manual work.' }, { fontSize: '15px', color: '#444', padding: '5px 40px' }),
      makeBlock('text', { text: 'MailGenie automates email drafting with AI, cutting compose time by 70%. Companies like Stripe and Shopify use us to send 10M+ emails/month.' }, { fontSize: '15px', color: '#444', padding: '10px 40px' }),
      makeBlock('button', { text: 'See a 2-min demo', url: 'https://demo.example.com', style: 'outlined' }, { borderColor: '#2196f3', color: '#2196f3', borderRadius: '6px', padding: '10px 28px', fontSize: '14px' }),
      makeBlock('text', { text: 'Best,\n{{sender_name}}' }, { fontSize: '14px', color: '#555', padding: '20px 40px 10px' }),
      makeBlock('footer', { text: 'Unsubscribe | Why am I receiving this?' }, { fontSize: '11px', color: '#aaa', textAlign: 'center', padding: '15px' }),
    ],
    globalStyles: { backgroundColor: '#ffffff', fontFamily: 'Calibri, sans-serif', maxWidth: 560, textColor: '#333333', linkColor: '#2196f3', preheaderText: '' },
    subject: 'Quick question about {{company}}\'s email workflow', previewText: '',
    tags: ['cold-outreach', 'personalized', 'saas'], createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-08-22T16:00:00Z',
    createdBy: 'sales@company.com', usageCount: 1, avgOpenRate: 0.32, avgClickRate: 0.08, version: 2,
  },
  {
    id: 'tpl-006', name: 'Feedback Request', description: 'NPS-style survey request with rating links',
    category: 'transactional', status: 'draft',
    blocks: [
      makeBlock('header', { text: '📊 How was your experience?' }, { backgroundColor: '#2196f3', color: '#fff', fontSize: '22px', textAlign: 'center', padding: '30px 20px' }),
      makeBlock('text', { text: 'We\'d love your feedback! It takes less than 2 minutes.' }, { fontSize: '16px', color: '#555', padding: '20px 40px', textAlign: 'center' }),
      makeBlock('columns', { columns: 5, gap: '8px' }, { padding: '10px 60px' }),
      makeBlock('button', { text: '😊', url: '#?score=5', style: 'rounded' }, { fontSize: '24px', backgroundColor: '#4caf50', padding: '10px' }),
      makeBlock('button', { text: '🙂', url: '#?score=4', style: 'rounded' }, { fontSize: '24px', backgroundColor: '#8bc34a', padding: '10px' }),
      makeBlock('button', { text: '😐', url: '#?score=3', style: 'rounded' }, { fontSize: '24px', backgroundColor: '#ff9800', padding: '10px' }),
      makeBlock('button', { text: '😕', url: '#?score=2', style: 'rounded' }, { fontSize: '24px', backgroundColor: '#ff5722', padding: '10px' }),
      makeBlock('button', { text: '😞', url: '#?score=1', style: 'rounded' }, { fontSize: '24px', backgroundColor: '#f44336', padding: '10px' }),
      makeBlock('footer', { text: 'Thank you for being a valued customer!' }, { fontSize: '12px', color: '#999', textAlign: 'center', padding: '20px' }),
    ],
    globalStyles: { backgroundColor: '#f5f5f5', fontFamily: 'Verdana, sans-serif', maxWidth: 580, textColor: '#333333', linkColor: '#2196f3', preheaderText: 'Rate your experience in 2 minutes' },
    subject: '📊 Quick Survey: How Did We Do?', previewText: 'Rate your experience in 2 minutes',
    tags: ['survey', 'nps', 'feedback'], createdAt: '2026-08-20T09:00:00Z', updatedAt: '2026-08-22T11:00:00Z',
    createdBy: 'cs@company.com', usageCount: 0, avgOpenRate: 0, avgClickRate: 0, version: 1,
  },
];

// ============================================================================
// Template Versions
// ============================================================================

export const mockVersions: TemplateVersion[] = [
  { id: 'ver-001', templateId: 'tpl-001', versionNumber: 5, name: 'Summer Sale Campaign', action: 'edited', blocksSnapshot: [], changedBy: 'marketing@company.com', changeNote: 'Updated CTA button color and added social icons', createdAt: '2026-08-20T14:00:00Z' },
  { id: 'ver-002', templateId: 'tpl-001', versionNumber: 4, name: 'Summer Sale Campaign', action: 'published', blocksSnapshot: [], changedBy: 'marketing@company.com', changeNote: 'Published for Q3 campaign', createdAt: '2026-07-10T09:00:00Z' },
  { id: 'ver-003', templateId: 'tpl-001', versionNumber: 3, name: 'Summer Sale Campaign', action: 'edited', blocksSnapshot: [], changedBy: 'design@company.com', changeNote: 'Added hero image and preheader text', createdAt: '2026-06-28T11:00:00Z' },
  { id: 'ver-004', templateId: 'tpl-002', versionNumber: 8, name: 'Weekly Newsletter Template', action: 'edited', blocksSnapshot: [], changedBy: 'content@company.com', changeNote: 'Added 2-column layout option', createdAt: '2026-08-18T11:00:00Z' },
  { id: 'ver-005', templateId: 'tpl-002', versionNumber: 7, name: 'Weekly Newsletter Template', action: 'published', blocksSnapshot: [], changedBy: 'content@company.com', changeNote: 'Updated newsletter header design', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'ver-006', templateId: 'tpl-003', versionNumber: 4, name: 'Welcome Onboarding', action: 'edited', blocksSnapshot: [], changedBy: 'product@company.com', changeNote: 'Added video embed block and checklist', createdAt: '2026-08-10T09:00:00Z' },
  { id: 'ver-007', templateId: 'tpl-005', versionNumber: 2, name: 'Cold Outreach — SaaS', action: 'created', blocksSnapshot: [], changedBy: 'sales@company.com', changeNote: 'Created cold outreach template with merge tags', createdAt: '2026-08-15T10:00:00Z' },
];

// ============================================================================
// Component Library
// ============================================================================

export const mockComponentLibrary: ComponentLibraryItem[] = [
  { id: 'cl-001', name: 'Hero Banner', category: 'header', description: 'Full-width hero with background image, gradient, or solid color', difficulty: 'beginner', previewHtml: '', block: makeBlock('header', { text: 'Hero Banner' }, { backgroundColor: '#1a1a2e', color: '#fff', padding: '60px 20px', fontSize: '32px', textAlign: 'center' }), tags: ['hero', 'banner', 'popular'], usageCount: 245, rating: 4.8 },
  { id: 'cl-002', name: 'Two-Column Layout', category: 'columns', description: 'Side-by-side content blocks for text + image combinations', difficulty: 'intermediate', previewHtml: '', block: makeBlock('columns', { columns: 2, gap: '20px' }, { padding: '20px' }), tags: ['layout', 'columns', 'grid'], usageCount: 189, rating: 4.6 },
  { id: 'cl-003', name: 'Social Proof Logos', category: 'image', description: 'Row of company logos to build credibility and trust', difficulty: 'beginner', previewHtml: '', block: makeBlock('image', { src: 'logos-strip.png', alt: 'Trusted by leading companies', layout: 'full-width' }, { opacity: '0.7', padding: '20px 40px' }), tags: ['social-proof', 'logos', 'trust'], usageCount: 167, rating: 4.5 },
  { id: 'cl-004', name: 'CTA Button (Primary)', category: 'button', description: 'Large, high-contrast call-to-action button with hover effect', difficulty: 'beginner', previewHtml: '', block: makeBlock('button', { text: 'Get Started Free →', url: '#', style: 'filled' }, { backgroundColor: '#00e5ff', color: '#000', borderRadius: '8px', padding: '16px 48px', fontSize: '17px', fontWeight: '700' }), tags: ['cta', 'button', 'popular'], usageCount: 312, rating: 4.9 },
  { id: 'cl-005', name: 'Countdown Timer', category: 'html', description: 'Animated countdown timer for urgency and scarcity', difficulty: 'advanced', previewHtml: '', block: makeBlock('html', { code: '<div class="countdown" data-end="2026-12-31T23:59:59Z"></div>' }, { textAlign: 'center', padding: '20px' }), tags: ['countdown', 'timer', 'urgency', 'advanced'], usageCount: 98, rating: 4.3 },
  { id: 'cl-006', name: 'Video Embed', category: 'video', description: 'Thumbnail with play button overlay — links to hosted video', difficulty: 'intermediate', previewHtml: '', block: makeBlock('video', { url: '#', thumbnail: 'https://picsum.photos/560/315', title: 'Watch our story' }, { borderRadius: '12px', padding: '0 40px' }), tags: ['video', 'media', 'engagement'], usageCount: 76, rating: 4.4 },
  { id: 'cl-007', name: 'Testimonial Card', category: 'text', description: 'Customer quote with avatar, name, and role', difficulty: 'beginner', previewHtml: '', block: makeBlock('text', { text: '"MailGenie saved our team 10 hours/week on email drafting."\n\n— Jane Smith, VP Marketing at Stripe' }, { fontSize: '15px', fontStyle: 'italic', color: '#555', padding: '30px 40px', borderLeft: '4px solid #00e5ff', backgroundColor: '#f8f9fa' }), tags: ['testimonial', 'social-proof', 'quote'], usageCount: 143, rating: 4.7 },
  { id: 'cl-008', name: 'Footer with Unsubscribe', category: 'footer', description: 'Compliant footer with unsubscribe, address, and preference links', difficulty: 'beginner', previewHtml: '', block: makeBlock('footer', { text: 'MailGenie Inc., 123 Email St, San Francisco, CA 94105\nUnsubscribe | Manage Preferences | View in Browser' }, { fontSize: '11px', color: '#999', textAlign: 'center', padding: '20px 40px', lineHeight: '1.8' }), tags: ['footer', 'compliance', 'required'], usageCount: 298, rating: 4.5 },
  { id: 'cl-009', name: 'Code Block', category: 'code', description: 'Monospace code snippet for developer-facing emails', difficulty: 'intermediate', previewHtml: '', block: makeBlock('code', { code: 'const app = new MailGenie({ apiKey: "mg_live_xxx" });\nawait app.send({ to: "user@example.com" });' }, { backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: 'Fira Code, monospace', fontSize: '13px', padding: '20px', borderRadius: '8px' }), tags: ['code', 'developer', 'monospace'], usageCount: 54, rating: 4.2 },
  { id: 'cl-010', name: 'NPS Rating Row', category: 'columns', description: 'Emoji-based 1–5 rating links for NPS/CSAT surveys', difficulty: 'intermediate', previewHtml: '', block: makeBlock('columns', { columns: 5, gap: '10px' }, { padding: '10px 40px', textAlign: 'center' }), tags: ['survey', 'nps', 'rating', 'interactive'], usageCount: 87, rating: 4.6 },
];

// ============================================================================
// Saved Styles
// ============================================================================

export const mockSavedStyles: SavedStyle[] = [
  { id: 'sty-001', name: 'Brand Primary', styles: { color: '#00e5ff', fontWeight: '700', fontFamily: 'Inter, sans-serif' }, appliedTo: ['header', 'button'], createdAt: '2026-06-01T10:00:00Z' },
  { id: 'sty-002', name: 'Body Text Standard', styles: { fontSize: '15px', color: '#444', lineHeight: '1.6', padding: '10px 40px' }, appliedTo: ['text'], createdAt: '2026-06-01T10:00:00Z' },
  { id: 'sty-003', name: 'Urgency Red', styles: { backgroundColor: '#f44336', color: '#fff', fontWeight: '700', borderRadius: '8px' }, appliedTo: ['button', 'header'], createdAt: '2026-07-15T14:00:00Z' },
  { id: 'sty-004', name: 'Subtle Divider', styles: { color: '#e0e0e0', thickness: '1px', margin: '25px 0' }, appliedTo: ['divider'], createdAt: '2026-06-10T09:00:00Z' },
];

// ============================================================================
// AB Tests
// ============================================================================

export const mockABTests: ABTestConfig[] = [
  { id: 'abt-001', templateId: 'tpl-001', variantAName: 'With Emoji Subject', variantBName: 'Plain Subject Line', testMetric: 'open_rate', splitPercentage: 50, status: 'completed', winner: 'A', startedAt: '2026-07-16T10:00:00Z', endedAt: '2026-07-18T10:00:00Z' },
  { id: 'abt-002', templateId: 'tpl-002', variantAName: 'Dark Header', variantBName: 'Light Header', testMetric: 'click_rate', splitPercentage: 50, status: 'completed', winner: 'A', startedAt: '2026-08-01T12:00:00Z', endedAt: '2026-08-03T12:00:00Z' },
  { id: 'abt-003', templateId: 'tpl-003', variantAName: 'Checklist Style', variantBName: 'Numbered Steps', testMetric: 'click_rate', splitPercentage: 50, status: 'running', winner: null, startedAt: '2026-08-22T09:00:00Z', endedAt: null },
];

// ============================================================================
// Template Analytics
// ============================================================================

export const mockTemplateAnalytics: TemplateAnalytics[] = [
  {
    templateId: 'tpl-004', templateName: 'Security Alert Template', totalSends: 3200, totalOpens: 2816, totalClicks: 2304,
    openRate: 0.88, clickRate: 0.72, unsubscribeRate: 0, bounceRate: 0.01,
    devicesBreakdown: { desktop: 0.35, mobile: 0.55, tablet: 0.10 },
    weeklyTrend: [
      { week: 'W30', opens: 420, clicks: 340 }, { week: 'W31', opens: 380, clicks: 310 },
      { week: 'W32', opens: 450, clicks: 370 }, { week: 'W33', opens: 390, clicks: 320 },
      { week: 'W34', opens: 410, clicks: 335 },
    ],
    topLinks: [{ url: 'account.example.com/security', clicks: 1840 }, { url: 'help.example.com', clicks: 230 }],
    lastUsedAt: '2026-08-18T06:01:00Z',
  },
  {
    templateId: 'tpl-003', templateName: 'Welcome Onboarding', totalSends: 8500, totalOpens: 5525, totalClicks: 2720,
    openRate: 0.65, clickRate: 0.32, unsubscribeRate: 0.002, bounceRate: 0.015,
    devicesBreakdown: { desktop: 0.40, mobile: 0.48, tablet: 0.12 },
    weeklyTrend: [
      { week: 'W30', opens: 680, clicks: 340 }, { week: 'W31', opens: 720, clicks: 360 },
      { week: 'W32', opens: 750, clicks: 380 }, { week: 'W33', opens: 700, clicks: 350 },
      { week: 'W34', opens: 740, clicks: 370 },
    ],
    topLinks: [{ url: 'app.example.com/onboarding', clicks: 2100 }, { url: 'docs.example.com', clicks: 420 }],
    lastUsedAt: '2026-08-22T10:00:00Z',
  },
  {
    templateId: 'tpl-001', templateName: 'Summer Sale Campaign', totalSends: 45200, totalOpens: 21696, totalClicks: 6328,
    openRate: 0.48, clickRate: 0.14, unsubscribeRate: 0.004, bounceRate: 0.024,
    devicesBreakdown: { desktop: 0.30, mobile: 0.54, tablet: 0.16 },
    weeklyTrend: [
      { week: 'W29', opens: 4200, clicks: 1200 }, { week: 'W30', opens: 8800, clicks: 2600 },
      { week: 'W31', opens: 5400, clicks: 1500 }, { week: 'W32', opens: 2100, clicks: 600 },
      { week: 'W33', opens: 800, clicks: 220 },
    ],
    topLinks: [{ url: 'shop.example.com/summer-sale', clicks: 4800 }, { url: 'shop.example.com/banners', clicks: 890 }],
    lastUsedAt: '2026-07-16T10:00:00Z',
  },
  {
    templateId: 'tpl-002', templateName: 'Weekly Newsletter Template', totalSends: 385200, totalOpens: 161784, totalClicks: 42372,
    openRate: 0.42, clickRate: 0.11, unsubscribeRate: 0.003, bounceRate: 0.018,
    devicesBreakdown: { desktop: 0.32, mobile: 0.52, tablet: 0.16 },
    weeklyTrend: [
      { week: 'W30', opens: 13400, clicks: 3500 }, { week: 'W31', opens: 13800, clicks: 3600 },
      { week: 'W32', opens: 14200, clicks: 3700 }, { week: 'W33', opens: 13600, clicks: 3550 },
      { week: 'W34', opens: 14000, clicks: 3650 },
    ],
    topLinks: [{ url: 'blog.example.com/latest', clicks: 28000 }, { url: 'docs.example.com/changelog', clicks: 8200 }],
    lastUsedAt: '2026-08-22T12:00:00Z',
  },
];

// ============================================================================
// Summary Stats
// ============================================================================

export const mockBuilderSummary = {
  totalTemplates: 6,
  publishedTemplates: 4,
  totalSends: 442100,
  avgOpenRate: 0.48,
  avgClickRate: 0.18,
  totalComponents: 10,
  avgRating: 4.55,
  recentActivity: [
    { action: 'edited', template: 'Cold Outreach — SaaS', user: 'sales@company.com', time: '2h ago' },
    { action: 'published', template: 'Feedback Request', user: 'cs@company.com', time: '5h ago' },
    { action: 'duplicated', template: 'Summer Sale Campaign', user: 'marketing@company.com', time: '1d ago' },
    { action: 'edited', template: 'Welcome Onboarding', user: 'product@company.com', time: '2d ago' },
  ],
};
