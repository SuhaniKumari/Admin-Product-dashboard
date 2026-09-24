'use client';

import React from 'react';
import {
  Button,
  ButtonProps,
  CircularProgress,
  Box,
} from '@mui/material';

export type AppButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost';

export interface AppButtonProps
  extends Omit<ButtonProps, 'variant' | 'color'> {
  /**
   * Custom button variant.
   * Default: primary
   */
  variant?: AppButtonVariant;

  /**
   * Shows loading spinner and disables the button.
   */
  loading?: boolean;

  /**
   * Text displayed while loading.
   * Defaults to button children.
   */
  loadingText?: string;
}

/* -------------------------------------------------------------------------- */
/* Colors                                                                     */
/* -------------------------------------------------------------------------- */

const COLORS = {
  primary500: '#00B4D8',
  primary600: '#0096C7',

  errorMain: '#E53935',
  errorDark: '#C62828',

  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',

  white: '#FFFFFF',
};

const GRADIENTS = {
  primary: 'linear-gradient(135deg, #0072FF 0%, #00C6FF 100%)',
};

/* -------------------------------------------------------------------------- */
/* Variant Styles                                                             */
/* -------------------------------------------------------------------------- */

const VARIANT_SX: Record<AppButtonVariant, object> = {
  primary: {
    background: GRADIENTS.primary,
    color: COLORS.white,
    boxShadow: '0 4px 15px rgba(0, 114, 255, 0.35)',

    '&:hover': {
      background: GRADIENTS.primary,
      opacity: 0.9,
      boxShadow: '0 6px 20px rgba(0, 114, 255, 0.45)',
    },

    '&.Mui-disabled': {
      background: COLORS.gray200,
      color: COLORS.gray400,
      boxShadow: 'none',
    },
  },

  secondary: {
    background: 'transparent',
    color: COLORS.primary500,
    border: `1.5px solid ${COLORS.primary500}`,
    boxShadow: 'none',

    '&:hover': {
      background: 'rgba(0, 188, 212, 0.06)',
      border: `1.5px solid ${COLORS.primary600}`,
      boxShadow: 'none',
    },

    '&.Mui-disabled': {
      borderColor: COLORS.gray200,
      color: COLORS.gray400,
    },
  },

  danger: {
    background: COLORS.errorMain,
    color: COLORS.white,
    boxShadow: '0 4px 14px rgba(229, 57, 53, 0.35)',

    '&:hover': {
      background: COLORS.errorDark,
      boxShadow: '0 6px 18px rgba(229, 57, 53, 0.45)',
    },

    '&.Mui-disabled': {
      background: COLORS.gray200,
      color: COLORS.gray400,
      boxShadow: 'none',
    },
  },

  ghost: {
    background: 'transparent',
    color: COLORS.gray500,
    boxShadow: 'none',

    '&:hover': {
      background: 'rgba(0, 0, 0, 0.04)',
      boxShadow: 'none',
    },

    '&.Mui-disabled': {
      color: COLORS.gray300,
    },
  },
};

/* -------------------------------------------------------------------------- */
/* MUI Variant Mapping                                                        */
/* -------------------------------------------------------------------------- */

const MUI_PROPS: Record<
  AppButtonVariant,
  {
    variant: ButtonProps['variant'];
    color: ButtonProps['color'];
  }
> = {
  primary: {
    variant: 'contained',
    color: 'primary',
  },

  secondary: {
    variant: 'outlined',
    color: 'primary',
  },

  danger: {
    variant: 'contained',
    color: 'error',
  },

  ghost: {
    variant: 'text',
    color: 'inherit',
  },
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const AppButton = React.forwardRef<
  HTMLButtonElement,
  AppButtonProps
>(
  (
    {
      variant = 'primary',
      loading = false,
      loadingText,
      disabled,
      children,
      sx,
      startIcon,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const {
      variant: muiVariant,
      color: muiColor,
    } = MUI_PROPS[variant];

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        disableElevation
        variant={muiVariant}
        color={muiColor}
        startIcon={loading ? undefined : startIcon}
        sx={[
          {
            height: 44,
            px: 3,
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            letterSpacing: '0.3px',
            textTransform: 'none',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          },

          VARIANT_SX[variant],

          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...rest}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <CircularProgress
              size={16}
              thickness={4}
              sx={{
                color:
                  variant === 'primary'
                    ? COLORS.gray400
                    : 'inherit',
              }}
            />

            <span>
              {loadingText ?? children}
            </span>
          </Box>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AppButton.displayName = 'AppButton';

export default AppButton;