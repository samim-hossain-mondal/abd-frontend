/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { Box, Dialog, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Chip from "@mui/material/Chip";
import NotificationCard from "./NotificationCard";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";
import { DOMAIN } from "../../../config";

function NotificationModal({ open, setOpenNotification }) {
  const { user, projectId } = useContext(ProjectUserContext);
  const [notifs, setNotifs] = useState([]);
  const [selectedButton, setSelectedButton] = useState("UNSEEN");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [url, setUrl] = useState(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (user) {
      axios
        .get(
          `${DOMAIN}/api/notifications/${projectId}/${user?.memberId}?readStatus=false`
        )
        .then((response) => {
          setCount(response.data.length);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, page]);
  useEffect(() => {
    if (selectedButton === "ALL") {
      setUrl(
        `${DOMAIN}/api/notifications/${projectId}/${user?.memberId}?page=${page}&limit=10`
      );
    } else {
      setUrl(
        `${DOMAIN}/api/notifications/${projectId}/${
          user?.memberId
        }?page=${page}&limit=10&readStatus=${selectedButton === "SEEN"}`
      );
    }
  }, [user, page]);

  const fetchMoreData = () => {
    if (hasMore === false) {
      return;
    }
    if (!open) return;
    axios.get(url).then((response) => {
      const notifications = response.data.map((notif) => ({
        notificationId: notif.notificationId,
        memberId: notif.memberId,
        readStatus: notif.readStatus,
        title: notif.notifications.title,
        createdAt: notif.notifications.createdAt,
        targetId: notif.notifications.targetId,
        content: notif.notifications.content,
        targetType: notif.notifications.targetType,
        id: notif.id,
      }));
      if (page === 1) {
        setNotifs([]);
      }
      setPage(page + 1);
      setNotifs((prevNotifs) => [...prevNotifs, ...notifications]);
      if (notifications.length === 0) {
        setHasMore(false);
        return;
      }
      if (notifications.length < 10) {
        setHasMore(false);
      }
    });
  };
  // useEffect(() => {
  //   if (!open) return;
  //   axios.get(url).then((response) => {
  //     console.log(response.data);
  //     const notifications = response.data.map((notif) => ({
  //       notificationId: notif.notificationId,
  //       memberId: notif.memberId,
  //       readStatus: notif.readStatus,
  //       title: notif.notifications.title,
  //       createdAt: notif.notifications.createdAt,
  //       targetId: notif.notifications.targetId,
  //       content: notif.notifications.content,
  //       targetType: notif.notifications.targetType,
  //     }));

  //     setNotifs(notifications);
  //   });
  // }, [open, url]);need for future use
  useEffect(() => {
    fetchMoreData();
  }, [url, open]);
  useEffect(() => {
    if (notifs.length === 0) {
      if (selectedButton === "ALL") {
        setUrl(
          `${DOMAIN}/api/notifications/${projectId}/${user?.memberId}?page=${page}&limit=10`
        );
      } else if (selectedButton === "SEEN") {
        setUrl(
          `${DOMAIN}/api/notifications/${projectId}/${user?.memberId}?page=${page}&limit=10&readStatus=true`
        );
      } else {
        setUrl(
          `${DOMAIN}/api/notifications/${projectId}/${user?.memberId}?page=${page}&limit=10&readStatus=false`
        );
      }
    }
  }, [notifs]);
  const handleClose = (id) => {
    const updatedNotifs = notifs.filter((notif) => notif.id !== id);
    setNotifs(updatedNotifs);
  };
  const handleClickUnseen = () => {
    setPage(1);
    setSelectedButton("UNSEEN");
    setNotifs([]);
    setHasMore(true);
  };
  const handleClickSeen = () => {
    setHasMore(true);
    setSelectedButton("SEEN");
    setPage(1);
    setNotifs([]);
  };
  const handleClickAll = () => {
    setHasMore(true);
    setSelectedButton("ALL");
    setPage(1);
    setNotifs([]);
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
        <Box
          display="flex"
          margin="2%"
          marginBottom="0%"
          marginLeft="5%"
          alignContent="center"
          fontFamily="Roboto"
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <Typography
            variant="h8"
            sx={{ mb: 2, color: "grey", marginTop: "0.5%", marginLeft: "0.5%" }}
          >
            <Chip sx={{ height: "25px" }} label={`${count} unread`} />
          </Typography>
        </Box>
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
        <Box
          id="scrollableDiv"
          sx={{ padding: "5%", height: "100vh", overflow: "auto" }}
        >
          <InfiniteScroll
            dataLength={notifs.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            }
            scrollThreshold={0.9}
            scrollableTarget="scrollableDiv"
          >
            {notifs &&
              notifs.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  title={notif.title}
                  desc={notif.content}
                  id={notif.id}
                  date={notif.createdAt}
                  targetId={notif.targetId}
                  targetType={notif.targetType}
                  isChecked={notif.readStatus}
                  onClose={() => handleClose(notif.notificationId)}
                  onClick={() => {}}
                  count={count}
                  setCount={setCount}
                />
              ))}
          </InfiniteScroll>
        </Box>
      </Dialog>
    </Box>
  );
}
export default NotificationModal;