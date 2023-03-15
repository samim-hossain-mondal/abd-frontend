import React,{ useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { DateRange } from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
import PropTypes from "prop-types";
import dateGetter from "../../../utilityFunctions/DateGetter";

import "react-datepicker/dist/react-datepicker.css";

export default function DateTimePicker({ defaultValue, label, onChange, disabled = false }) {
  const [date, setDate] = useState(defaultValue);
  return (
    <ReactDatePicker
      disabled={disabled}
      showTimeSelect
      onChange={(_date) => {
        setDate(_date);
        onChange(_date);
      }}
      customInput={
        <Box
          sx={{
            padding: "8px 0",
            paddingLeft: "42px",
            borderBottom: "1px solid #DBE3F1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{date ? dateGetter(date,true) : label}</Typography>

          <IconButton
            sx={{
              marginRight: "8px",
            }}
            onClick={() => { }}
          >
            <DateRange
              sx={{
                color: disabled ? "gray" : "#08A0F7",
              }}
            />
          </IconButton>
        </Box>
      }
    />
  );
}

DateTimePicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
};

DateTimePicker.defaultProps = {
  disabled: false,
  defaultValue: undefined,
};
