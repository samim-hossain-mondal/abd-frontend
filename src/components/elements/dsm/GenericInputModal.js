import { Close as CloseIcon } from '@mui/icons-material';
import { Button, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RichTextArea from '../RichTextArea';

export default function GenericInputModal({
  onCloseButtonClick,

  title,

  defaultValue,

  children,

  primaryButtonText,
  onPrimaryButtonClick,

  secondaryButtonText,
  onSecondaryButtonClick,

  placeholder,
}) {
  const [content, setContent] = useState(defaultValue ?? '');

  return (
    <Box
      sx={{
        width: 'max(25vw, 340px)',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 30px 60px rgba(32, 56, 85, 0.15)',
        borderRadius: '8px',
        padding: '16px 24px 24px 24px',
        position: 'relative'
      }}
    >
      {/* Action Buttons */}
      {/* TODO: add editable buttons and actions as well */}
      <Box
        sx={{
          textAlign: 'right',
        }}
      >
        <IconButton onClick={() => onCloseButtonClick(content)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Title */}
      <Typography variant="h5">{title}</Typography>

      {/* TextField */}

      <RichTextArea
        sx={{
          width: '85%',
          margin: '5px 0',
          boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)',
        }}
        value={content}
        placeholder={placeholder}
        setContent={setContent}
        enableTag
      />

      {children}

      {/* Primary Button */}
      <Button
        sx={{
          margin: '16px 0',
          padding: '12px 0',
          width: '100%',
          borderRadius: '8px',
          color: 'customButton1.contrastText',
          backgroundColor: 'customButton1.main',
          '&:hover': {
            color: 'customButton1.contrastText',
            backgroundColor: 'customButton1.main',
          },
        }}
        onClick={() => onPrimaryButtonClick(content)}
      >
        {primaryButtonText}
      </Button>

      {secondaryButtonText && (
        <Button
          sx={{
            padding: '12px 0',
            width: '100%',
            borderRadius: '8px',
            color: 'secondaryButton.contrastText',
            backgroundColor: 'secondaryButton.main',
            '&:hover': {
              color: 'secondaryButton.contrastText',
              backgroundColor: 'secondaryButton.main',
            },
          }}
          onClick={() => onSecondaryButtonClick(content)}
        >
          {secondaryButtonText}
        </Button>
      )}
    </Box>
  );
}

GenericInputModal.propTypes = {
  onCloseButtonClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  onPrimaryButtonClick: PropTypes.func,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
};

GenericInputModal.defaultProps = {
  onPrimaryButtonClick: (content) => {
    console.log(content);
  },
  onSecondaryButtonClick: (content) => {
    console.log(content);
  },
  secondaryButtonText: undefined,
  children: undefined,
  placeholder: undefined,
  defaultValue: undefined,
};