/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useContext, useState } from "react";
import { Box, Dialog, Typography, Stack, Chip } from "@mui/material";
import axios from "axios";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";
import {
  DSM_REQUEST_TYPES,
  TITLE,
  PRIMARY_BUTTON_TEXT,
  CHAR_COUNT,
} from "../../constants/dsm/Requests";
import { DOMAIN } from "../../../config";

import {
  CHAR_COUNT_CONTENT,
  CHAR_COUNT_TITLE,
  MODAL_PRIMARY_BUTTON_TEXT,
} from "../../constants/dsm/Announcements";

import GenericInputModal from "../dsm/GenericInputModal";

import CelebrationGenericModal from "../dsm/CelebrationGenericModal";
import AnnouncementInputModal from "../dsm/AnnouncementInputModal";

function NotificationDialog(props) {
  const handleClose = () => {
    props.setOpen(false);
    if (props.checked) return;
    axios
      .put(`${DOMAIN}/api/notifications/${props.id}`, {
        readStatus: true,
      })
      .then(() => {
        props.setChecked(!props.checked);
      });
  };
  const { user, projectId } = useContext(ProjectUserContext);
  const [newCelebration, setNewCelebration] = useState({
    content: "",
    type: "",
    anonymous: false,
    memberId: user.memberId,
    createdAt: "",
  });
  const [notif, setNotif] = useState();
  const [lock, setLock] = useState(true);

  const makeCalls = async () => {
    if (!props.open) return;
    if (props.checked === false) {
      const countValue = props.count;
      props.setCount(countValue - 1);
    }
    if (props.targetType === "TEAM_REQUEST") {

      axios
        .get(`${DOMAIN}/api/dsm/team-requests/${projectId}/${props.targetId}`)
        .then((response) => {
          const { data } = response;
          setNotif(data);
          const value = [...props.notifs];
          const index = value.findIndex((item) => item.teamRequestId === props.targetId);
          value[index].readStatus = true;
        })

    } else if (props.targetType === "CELEBRATION") {
      axios
        .get(`${DOMAIN}/api/dsm/celebrations/${projectId}/${props.targetId}`)
        .then((response) => {
          const { data } = response;
          setNotif(data);
          setNewCelebration({
            content: data.content,
            type: data.type,
            anonymous: data.isAnonymous,
            memberId: user.memberId,
            createdAt: data.createdAt,
          });
          const value = [...props.notifs];
          const index = value.findIndex((item) => item.celebrationId === props.targetId);
          value[index].readStatus = true;
          props.setNotifs(value);
        });
    } else if (props.targetType === "ANNOUNCEMENT") {
      axios
        .get(`${DOMAIN}/api/dsm/announcements/${projectId}/${props.targetId}`)
        .then((response) => {
          const { data } = response;
          setNotif(data);
          const value = [...props.notifs];
          const index = value.findIndex((item) => item.announcementId === props.targetId);
          value[index].readStatus = true;
        });

    }
  };

  useEffect(() => {
    makeCalls();
  }, [props.open]);

  return (
    <Box>
      {notif && props.targetType === "TEAM_REQUEST" && (
        <Dialog open={props.open} onClose={handleClose} sx={{ zIndex: "900" }}>
          <GenericInputModal
            title={TITLE}
            authorName={notif.author}
            date={notif.createdAt}
            onCloseButtonClick={handleClose}
            primaryButtonText={PRIMARY_BUTTON_TEXT.SAVE}
            defaultValue={notif.content}
            totalCharacters={CHAR_COUNT}
          >
            <Typography>Tags</Typography>
            <br />
            <Stack spacing={1} direction="row">
              <Chip
                label="Meeting"
                color={
                  notif.type === DSM_REQUEST_TYPES[0] ? "primary" : "default"
                }
              />
              <Chip
                label="Resource"
                color={
                  notif.type === DSM_REQUEST_TYPES[1] ? "primary" : "default"
                }
              />
            </Stack>
          </GenericInputModal>
        </Dialog>
      )}

      {notif && props.targetType === "CELEBRATION" && (
        <Dialog open={props.open} onClose={handleClose} sx={{ zIndex: "900" }}>
          <CelebrationGenericModal
            title="Type"
            inputTitle="Speak out loud"
            primaryButtonText="Update"
            onCloseButtonClick={handleClose}
            lock={lock}
            setLock={setLock}
            newCelebration={newCelebration}
            setNewCelebration={setNewCelebration}
          />
        </Dialog>
      )}

      {notif && props.targetType === "ANNOUNCEMENT" && (
        <Dialog open={props.open} onClose={handleClose}>
          <AnnouncementInputModal
            onCloseButtonClick={handleClose}
            primaryButtonText={MODAL_PRIMARY_BUTTON_TEXT}
            defaultValue={notif.content}
            authorized={notif.memberId === user.memberId}
            title={notif.title}
            totalCharactersTitle={CHAR_COUNT_TITLE}
            totalCharactersContent={CHAR_COUNT_CONTENT}
          />
        </Dialog>
      )}
    </Box>
  );
}

export default NotificationDialog;