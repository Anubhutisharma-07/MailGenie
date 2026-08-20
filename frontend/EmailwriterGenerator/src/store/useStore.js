import { create } from 'zustand';

const useStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    return { isDarkMode: newTheme };
  }),

  backendUrl: localStorage.getItem('mailgenie_backend_url') || 'http://localhost:8080',
  setBackendUrl: (url) => set(() => {
    localStorage.setItem('mailgenie_backend_url', url);
    return { backendUrl: url };
  }),

  backendOnline: false,
  setBackendOnline: (status) => set({ backendOnline: status }),

  customTemplates: JSON.parse(localStorage.getItem('mailgenie_custom_templates') || '[]'),
  setCustomTemplates: (templates) => set(() => {
    localStorage.setItem('mailgenie_custom_templates', JSON.stringify(templates));
    return { customTemplates: templates };
  }),

  toast: { open: false, message: '', severity: 'info' },
  showToast: (message, severity = 'info') => set({ toast: { open: true, message, severity } }),
  closeToast: () => set((state) => ({ toast: { ...state.toast, open: false } }))
}));

export default useStore;
