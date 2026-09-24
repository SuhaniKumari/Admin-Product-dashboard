'use client';

/**
 * AppConfirmDialog.tsx
 *
 * Reusable confirmation dialog for any destructive or impactful action.
 * Sits above AppModal in the component hierarchy — it does NOT use AppModal
 * internally because confirm dialogs have a different visual grammar
 * (centred icon, no form fields, compact footers) that would fight AppModal's
 * scrollable-body + sticky-footer layout.
 *
 * ┌──────────────────────────────────┐
 * │  Gradient header    title   ✕   │
 * ├──────────────────────────────────┤
 * │                                  │
 * │   [ icon ]                       │
 * │   Heading                        │
 * │   Supporting description         │
 * │                                  │
 * │   ┌──────────────────────────┐   │  ← optional detail card
 * │   │  record name / summary   │   │
 * │   └──────────────────────────┘   │
 * │                                  │
 * ├──────────────────────────────────┤
 * │  [Cancel]        [Confirm CTA]   │
 * └──────────────────────────────────┘
 *
 * ─── Three ways to use ────────────────────────────────────────────────────────
 *
 * 1. Delete preset  (variant="delete")
 *    ─────────────────────────────────
 *    <AppConfirmDialog
 *      open={deleteOpen}
 *      onClose={() => setDeleteOpen(false)}
 *      onConfirm={() => deleteStudent(student.id)}
 *      variant="delete"
 *      recordName={`${student.firstName} ${student.lastName}`}
 *      loading={isDeleting}
 *    />
 *
 * 2. Edit / unsaved-changes preset  (variant="edit")
 *    ──────────────────────────────────────────────────
 *    <AppConfirmDialog
 *      open={editOpen}
 *      onClose={() => setEditOpen(false)}
 *      onConfirm={handleSubmit(onSubmit)}
 *      variant="edit"
 *      recordName="Aarav Sharma"
 *      loading={isUpdating}
 *    />
 *
 * 3. Fully custom  (variant="custom")
 *    ─────────────────────────────────
 *    <AppConfirmDialog
 *      open={open}
 *      onClose={onClose}
 *      onConfirm={onConfirm}
 *      variant="custom"
 *      title="Archive Session"
 *      description="Archiving this session will hide it from all active views. You can restore it later from Settings."
 *      confirmLabel="Archive"
 *      confirmColor="warning"
 *      icon={<ArchiveIcon />}
 *      recordName="2024-2025"
 *    />
 *
 * ─── Props reference ──────────────────────────────────────────────────────────
 *
 *  open           boolean                     — controls visibility
 *  onClose        () => void                  — cancel / backdrop / ✕
 *  onConfirm      () => void | Promise<void>  — primary confirm handler
 *  variant        'delete' | 'edit' | 'custom'
 *
 *  — preset overrides (all optional when variant ≠ 'custom') —
 *  recordName     string   — shown in the detail card ("Student: Aarav Sharma")
 *  recordLabel    string   — prefix in the detail card (default: "Record")
 *
 *  — custom variant props —
 *  title          string
 *  description    string
 *  confirmLabel   string
 *  cancelLabel    string
 *  confirmColor   'error' | 'warning' | 'primary' | 'success'
 *  icon           ReactNode
 *
 *  — shared —
 *  loading        boolean  — disables buttons, shows spinner on CTA
 *  disableClose   boolean  — prevent close while loading
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CloseOutlined as CloseIcon,
  DeleteOutlineOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  WarningAmberOutlined as WarningIcon,
  ErrorOutlineOutlined as ErrorIcon,
  HelpOutlineOutlined as HelpIcon,
} from '@mui/icons-material';

import AppButton from '../AppButton';
import { COLORS, GRADIENTS } from '@/src/components/colours'

// ─── Variant Config ───────────────────────────────────────────────────────────

type ConfirmColor = 'error' | 'warning' | 'primary' | 'success';

interface VariantConfig {
  headerTitle: string;
  heading: string;
  description: string;
  confirmLabel: string;
  confirmColor: ConfirmColor;
  icon: React.ReactNode;
  /** recordLabel prefix used in the detail card */
  recordLabel: string;
}

