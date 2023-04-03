
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import proptypes from "prop-types";

export default function BasicTooltip({content}) {
  return (
    <Tooltip title={content} sx={{marginLeft:'0',marginTop:'1%'}}>
      <IconButton sx={{marginLeft:'1%', padding:'0.25%', justifyContent:'none',width:'10px'}}>
        <InfoOutlinedIcon sx={{fontSize:'17px'}}/>
      </IconButton>
    </Tooltip>
  );
}
BasicTooltip.propTypes = {
    content: proptypes.string.isRequired,
};