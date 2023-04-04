  /* eslint-disable react/prop-types */
  import React, { useState } from "react";
  import { Card, CardContent, IconButton, Typography,Button} from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import NotificationDialog from "./NotificationDialog";

  function NotificationCard(props) {
    const { title, desc, date, isChecked, targetId,targetType,notifId,id} = props;
    const [isClosed, setIsClosed] = useState(false);
    const [open, setOpen]=useState(false);
    const [checked,setChecked]=useState(isChecked);

    const handleCheck = (e) => {
      e.stopPropagation();
      setChecked(!checked);
      
    };

    const handleClose = (e) => {
      e.stopPropagation();
      setIsClosed(true);

    };

  const handleCardClick = () => {
    if (!isClosed) {
      console.log("clicked");
      console.log(targetType);
      setOpen(true);
      console.log('open',open);
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
          mb: 2,
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
            }}
            onClick={handleClose}
          >
            <CloseIcon /> 
          </IconButton>
          <Typography color="primary.main" variant="h6" noWrap sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" noWrap sx={{ mb: 1 }}>
            {desc}
          </Typography>
          <Typography variant="caption" sx={{ mb: 1 }}>
            {date} 
          </Typography>
          <Button sx={{}} variant={checked ? "contained" : "outlined"} onClick={handleCheck}>
           {
              checked ? "Marked as Read" : "Mark as Read"
           }
          </Button>
        </CardContent>
      </Card>
      <NotificationDialog open={open} setOpen={setOpen} targetId={targetId} targetType={targetType} setChecked={setChecked} checked={checked}  notifId={notifId} id={id}/>
      </>
    );
  }

  export default NotificationCard;