const ICON_SIZE = 28;

const VARIANT_CONFIGS: Record<'delete' | 'edit', VariantConfig> = {
  delete: {
    headerTitle: 'Confirm Delete',
    heading: 'Delete this record?',
    description:
      'This record will be permanently deleted. If you do not want to permanent delete it, mark the record as inactive',
    confirmLabel: 'Yes, Delete',
    confirmColor: 'error',
    icon: <DeleteIcon sx={{ fontSize: ICON_SIZE }} />,
    recordLabel: 'Record',
  },
  edit: {
    headerTitle: 'Confirm Changes',
    heading: 'Save these changes?',
    description:
      'You are about to update this record. Please review your changes before confirming.',
    confirmLabel: 'Yes, Save Changes',
    confirmColor: 'primary',
    icon: <EditIcon sx={{ fontSize: ICON_SIZE }} />,
    recordLabel: 'Editing',
  },
};

// Colour maps → MUI/design-system values
const COLOR_MAP: Record<
  ConfirmColor,
  { icon: string; iconBg: string; button: string; buttonHover: string; buttonShadow: string }
> = {
  error: {
    icon: COLORS.errorMain,
    iconBg: COLORS.errorLight,
    button: COLORS.errorMain,
    buttonHover: '#C62828',
    buttonShadow: 'rgba(229,57,53,0.30)',
  },
  warning: {
    icon: COLORS.warningMain,
    iconBg: COLORS.warningLight,
    button: COLORS.warningMain,
    buttonHover: '#E65100',
    buttonShadow: 'rgba(245,124,0,0.30)',
  },
  primary: {
    icon: COLORS.primary500,
    iconBg: 'rgba(0,188,212,0.12)',
    button: COLORS.primary500,
    buttonHover: COLORS.primary700,
    buttonShadow: 'rgba(0,188,212,0.30)',
  },
  success: {
    icon: COLORS.successMain,
    iconBg: COLORS.successLight,
    button: COLORS.successMain,
    buttonHover: '#1B5E20',
    buttonShadow: 'rgba(46,125,50,0.30)',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;

  /** Controls which preset is used. Use 'custom' to supply all copy manually. */
  variant: 'delete' | 'edit' | 'custom';

  // ── Preset context ──────────────────────────────────────────────────────────
  /** Shown in the tinted detail card (e.g. student name, class name) */
  recordName?: string;
  /** Prefix label in the detail card — default pulled from variant config */
  recordLabel?: string;

  // ── Custom variant overrides (required when variant='custom') ───────────────
  title?: string;
  heading?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: ConfirmColor;
  icon?: React.ReactNode;

  // ── Behaviour ───────────────────────────────────────────────────────────────
  loading?: boolean;
  disableClose?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AppConfirmDialog: React.FC<AppConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  variant,
  recordName,
  recordLabel: recordLabelProp,

  // Custom overrides
  title: titleProp,
  heading: headingProp,
  description: descriptionProp,
  confirmLabel: confirmLabelProp,
  cancelLabel = 'Cancel',
  confirmColor: confirmColorProp,
  icon: iconProp,

  loading = false,
  disableClose = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // ── Resolve copy from variant or custom props ────────────────────────────────
  const preset = variant !== 'custom' ? VARIANT_CONFIGS[variant] : null;

  const headerTitle = titleProp ?? preset?.headerTitle ?? 'Confirm Action';
  const heading     = headingProp ?? preset?.heading ?? 'Are you sure?';
  const description = descriptionProp ?? preset?.description ?? '';
  const confirmLabel = confirmLabelProp ?? preset?.confirmLabel ?? 'Confirm';
  const confirmColor: ConfirmColor = confirmColorProp ?? preset?.confirmColor ?? 'primary';
  const icon        = iconProp ?? preset?.icon ?? <HelpIcon sx={{ fontSize: ICON_SIZE }} />;
  const recordLabel = recordLabelProp ?? preset?.recordLabel ?? 'Record';

  const colors = COLOR_MAP[confirmColor];

  const handleClose = () => {
    if (loading || disableClose) return;
    onClose();
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      fullScreen={fullScreen}
      keepMounted={false}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: 0, sm: '16px' },
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        },
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0,0,0,0.50)',
        },
      }}
    >
      {/* ── Gradient Header ───────────────────────────────────────────────────── */}
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          background: GRADIENTS.primary,
          p: 0,
          '&.MuiDialogTitle-root': { p: 0 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2.5,
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: '#fff', fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}
          >
            {headerTitle}
          </Typography>

          <IconButton
            onClick={handleClose}
            disabled={loading || disableClose}
            size="small"
            aria-label="Close dialog"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              borderRadius: '8px',
              p: 0.75,
              flexShrink: 0,
              '&:hover': { background: 'rgba(255,255,255,0.15)' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.35)' },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <DialogContent
        id="confirm-dialog-description"
        sx={{ px: 3, pt: 3.5, pb: 2.5 }}
      >
        {/* Icon + heading */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
            mb: recordName ? 3 : 0,
          }}
        >
          {/* Coloured icon circle */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: colors.iconBg,
              border: `2px solid ${colors.icon}22`, // 13% opacity ring
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: colors.icon,
              mt:6,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: 17,
                color: COLORS.gray900,
                mb: 0.75,
                lineHeight: 1.3,
              }}
            >
              {heading}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: COLORS.gray500,
                fontSize: 14,
                lineHeight: 1.65,
                maxWidth: 320,
                mx: 'auto',
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>

        {/* ── Detail card — record name ────────────────────────────────────── */}
        {recordName && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.5,
              borderRadius: '10px',
              bgcolor: colors.iconBg,
              border: `1.5px solid ${colors.icon}33`, // 20% opacity border
            }}
          >
            {/* Small coloured dot */}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: colors.icon,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: colors.icon,
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                {recordLabel}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: COLORS.gray800,
                  mt: 0.25,
                }}
              >
                {recordName}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <Divider sx={{ borderColor: COLORS.gray100 }} />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1.5,
          justifyContent: 'center',
        }}
      >
        {/* Cancel */}
        <AppButton
          variant="ghost"
          onClick={handleClose}
          disabled={loading || disableClose}
          sx={{
            minWidth: 90,
            border: `1.5px solid ${COLORS.gray200}`,
            color: COLORS.gray600,
            '&:hover': {
              background: COLORS.gray50,
              borderColor: COLORS.gray300,
            },
          }}
        >
          {cancelLabel}
        </AppButton>

        {/* Confirm CTA */}
        <AppButton
          onClick={handleConfirm}
          disabled={loading}
          sx={{
            minWidth: 140,
            height: 42,
            background: loading
              ? COLORS.gray200
              // Delete / warning use solid colour; primary / success use gradient
              : confirmColor === 'primary'
              ? GRADIENTS.primary
              : confirmColor === 'success'
              ? `linear-gradient(135deg, ${colors.button}, ${colors.buttonHover})`
              : colors.button,
            color: loading ? COLORS.gray400 : '#fff',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: loading
              ? 'none'
              : `0 4px 14px ${colors.buttonShadow}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: loading ? COLORS.gray200 : colors.buttonHover,
              boxShadow: loading
                ? 'none'
                : `0 6px 18px ${colors.buttonShadow}`,
              opacity: confirmColor === 'primary' ? 0.9 : 1,
            },
            '&.Mui-disabled': {
              background: COLORS.gray200,
              color: COLORS.gray400,
              boxShadow: 'none',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <CircularProgress size={16} sx={{ color: COLORS.gray400 }} />
              <span>Processing…</span>
            </Box>
          ) : (
            confirmLabel
          )}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default AppConfirmDialog;