/**
 * ═══════════════════════════════════════════════════════════════════
 * STYLED COMPONENTS - Japanese Artisan Theme
 * ═══════════════════════════════════════════════════════════════════
 */

import { theme } from './theme';

// ════ Styled System - Lightweight CSS-in-JS ════
const createStyled = () => {
  const cache = new Map();
  
  return (componentName, styles) => {
    const cacheKey = `${componentName}-${JSON.stringify(styles)}`;
    
    if (!cache.has(cacheKey)) {
      const styleString = typeof styles === 'function' 
        ? styles(theme) 
        : Object.entries(styles).map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value};`;
          }).join(' ');
      
      cache.set(cacheKey, styleString);
    }
    
    return cache.get(cacheKey);
  };
};

// ════ Common Styles ════
export const commonStyles = {
  // ════ Buttons ════
  button: (variant = 'primary') => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.md};
    font-weight: ${theme.typography.fontWeight.medium};
    line-height: 1;
    border: none;
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    transition: all ${theme.transitions.normal};
    text-decoration: none;
    white-space: nowrap;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `,
  
  buttonPrimary: () => `
    background: linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%);
    color: ${theme.colors.primary.contrast};
    box-shadow: ${theme.shadows.sm};
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${theme.colors.primary.light} 0%, ${theme.colors.primary.main} 100%);
      box-shadow: ${theme.shadows.md};
    }
  `,
  
  buttonSecondary: () => `
    background: ${theme.colors.background.paper};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border.default};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.sidebar.hover};
      border-color: ${theme.colors.border.dark};
    }
  `,
  
  buttonDanger: () => `
    background: ${theme.colors.status.error};
    color: ${theme.colors.text.inverse};
    
    &:hover:not(:disabled) {
      background: #8B3336;
    }
  `,
  
  buttonGhost: () => `
    background: transparent;
    color: ${theme.colors.text.secondary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.sidebar.hover};
      color: ${theme.colors.text.primary};
    }
  `,
  
  // ════ Form Elements ════
  input: () => `
    width: 100%;
    height: 40px;
    padding: 0 ${theme.spacing.md};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.md};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.paper};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    transition: border-color ${theme.transitions.normal}, box-shadow ${theme.transitions.normal};
    
    &::placeholder {
      color: ${theme.colors.text.muted};
    }
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.main};
      box-shadow: 0 0 0 3px rgba(43, 76, 126, 0.1);
    }
    
    &:disabled {
      background: ${theme.colors.background.default};
      cursor: not-allowed;
    }
  `,
  
  select: () => `
    width: 100%;
    height: 40px;
    padding: 0 ${theme.spacing.md};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.md};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.paper};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    transition: border-color ${theme.transitions.normal};
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.main};
    }
  `,
  
  label: () => `
    display: block;
    margin-bottom: ${theme.spacing.xs};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.secondary};
  `,
  
  // ════ Cards ════
  card: () => `
    background: ${theme.colors.background.paper};
    border: 1px solid ${theme.colors.border.light};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};
  `,
  
  cardElevated: () => `
    background: ${theme.colors.background.elevated};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.lg};
  `,
  
  // ════ Tables ════
  table: () => `
    width: 100%;
    border-collapse: collapse;
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.md};
  `,
  
  tableHeader: () => `
    background: ${theme.colors.table.header};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
    text-align: left;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 2px solid ${theme.colors.border.default};
  `,
  
  tableCell: () => `
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.table.line};
    color: ${theme.colors.text.primary};
  `,
  
  tableRow: () => `
    transition: background-color ${theme.transitions.fast};
    
    &:hover {
      background: ${theme.colors.table.rowHover};
    }
    
    &:nth-child(even) {
      background: rgba(248, 245, 240, 0.5);
      
      &:hover {
        background: ${theme.colors.table.rowHover};
      }
    }
  `,
  
  // ════ Layout ════
  appShell: () => `
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-template-rows: 60px 1fr;
    min-height: 100vh;
    background: ${theme.colors.background.default};
  `,
  
  topBar: () => `
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 56px 1fr auto;
    align-items: center;
    background: linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%);
    color: ${theme.colors.text.inverse};
    box-shadow: ${theme.shadows.md};
    z-index: ${theme.zIndex.sticky};
  `,
  
  sidebar: () => `
    background: ${theme.colors.sidebar.background};
    border-right: 1px solid ${theme.colors.border.light};
    padding: ${theme.spacing.lg} 0;
  `,
  
  content: () => `
    padding: ${theme.spacing.xl};
    overflow-y: auto;
  `,
  
  // ════ Modals ════
  modalOverlay: () => `
    position: fixed;
    inset: 0;
    background: rgba(45, 41, 38, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${theme.zIndex.modal};
  `,
  
  modal: () => `
    background: ${theme.colors.background.paper};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.xl};
    max-width: 560px;
    width: 90%;
    max-height: 85vh;
    overflow: hidden;
  `,
  
  modalHeader: () => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    border-bottom: 1px solid ${theme.colors.border.light};
  `,
  
  modalBody: () => `
    padding: ${theme.spacing.xl};
    overflow-y: auto;
  `,
  
  modalFooter: () => `
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    border-top: 1px solid ${theme.colors.border.light};
  `,
  
  // ════ Badge ════
  badge: (color = 'primary') => `
    display: inline-flex;
    align-items: center;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    border-radius: ${theme.borderRadius.full};
    background: ${color === 'error' ? theme.colors.status.error : 
                 color === 'success' ? theme.colors.status.success : 
                 color === 'warning' ? theme.colors.status.warning : 
                 theme.colors.primary.main}20;
    color: ${color === 'error' ? theme.colors.status.error : 
            color === 'success' ? theme.colors.status.success : 
            color === 'warning' ? theme.colors.status.warning : 
            theme.colors.primary.main};
  `,
  
  // ════ Breadcrumb ════
  breadcrumb: () => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    margin-bottom: ${theme.spacing.lg};
    
    a {
      color: ${theme.colors.primary.main};
      text-decoration: none;
      transition: color ${theme.transitions.fast};
      
      &:hover {
        color: ${theme.colors.primary.dark};
        text-decoration: underline;
      }
    }
    
    span {
      color: ${theme.colors.text.primary};
    }
  `,
  
  // ════ Toast ════
  toast: (type = 'info') => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    background: ${theme.colors.background.paper};
    border-radius: ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.lg};
    border-left: 4px solid ${type === 'success' ? theme.colors.status.success : 
                            type === 'error' ? theme.colors.status.error : 
                            type === 'warning' ? theme.colors.status.warning : 
                            theme.colors.primary.main};
  `,
};

// ════ Export Theme for Direct Use ════
export { theme as default };
