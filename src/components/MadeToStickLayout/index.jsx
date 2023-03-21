/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import { Resizable } from "react-resizable";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TextareaAutosize } from "@mui/base";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import makeRequest from "../utilityFunctions/makeRequest";
import {
  BACKEND_URL,
  GET_MADE_TO_STICK_CARDS,
  POST_MADE_TO_STICK_CARDS,
  DELETE_MADE_TO_STICK_CARDS,
  PUT_MADE_TO_STICK_CARDS,
} from "../../constants/apiUrl";
import "react-quill/dist/quill.snow.css";

function MyGrid() {
  const [isPO] = useState(true);
  const [cardDetails, setCardDetails] = useState([]);
  const [mobileCardDetails, setMobileCardDetails] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(windowWidth < 841);
  // set isMobile state when window width changes
  useEffect(() => {
    if (windowWidth < 841) {
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
  const [cards, setCards] = useState([]);
  const [layout, setLayout] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    setCards(cardDetails);
    setLayout(cardDetails);
  }, [cardDetails]);
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };
  // handdle resize of card
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
  // set mobile card details
  useEffect(() => {
    setMobileCardDetails(cardDetails);
  }, [cardDetails]);
  // set mobile card details when layout changes
  useEffect(() => {
    const updatedCardDetails = cards.map((card, index) => {
      const { i, value, backgroundColor, name, emailId, type } = card;
      const { x, y, w, h } = layout[index];
      return {
        i,
        value,
        backgroundColor,
        name,
        x,
        y,
        w,
        h,
        emailId,
        type,
      };
    });
    setMobileCardDetails(updatedCardDetails);
  }, [layout]);
  // save card details in backend
  const handleSave = () => {
    const updatedCardDetails = cards.map((card, index) => {
      const { i, value, backgroundColor, name, emailId, type } = card;
      const { x, y, w, h } = layout[index];
      return {
        i,
        value,
        backgroundColor,
        name,
        x,
        y,
        w,
        h,
        emailId,
        type,
      };
    });
    setMobileCardDetails(updatedCardDetails);
    // eslint-disable-next-line array-callback-return
    updatedCardDetails.map((card) => {
      makeRequest(BACKEND_URL, PUT_MADE_TO_STICK_CARDS(card.i).url, "PUT", {
        data: {
          i: card.i,
          value: card.value,
          backgroundColor: card.backgroundColor,
          x: card.x,
          y: card.y,
          w: card.w,
          h: card.h,
          type: card.type,
          emailId: card.emailId,
        },
      });
    });
  };
  // handle change in card values
  const handleCardInputChange = (e) => {
    const { value } = e.target;
    setCards((prevCards) => {
      const card = prevCards.find((item) => item.i === e.target.name);
      const { i } = card;
      return [
        ...prevCards.filter((item) => item.i !== e.target.name),
        {
          ...card,
          i,
          value,
        },
      ];
    });
  };
  // function to add image card
  const addImageCard = () => {
    makeRequest(BACKEND_URL, POST_MADE_TO_STICK_CARDS.url, "POST", {
      data: {
        value: "Enter your image url here",
        backgroundColor: "white",
        x: 0,
        y: 0,
        w: 10,
        h: 5,
        type: "IMAGE",
        emailId: "test",
      },
    }).then((response) => {
      setCards([...cards, response]);
      setLayout([...layout, response]);
      setIsEdit(response.i);
    });
  };
  // font color map
  const colorFontMap = {
    "#F4DF4EFF": "black",
    "#ADEFD1FF": "#00203FFF",
    "#FEE715FF": "black",
    "#9CC3D5FF": "black",
    "#C7D3D4FF": "#603F83FF",
    "#EDC2D8FF": "black",
    "#8ABAD3FF": "black",
  };
  // function to add text card
  const addTextCard = () => {
    const colors = [
      "#F4DF4EFF",
      "#ADEFD1FF",
      "#FEE715FF",
      "#9CC3D5FF",
      "#EEA47FFF",
      "#EDC2D8FF",
      "#8ABAD3FF",
    ]; 
    makeRequest(BACKEND_URL, POST_MADE_TO_STICK_CARDS.url, "POST", {
      data: {
        value: "Enter your text here",
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        x: 0,
        y: 0,
        w: 5,
        h: 3,
        type: "TEXT",
        emailId: "test",
      },
    }).then((response) => {
      setCards([...cards, response]);
      setLayout([...layout, response]);
    });
  };
  const handleDelete = (i) => {
    makeRequest(BACKEND_URL, DELETE_MADE_TO_STICK_CARDS(i).url, "DELETE").then(
      () => {}
    );
    setCards(cards.filter((card) => card.i !== i));
    setLayout(layout.filter((item) => item.i !== i));
    setIsEdit(false);
  };
  useEffect(() => {
    makeRequest(BACKEND_URL, GET_MADE_TO_STICK_CARDS, "GET").then((data) => {
      setCardDetails(data);
      setMobileCardDetails(data);
    });
  }, []);

  return (
    <Box sx={{ backgroundColor:'#e6eef2',marginTop:'2%',paddingTop:'0.5%'}}>
      {isMobile === false && (
        <Box sx={{ marginLeft: "6.5%", marginTop: "1%" }}>
          <Box sx={{}}>
            <Button
              style={{ margin: "0 2% 1% 2%" }}
              variant="contained"
              onClick={() => {
                if (isMobile === false) handleSave();
              }}
              name="save"
              type="button"
            >
              Save layout
            </Button>
            <Button
              style={{ margin: "0 2% 1% 2%" }}
              variant="contained"
              onClick={addTextCard}
              name="add"
              type="button"
            >
              Add text card
            </Button>
            <Button
              style={{ margin: "0 2% 1% 2%" }}
              variant="contained"
              onClick={addImageCard}
              name="add"
              type="button"
            >
              Add Image card
            </Button>
          </Box>
          <Box sx={{height:'800px',overflow:'scroll'}}>
          <GridLayout
            isDraggable={isPO}
            isResizable={isPO}
            className="layout"

            layout={layout}
            cols={isMobile === false ? 16 : 3}
            rowHeight={100}
            width={windowWidth * 0.85}
            onLayoutChange={handleLayoutChange}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {cards &&
              cards.map((card) => (
                <Box
                  key={card.i}
                  sx={{
                    overflow: "scroll",
                    borderRadius: "1.5%",
                    boxShadow: 3,
                    borderColor: card.backgroundColor,
                  }}
                >
                  <Resizable
                    onResize={(e, data) => {
                      handleResize(
                        card.i,
                        data.size.width,
                        data.size.height,
                        data
                      );
                    }}
                  >
                    <Box
                      className="card"
                      sx={{
                        "&:hover": {
                          backgroundColor: "white",
                          opacity: 1,
                        },

                        "&:hover .edit-Value": {
                          opacity: 0.5,
                        },
                      }}
                      style={{
                        background:
                          card.type === "IMAGE"
                            ? `url(${card.value}) no-repeat center center/cover`
                            : card.backgroundColor,
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Box className="card-text">
                        <Box sx={{ display: "flex" }}>
                          {card.type === "IMAGE" && isEdit === card.i && (
                            <DeleteIcon
                              style={{
                                opacity: 0.5,
                                padding: "1%",
                                backgroundColor:
                                  card.type === "TEXT"
                                    ? card.backgroundColor
                                    : "white",
                                borderRadius: 50,
                                margin: "1%",
                              }}
                              onClick={() => {
                                handleDelete(card.i);
                              }}
                            />
                          )}
                          {card.type === "TEXT" && (
                            <DeleteIcon
                              style={{
                                color: colorFontMap[card.backgroundColor],
                                padding: "2%",
                                backgroundColor:
                                  card.type === "TEXT"
                                    ? card.backgroundColor
                                    : "white",
                                borderRadius: 50,
                                margin: "1%",
                                border:
                                  card.type === "IMAGE"
                                    ? "1px solid black"
                                    : "none",
                                borderColor: "black",
                              }}
                              onClick={() => {
                                handleDelete(card.i);
                              }}
                            />
                          )}
                          <Box
                            className="edit-Value"
                            sx={{
                              display: "flex",
                              opacity: 0,
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                          >
                            {card.type === "IMAGE" &&
                              isEdit === false &&
                              card.value.length !== 0 &&
                              card.value !== "Enter your image url here" && (
                                <Box
                                  style={{
                                    fontFamily: "Roboto",
                                    padding: "2%",
                                    margin: "25%",
                                    backgroundColor: "white",
                                    borderRadius: 70,
                                    paddingLeft: "12%",
                                    paddingRight: "12%",
                                  }}
                                >
                                  <Edit
                                    style={{ padding: "5%" }}
                                    backgroundColor={card.backgroundColor}
                                    onClick={() => {
                                      setIsEdit(card.i);
                                    }}
                                  />
                                </Box>
                              )}
                            {card.type === "IMAGE" &&
                              (card.value.length === 0 ||
                                card.value === "Enter your image url here") &&
                              isEdit === false && (
                                <Box
                                  sx={{
                                    width: "150px",
                                    paddingBottom: "5%",
                                    paddingLeft: "3%",
                                  }}
                                  onClick={() => {
                                    setIsEdit(card.i);
                                  }}
                                  style={{
                                    fontFamily: "Roboto",
                                    paddingTop: "1%",
                                    paddingRight: "2%",
                                    paddingLeft: "2%",
                                    margin: "1%",
                                    backgroundColor: "white",
                                    borderRadius: 50,
                                    border: "1px solid black",
                                    borderColor: "black",
                                  }}
                                >
                                  <Edit />
                                  Edit Image Link
                                </Box>
                              )}
                          </Box>
                          <Box>
                            {card.type === "IMAGE" && isEdit === card.i && (
                              <CloseIcon
                                style={{
                                  opacity: 0.5,
                                  padding: "12%",
                                  backgroundColor:
                                    card.type === "TEXT"
                                      ? card.backgroundColor
                                      : "white",
                                  borderRadius: 50,
                                  margin: "1%",
                                  marginTop: "42%",
                                }}
                                onClick={() => {
                                  setIsEdit(false);
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            height: "auto",
                            width: "auto",
                            display: "flex",
                            flexwrap: "wrap",
                            overflow: "scroll",
                          }}
                        >
                          {card.type === "TEXT" && (
                            <TextareaAutosize
                              style={{
                                width: "1000px",
                                fontFamily: "Roboto",
                                backgroundColor: card.backgroundColor,
                                color: colorFontMap[card.backgroundColor],
                                fontSize: "x-large",
                                border: "none",
                                padding: "0 3% 0% 3%",
                              }}
                              value={card.value}
                              name={card.i}
                              i={card.i}
                              onChange={handleCardInputChange}
                            />
                          )}
                          {card.type === "IMAGE" && isEdit === card.i && (
                            <TextareaAutosize
                              style={{
                                width: "1000px",
                                opacity: 0.5,
                                fontFamily: "Roboto",
                                backgroundColor: "white",
                                border: "1px solid black",
                                fontSize: "x-large",
                                padding: "0 3% 0% 3%",
                              }}
                              value={card.value}
                              name={card.i}
                              i={card.i}
                              onChange={handleCardInputChange}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Resizable>
                </Box>
              ))}
          </GridLayout>
          </Box>
        </Box>
      )}
      {isMobile === true && (
        <Box sx={{ paddingRight: "1%", paddingLeft: "1%" }}>
          <Box
            className="layout"
            layout={layout}
            cols={1}
            width={windowWidth * 0.95}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {mobileCardDetails &&
              mobileCardDetails.map((card) => (
                <Box
                  key={card.i}
                  sx={{
                    overflow: "scroll",
                    borderRadius: "1.5%",
                    boxShadow: 3,
                    borderColor: card.backgroundColor,
                    marginBottom: "2%",
                  }}
                >
                  <Box
                    className="card"
                    style={{
                      background:
                        card.type === "IMAGE"
                          ? `url(${card.value}) no-repeat center center/cover`
                          : card.backgroundColor,
                      height: "250px",
                      width: windowWidth * 0.91,
                    }}
                  >
                    <Box className="card-text">
                      <Box sx={{ display: "flex" }}>
                        {card.type === "TEXT" && (
                          <TextareaAutosize
                            style={{
                              width: "1000px",
                              fontFamily: "Roboto",
                              backgroundColor: card.backgroundColor,
                              color: colorFontMap[card.backgroundColor],
                              border: "none",
                              fontSize: "large",
                              padding: "2% 3% 0% 3%",
                            }}
                            value={card.value}
                            name={card.i}
                            i={card.i}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default MyGrid;