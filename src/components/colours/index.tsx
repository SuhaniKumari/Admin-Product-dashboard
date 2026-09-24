import { PaletteOptions } from '@mui/material/styles';

// ─── Brand Gradients (not part of MUI palette but exported for sx usage) ─────
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #01B8E0 0%, #0182FF 100%)',
  sidebar: 'linear-gradient(90deg, #01B8E0 0%, #0182FF 100%)',
  navbar: 'linear-gradient(135deg, #01B8E0 0%, #0182FF 100%)',
  cardDanger: '#E53935',
  cardSuccess: '#2E7D32',
  cardInfo: 'linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)',
  orange: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)", // orange
  pink: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)", // pink
  violet: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", // violet
  green: "linear-gradient(135deg, #10B981 0%, #047857 100%)", // green
  amber: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)", // amber
  red: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)", // red
  teal: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)", // teal
  purple: "linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)", // purple
} as const;

export const COLORS = {
  // Primary cyan
  primary50: '#E0F7FA',
  primary100: '#B2EBF2',
  primary200: '#80DEEA',
  primary300: '#4DD0E1',
  primary400: '#26C6DA',
  primary500: '#01B8E0',
  primary600: '#00ACC1',
  primary700: '#0097A7',
  primary800: '#00838F',
  primary900: '#006064',

  // Secondary cobalt
  secondary400: '#4D9FFF',
  secondary500: '#0182FF',
  secondary600: '#0057CC',
  secondary700: '#0040A8',

  // Sidebar
  sidebarBg: '#0D1B2A',
  sidebarText: '#94A3B8',
  sidebarTextActive: '#FFFFFF',
  sidebarHover: 'rgba(255,255,255,0.05)',

  // Neutrals
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#1A1A2E',

  // Status
  successLight: 'rgba(46,125,50,0.10)',
  successMain: '#2E7D32',
  warningLight: 'rgba(245,124,0,0.10)',
  warningMain: '#F57C00',
  errorLight: 'rgba(229,57,53,0.10)',
  errorMain: '#E53935',
  infoMain: '#1565C0',
  infoLight: '#e4f1ff',

  // Action Icons
  createIcon: '#2E7D32',
  viewIcon: '#4D9FFF',
  editIcon: '#F57C00',
  deleteIcon: '#E53935',

  // Action Icons bg
  createIconBg: '#2E7D32',
  viewIconBg: '#4da0ff80',
  editIconBg: '#f57b005d',
  deleteIconBg: '#e5383545',

  // calendar items 
  eventBg:"#BEE1EB",
  eventBorder:"#60b1c7",
  eventText:"#044253",
holidayBg:"#DCBEF0",
holidayBorder:"#a174bf",
holidayText:"#330552"

} as const;

// ─── Light Palette ─────────────────────────────────────────────────────────────
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: COLORS.primary500,
    dark: COLORS.primary700,
    light: COLORS.primary300,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: COLORS.secondary500,
    dark: COLORS.secondary700,
    light: COLORS.secondary400,
    contrastText: '#FFFFFF',
  },
  error: {
    main: COLORS.errorMain,
    light: COLORS.errorLight,
  },
  warning: {
    main: COLORS.warningMain,
    light: COLORS.warningLight,
  },
  success: {
    main: COLORS.successMain,
    light: COLORS.successLight,
  },
  info: {
    main: COLORS.infoMain,
  },
  background: {
    default: '#F4F6F9',
    paper: '#FFFFFF',
  },
  text: {
    primary: COLORS.gray900,
    secondary: COLORS.gray500,
    disabled: COLORS.gray400,
  },
  divider: COLORS.gray100,
};

// ─── Dark Palette (future) ─────────────────────────────────────────────────────
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: COLORS.primary400,
    dark: COLORS.primary600,
    light: COLORS.primary200,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: COLORS.secondary400,
    dark: COLORS.secondary600,
    light: '#80B3FF',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#0A0F1E',
    paper: '#111827',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    disabled: '#4B5563',
  },
  divider: 'rgba(255,255,255,0.08)',
};