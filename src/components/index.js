/**
 * ═══════════════════════════════════════════════════════════════════
 * UI COMPONENTS - Japanese Artisan Theme
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { theme, cssVariables } from '../styles/theme';
import { commonStyles } from '../styles/styled';

/**
 * ════ BUTTON COMPONENT ════
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyles = {
    ...commonStyles.button(),
    ...(variant === 'primary' ? commonStyles.buttonPrimary() : 
        variant === 'secondary' ? commonStyles.buttonSecondary() :
        variant === 'danger' ? commonStyles.buttonDanger() :
        commonStyles.buttonGhost()),
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '15px' : '13px',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={baseStyles}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * ════ INPUT COMPONENT ════
 */
export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const inputStyle = {
    ...commonStyles.input(),
    borderColor: error ? theme.colors.status.error : theme.colors.border.default,
  };

  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      {label && (
        <label style={commonStyles.label()}>
          {label}
          {required && <span style={{ color: theme.colors.status.error }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
        {...props}
      />
      {error && (
        <span style={{ 
          display: 'block',
          marginTop: theme.spacing.xs,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.status.error 
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

/**
 * ════ SELECT COMPONENT ════
 */
export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      {label && (
        <label style={commonStyles.label()}>
          {label}
          {required && <span style={{ color: theme.colors.status.error }}> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={commonStyles.select()}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * ════ CARD COMPONENT ════
 */
export const Card = ({ 
  children, 
  elevated = false,
  style = {},
  ...props 
}) => {
  const cardStyle = {
    ...commonStyles.card(),
    ...(elevated ? commonStyles.cardElevated() : {}),
    ...style,
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
};

/**
 * ════ CARD HEADER ════
 */
export const CardHeader = ({ 
  children, 
  title,
  action,
  style = {},
  ...props 
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      borderBottom: `1px solid ${theme.colors.border.light}`,
      ...style,
    }} {...props}>
      <h3 style={{ 
        margin: 0, 
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.text.primary,
      }}>
        {title || children}
      </h3>
      {action}
    </div>
  );
};

/**
 * ════ CARD BODY ════
 */
export const CardBody = ({ 
  children, 
  style = {},
  ...props 
}) => {
  return (
    <div style={{
      padding: theme.spacing.lg,
      ...style,
    }} {...props}>
      {children}
    </div>
  );
};

/**
 * ════ TABLE COMPONENT ════
 */
export const Table = ({ 
  children,
  columns = [],
  data = [],
  onRowClick,
  emptyMessage = 'No data available',
  style = {},
  ...props 
}) => {
  const tableStyle = {
    ...commonStyles.table(),
    ...style,
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx}
                style={{
                  ...commonStyles.tableHeader(),
                  width: col.width,
                  textAlign: col.align || 'left',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length}
                style={{
                  ...commonStyles.tableCell(),
                  textAlign: 'center',
                  color: theme.colors.text.muted,
                  padding: theme.spacing.xxxl,
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  ...commonStyles.tableRow(),
                  cursor: onRowClick ? 'pointer' : 'default',
                }}
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx}
                    style={{
                      ...commonStyles.tableCell(),
                      textAlign: col.align || 'left',
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/**
 * ════ BADGE COMPONENT ════
 */
export const Badge = ({ 
  children, 
  color = 'primary',
  variant = 'filled',
  style = {},
  ...props 
}) => {
  const badgeStyle = {
    ...commonStyles.badge(color),
    background: variant === 'filled' 
      ? `${color === 'error' ? theme.colors.status.error : 
         color === 'success' ? theme.colors.status.success : 
         color === 'warning' ? theme.colors.status.warning : 
         theme.colors.primary.main}20`
      : 'transparent',
    border: `1px solid ${color === 'error' ? theme.colors.status.error : 
                      color === 'success' ? theme.colors.status.success : 
                      color === 'warning' ? theme.colors.status.warning : 
                      theme.colors.primary.main}`,
    ...style,
  };

  return (
    <span style={badgeStyle} {...props}>
      {children}
    </span>
  );
};

/**
 * ════ MODAL COMPONENT ════
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  ...props
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: '400px',
    md: '560px',
    lg: '720px',
    xl: '900px',
  };

  return (
    <div style={commonStyles.modalOverlay()} onClick={onClose}>
      <div 
        style={{
          ...commonStyles.modal(),
          maxWidth: sizes[size],
        }} 
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div style={commonStyles.modalHeader()}>
          <h2 style={{ 
            margin: 0, 
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.colors.text.muted,
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={commonStyles.modalBody()}>
          {children}
        </div>
        {footer && (
          <div style={commonStyles.modalFooter()}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ════ BREADCRUMB COMPONENT ════
 */
export const Breadcrumb = ({ 
  items = [],
  style = {},
  ...props 
}) => {
  return (
    <nav style={{ ...commonStyles.breadcrumb(), ...style }} {...props}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span style={{ color: theme.colors.text.muted }}>›</span>}
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * ════ TOAST / NOTIFICATION ════
 */
export const Toast = ({
  message,
  type = 'info',
  onClose,
  duration = 3500,
  ...props
}) => {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div style={{
      ...commonStyles.toast(type),
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: theme.zIndex.tooltip,
      animation: 'slideIn 0.3s ease',
    }} {...props}>
      <span style={{ 
        fontSize: '18px',
        color: type === 'success' ? theme.colors.status.success :
               type === 'error' ? theme.colors.status.error :
               type === 'warning' ? theme.colors.status.warning :
               theme.colors.primary.main,
      }}>
        {icons[type]}
      </span>
      <span style={{ flex: 1, color: theme.colors.text.primary }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme.colors.text.muted,
            fontSize: '16px',
            padding: '4px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

/**
 * ════ FORM GROUP ════
 */
export const FormGroup = ({ 
  children, 
  label,
  error,
  required = false,
  style = {},
  ...props 
}) => {
  return (
    <div style={{ marginBottom: theme.spacing.lg, ...style }} {...props}>
      {label && (
        <label style={commonStyles.label()}>
          {label}
          {required && <span style={{ color: theme.colors.status.error }}> *</span>}
        </label>
      )}
      {children}
      {error && (
        <span style={{ 
          display: 'block',
          marginTop: theme.spacing.xs,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.status.error 
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

/**
 * ════ SPINNER ════
 */
export const Spinner = ({ 
  size = 'md',
  color = 'primary',
  style = {},
  ...props 
}) => {
  const sizes = { sm: '16px', md: '24px', lg: '32px' };
  const spinnerColor = color === 'primary' ? theme.colors.primary.main :
                       color === 'accent' ? theme.colors.accent.terracotta :
                       theme.colors.text.muted;

  return (
    <div style={{
      width: sizes[size],
      height: sizes[size],
      border: `2px solid ${spinnerColor}20`,
      borderTopColor: spinnerColor,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      ...style,
    }} {...props} />
  );
};

/**
 * ════ EXPORT CSS VARIABLES ════
 */
export const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: cssVariables + `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      font-family: ${theme.typography.fontFamily};
      background: ${theme.colors.background.default};
      color: ${theme.colors.text.primary};
    }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: ${theme.colors.background.default}; }
    ::-webkit-scrollbar-thumb { background: ${theme.colors.border.default}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${theme.colors.text.muted}; }
    ::selection { background: ${theme.colors.primary.main}; color: white; }
  ` }} />
);

export default {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardBody,
  Table,
  Badge,
  Modal,
  Breadcrumb,
  Toast,
  FormGroup,
  Spinner,
  GlobalStyles,
};
