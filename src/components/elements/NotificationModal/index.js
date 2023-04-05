/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { Box, Dialog, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { DOMAIN } from "../../../config";
import NotificationCard from "./NotificationCard";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";

function NotificationModal({ open, setOpenNotification }) {
  const { user, projectId } = useContext(ProjectUserContext);
  const [notifs, setNotifs] = useState([]);
  const [selectedButton, setSelectedButton] = useState("ALL");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [url, setUrl] = useState(

    `${DOMAIN}/${projectId}/notifications/${user?.memberId}`
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchMoreData = () => {
    if (!open) return;
    axios.get(url).then((response) => {
      console.log(response.data);
      const notifications = response.data.map((notif) => ({
        notificationId: notif.notificationId,
        memberId: notif.memberId,
        readStatus: notif.readStatus,
        title: notif.notifications.title,
        createdAt: notif.notifications.createdAt,
        targetId: notif.notifications.targetId,
        content: notif.notifications.content,
        targetType: notif.notifications.targetType,
        id: notif.id
      }));

      setPage(page + 1);
      // console.log('url',url);
      // console.log('page',page);
      // 
      setNotifs(notifications);
      //  console.log('notification',notifications);
      //   console.log('notifs',notifs);
    });
  };
  useEffect(() => {
    fetchMoreData();
  }, [user, open]);
  useEffect(() => {
    setUrl(
      `${DOMAIN}/api/notifications/${projectId}/${user?.memberId}`
    );
  }, [user]);

  useEffect(() => {
    fetchMoreData();
  }, [url, open]);

  const handleClose = (id) => {
    const updatedNotifs = notifs.filter((notif) => notif.id !== id);
    setNotifs(updatedNotifs);
  };
  const handleClickUnseen = () => {
    setUrl(
      `${DOMAIN}/api/notifications/${projectId}/${user.memberId}?readStatus=false`
    );
    setSelectedButton("UNSEEN");
  };
  const handleClickSeen = () => {
    setUrl(
      `${DOMAIN}/api/notifications/${projectId}/${user.memberId}?readStatus=true`
    );
    setSelectedButton("SEEN");
  };
  const handleClickAll = () => {
    setUrl(
      `${DOMAIN}/api/notifications/${projectId}/${user.memberId}`
    );
    setSelectedButton("ALL");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }} className="cont">
      <Dialog
        open={open}
        onClose={() => setOpenNotification(false)}
        PaperProps={{
          sx: {
            position: "absolute",
            right: -30,
            maxHeight: "100%",
            height: "100%",
            width: "30%",
            minWidth: "320px",
            background: "#F5F5F5",
            p: 2,
            overflowY: "scroll",
          },
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <Box display="flex" justifyContent="space-evenly" margin="2%">
          <Button
            variant={selectedButton === "ALL" ? "contained" : "outlined"}
            sx={{ width: "20%", borderRadius: "20px" }}
            onClick={handleClickAll}
          >
            All
          </Button>
          <Button
            variant={selectedButton === "UNSEEN" ? "contained" : "outlined"}
            sx={{ width: "20%", borderRadius: "20px" }}
            onClick={handleClickUnseen}
          >
            Unseen
          </Button>
          <Button
            variant={selectedButton === "SEEN" ? "contained" : "outlined"}
            sx={{ width: "20%", borderRadius: "20px" }}
            onClick={handleClickSeen}
          >
            Seen
          </Button>
        </Box>
        <Box id="scrollableDiv" sx={{ padding: "5%", height: '100vh', overflow: "auto" }}>
          {/* <InfiniteScroll
        dataLength={notifs.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<CircularProgress color="primary" />}
        scrollThreshold={0.9}
        scrollableTarget="scrollableDiv"
      > */}

          {notifs &&
            notifs.map((notif) => (
              <NotificationCard
                key={notif.notificationId}
                title={notif.title}
                desc={notif.content}
                id={notif.id}
                date={notif.createdAt}
                targetId={notif.targetId}
                targetType={notif.targetType}
                isChecked={notif.readStatus}
                onClose={() => handleClose(notif.notificationId)}
                onClick={() => { }}
              />
            ))}

          {/* </InfiniteScroll> */}
        </Box>
      </Dialog>
    </Box>
  );
}

export default NotificationModal;