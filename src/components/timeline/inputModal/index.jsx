import { Close as CloseIcon } from "@mui/icons-material";
import { Button, IconButton, TextField, Typography, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import PropTypes from "prop-types";
import DateTimePicker from "../../elements/timeline/DateTimePicker/Index";


export default function GenericInputModal({
  onCloseButtonClick,
  defaultEventName,
  defaultStartDatetime,
  defaultEndDatetime,
  defaultIsRisk,
  defaultID,
  children,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  placeholder,
  isDisabled
}) {
  const [content, setContent] = useState(defaultEventName ?? "");
  const [isRisk, setIsRisk] = useState(defaultIsRisk ?? false);
  const [startDatetime, setStartDatetime] = useState(defaultStartDatetime ?? new Date());
  const [endDatetime, setEndDatetime] = useState(defaultEndDatetime ?? new Date());

  return (
    <Box
      sx={{
        width: "max(25vw, 340px)",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 30px 60px rgba(32, 56, 85, 0.15)",
        borderRadius: "8px",
        padding: "16px 24px 24px 24px",
        position: "relative"
      }}
    >
      <Box sx={{ textAlign: 'right' }}>
        <IconButton onClick={() => onCloseButtonClick(content)} sx={{ padding: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="h5">Event Notes</Typography>

      <TextField
        sx={{
          width: "100%",
          margin: "16px 0",
          boxShadow: "0px 5px 15px rgba(119, 132, 238, 0.3)",
        }}
        value={content}
        multiline
        rows={4}
        placeholder={placeholder}
        onChange={(e) => setContent(e.target.value)}
        disabled={isDisabled}
      />

      <Typography variant="h5">Duration</Typography>
      <DateTimePicker defaultValue={defaultStartDatetime} label="Start Date" disabled={isDisabled} onChange={setStartDatetime} />
      <DateTimePicker defaultValue={defaultEndDatetime} label="End Date" disabled={isDisabled} onChange={setEndDatetime}/>

      <FormGroup>
        <FormControlLabel 
          control={<Checkbox
            checked={isRisk}
            onChange={(e) => setIsRisk(e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
          />} 
          label="Its a risk (will impact overall capacity)" 
          disabled={isDisabled}/>
      </FormGroup>
      {children}

      {
        !isDisabled && (
          <Button
            sx={{
              margin: "16px 0",
              padding: "12px 0",
              width: "100%",
              borderRadius: "8px",
              color: "customButton1.contrastText",
              backgroundColor: "customButton1.main",
              "&:hover": {
                color: "customButton1.contrastText",
                backgroundColor: "customButton1.main",
              },
            }}
            onClick={() => onPrimaryButtonClick({content, startDatetime, endDatetime, isRisk, defaultID})}
          >
            {primaryButtonText}
          </Button>
        )
      }

      {secondaryButtonText && (
        <Button
          sx={{
            padding: "12px 0",
            width: "100%",
            borderRadius: "8px",
            color: "secondaryButton.contrastText",
            backgroundColor: "secondaryButton.main",
            "&:hover": {
              color: "secondaryButton.contrastText",
              backgroundColor: "secondaryButton.main",
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
  primaryButtonText: PropTypes.string.isRequired,
  onPrimaryButtonClick: PropTypes.func,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  defaultEventName: PropTypes.string,
  defaultStartDatetime: PropTypes.instanceOf(Date),
  defaultEndDatetime: PropTypes.instanceOf(Date),
  defaultIsRisk: PropTypes.bool,
  defaultID: PropTypes.number,
};

GenericInputModal.defaultProps = {
  onPrimaryButtonClick: () => { },
  onSecondaryButtonClick: () => { },
  secondaryButtonText: undefined,
  children: undefined,
  placeholder: undefined,
  isDisabled: undefined,
  defaultEventName: undefined,
  defaultStartDatetime: null,
  defaultEndDatetime: null,
  defaultIsRisk: false,
  defaultID: undefined,
};
