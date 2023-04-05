/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import NotificationDialog from "./NotificationDialog";

function NotificationCard(props) {
  const {
    title,
    desc,
    date,
    isChecked,
    targetId,
    targetType,
    notifId,
    id,
    setCount,
    count,
    notifs,
    setNotifs,
  } = props;
  const [isClosed, setIsClosed] = useState(false);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(isChecked);

  // const handleCheck = (e) => {
  //   e.stopPropagation();
  //   setChecked(!checked);

  // };
  function formatDate(dateValue) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    const hours = dateValue.getHours();
    const minutes = String(dateValue.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${period}`;
  }
  
  const handleClose = (e) => {
    e.stopPropagation();
    setIsClosed(true);
  };

  const handleCardClick = () => {
    if (!isClosed) {
      setOpen(true);
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          position: "relative",
          opacity: isClosed ? 0 : 1,
          transition: "opacity 0.5s ease-out",
          mb:2,
          borderRadius: 2.5,
          cursor: "pointer",
          backgroundColor: !checked ? "primary.light" : "white",
        }}
      >
        <CardContent>
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              opacity: isClosed ? 0 : 1,
              transition: "opacity 0.5s ease-out",
              visibility:"hidden"
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography color="primary.main" variant="h6" noWrap sx={{ mb: 1}}>
            {title}
          </Typography>
          <Typography variant="body1" noWrap sx={{ mb: 1 }}>
            {desc}
          </Typography>
          <Typography variant="caption" sx={{ mb: 1 }}>
            {formatDate(new Date(date))
            }
          </Typography>
          <IconButton sx={{visibility: !checked ? "visible" : "hidden"}}>
            <Brightness1Icon
              sx={{ color: "primary.main", visibility: !checked ? "visible" : "hidden"}}
            />
          </IconButton>
        </CardContent>
      </Card>
      <NotificationDialog
        open={open}
        setOpen={setOpen}
        targetId={targetId}
        targetType={targetType}
        setChecked={setChecked}
        checked={checked}
        notifId={notifId}
        id={id}
        setCount={setCount}
        count={count}
        notifs={notifs}
        setNotifs={setNotifs}
      />
    </>
  );
}

export default NotificationCard;