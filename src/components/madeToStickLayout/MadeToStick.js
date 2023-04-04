import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import GridLayout from "react-grid-layout";
import { Resizable } from "react-resizable";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box, Button, Container } from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import { ErrorContext } from '../contexts/ErrorContext';
import { BACKEND_URL, API_URL } from "../../constants/apiUrl";
import Note from "./Note";
import "react-quill/dist/quill.snow.css";
import { SUCCESS_MESSAGE, ERROR_MESSAGE, NOTE_TYPES } from "../constants/MadeToStick";
import { USER_ROLES } from "../constants/users";

export default function MadeToStick() {
  const [isPO, setIsPO] = useState(false);
  const [cardDetails, setCardDetails] = useState([]);
  const [mobileCardDetails, setMobileCardDetails] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(windowWidth < 769);
  const [cards, setCards] = useState([]);
  const [layout, setLayout] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { user } = useContext(ProjectUserContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const { projectId } = useParams();

  const userId = user.memberId;

  const UserRole = USER_ROLES;
  const TABLET_WIDTH = 769;

  useEffect(() => {
    const getUserRole = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/management/project/${projectId}/member/${userId}`);
      if (res.data.role === UserRole.ADMIN || res.data.role === UserRole.LEADER) {
        setIsPO(true);
      }
    }
    getUserRole();
  }, []);

  const handleEditImgLink = (i) => {
    setIsEdit(i);
  };

  useEffect(() => {
    const getCards = async () => {
      const res = await axios.get(`${API_URL}/${projectId}`);
      setCardDetails(res.data);
      setMobileCardDetails(res.data);
    };
    getCards();
  }, []);

  useEffect(() => {
    if (windowWidth < TABLET_WIDTH) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCards(cardDetails);
    setLayout(cardDetails);
  }, [cardDetails]);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const handleResize = (i, newWidth, newHeight) => {
    setCards(
      cards.map((card) => {
        if (card.i === i) {
          return {
            ...card,
            width: Math.round(newWidth / 100),
            height: Math.round(newHeight / 100),
          };
        }
        return card;
      })
    );
    setLayout((prevLayout) => {
      const layoutItem = prevLayout.find((item) => item.i === i);
      const { x, y } = layoutItem;
      return [
        ...prevLayout.filter((item) => item.i !== i),
        {
          i,
          x,
          y,
          w: Math.round(newWidth / 100),
          h: Math.round(newHeight / 100),
        },
      ];
    });
  };

  useEffect(() => {
    setMobileCardDetails(cardDetails);
  }, [cardDetails]);

  useEffect(() => {
    const updatedCardDetails = cards.map((card, index) => {
      const { i, value, backgroundColor, name, emailId, type } = card;
      const { x, y, w, h } = layout[index];
      return { i, value, backgroundColor, name, x, y, w, h, emailId, type };
    });
    setMobileCardDetails(updatedCardDetails);
  }, [layout]);

  const editCard = async (i, value, backgroundColor, x, y, w, h, type, emailId) => {
    try {
      await axios.put(`${API_URL}/${projectId}/${i}`, {
        i, value, backgroundColor, x, y, w, h, type, emailId,
      });
      setSuccess(SUCCESS_MESSAGE.SAVED);
    } catch (error) {
      setError(ERROR_MESSAGE.SAVE_ERROR);
    }
  };

  const handleSave = () => {
    const updatedCardDetails = cards.map((card, index) => {
      const { i, value, backgroundColor, type, emailId } = card;
      const { x, y, w, h } = layout[index];
      return { i, value, backgroundColor, x, y, w, h, type, emailId };
    });

    setMobileCardDetails(updatedCardDetails);

    // eslint-disable-next-line array-callback-return
    updatedCardDetails.map((card) => {
      editCard(card.i, card.value, card.backgroundColor, card.x, card.y, card.w, card.h, card.type, card.emailId);
    });
  };

  const handleCardInputChange = (id, editor) => {
    const data = editor.getData();
    setCards((prevCards) => {
      const card = prevCards.find((item) => item.i === id);
      return [
        ...prevCards.filter((item) => item.i !== id),
        {
          ...card,
          value: data,
        },
      ];
    });
  };

  const handleImageInputChange = (e) => {
    const { value } = e.target;
    setCards((prevCards) => {
      const card = prevCards.find((item) => item.i === e.target.name);
      const { i } = card;
      return [
        ...prevCards.filter((item) => item.i !== e.target.name),
        { ...card, i, value },
      ];
    });
  };

  const addTextCard = async () => {
    try {
      const response = await axios.post(`${API_URL}/${projectId}`, {
        value: "Enter your text here",
        backgroundColor: "backgroundColor.secondary",
        x: 0,
        y: 0,
        w: 5,
        h: 3,
        type: NOTE_TYPES.TEXT,
        emailId: "test",
      });
      setCards([...cards, response.data]);
      setLayout([...layout, response.data]);
    } catch (err) {
      setError(ERROR_MESSAGE.ERROR);
    }
  };

  const handleDelete = async (i) => {
    try {
      await axios.delete(`${API_URL}/${projectId}/${i}`);
      setSuccess(SUCCESS_MESSAGE.DELETED);
    } catch (err) {
      setError(ERROR_MESSAGE.ERROR);
    }
    setCards(cards.filter((card) => card.i !== i));
    setLayout(layout.filter((item) => item.i !== i));
    setIsEdit(false);
  };

  const handleCloseButton = () => {
    handleSave();
    setIsEdit(false);
  };

  return (
    <Box sx={{ marginTop: '110px' }}>
      {(!isMobile) && (
        <Box sx={{ backgroundColor: 'backgroundColor.main', padding: '24px 0' }}>
          {
            (isPO) && (
              <Container maxWidth="xl" className="action-buttons">
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Box>
                    <Button
                      variant="contained" color='customButton1'
                      onClick={addTextCard}
                      name="add"
                      type="button"
                      sx={{ marginRight: '16px' }}
                    >
                      Add Card
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color='customButton1'
                      onClick={() => {
                        if (!isMobile) handleSave();
                      }}
                      name="save" type="button"
                    >
                      Save layout
                    </Button>
                  </Box>
                </Box>
              </Container>
            )
          }
          <Container maxWidth="xl">
            <Box
              sx={{
                backgroundColor: 'backgroundColor.main',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'stretch',
                flexGrow: 1,
                marginTop: '24px',
              }}
            >
              <GridLayout
                isDraggable={isPO}
                isResizable={isPO}
                className="layout"
                layout={layout}
                cols={(!isMobile) ? 16 : 3}
                rowHeight={100}
                width={windowWidth * 0.92}
                onLayoutChange={handleLayoutChange}
                sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}
              >
                {
                  cards && cards.map((card) => (
                    <Box
                      key={card.i}
                      sx={{ overflow: "scroll", borderRadius: "1.5%", boxShadow: 3, borderColor: card.backgroundColor, backgroundColor: 'secondaryButton.main' }}
                    >
                      <Resizable
                        onResize={(e, data) => {
                          handleResize(card.i, data.size.width, data.size.height, data);
                        }}
                      >
                        <Note
                          key={card.i}
                          id={card.i}
                          isPO={isPO}
                          userId={userId}
                          card={card}
                          isEdit={isEdit}
                          handleCloseButton={handleCloseButton}
                          handleEditImgLink={handleEditImgLink}
                          handleDelete={handleDelete}
                          handleCardInputChange={handleCardInputChange}
                          handleImageInputChange={handleImageInputChange}
                          handleSave={handleSave}
                        />
                      </Resizable>
                    </Box>
                  ))
                }
              </GridLayout>
            </Box>
          </Container>
        </Box>
      )}
      {isMobile && (
        <Box sx={{ backgroundColor: 'backgroundColor.main', padding: '24px 0', minHeight: '100vh' }}>
          <Box className="layout" layout={layout} cols={1} width={windowWidth * 0.95}
            sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", flexWrap: "wrap", alignItems: "center" }}
          >
            {mobileCardDetails &&
              mobileCardDetails.map((card) => (
                <Box
                  key={card.i}
                  sx={{ borderRadius: "1.5%", boxShadow: 3, borderColor: card.backgroundColor, marginBottom: "2%" }}
                >
                  <Box
                    className="card"
                    style={{
                      background:
                        card.type === NOTE_TYPES.IMAGE
                          ? `url(${card.value}) no-repeat center center/cover`
                          : card.backgroundColor, height: "250px", width: windowWidth * 0.91
                    }}
                  >
                    <Box className="card-text">
                      {card.type === NOTE_TYPES.TEXT && (
                        <CKEditor
                          disabled
                          editor={ClassicEditor}
                          onChange={(event, editor) => handleCardInputChange(card.i, editor)}
                          data={card.value}
                        />
                      )}
                      <style>{`.ck.ck-editor__main>.ck-editor__editable {background-color: #EEF2F5; border: transparent;}`}</style>
                      <style>{`.ck.ck-editor__top { display: none; }`}</style>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
