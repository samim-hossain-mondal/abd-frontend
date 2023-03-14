import React, { useEffect, useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, IconButton, Typography,List, ListItem, ListItemButton } from "@mui/material";
import { Box } from "@mui/system";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import PropTypes from "prop-types";
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllUsers } from "../../utilityFunctions/User";

function Item({ entity: { name, char } }) {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton>
          <Typography>{char}</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: '15px' }}>{name}</Typography>
        </ListItemButton>
      </ListItem>
    </List>
  )
}

function Loading() {
  return <Box>Loading...</Box>;
}

export default function GenericInputModal({
  onCloseButtonClick,
  title,
  defaultValue,
  children,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  placeholder,
  isDisabled,
  setIsDisabled,
  deleteRequest
}) {
  const matchesLargeSize = useMediaQuery('(min-width:400px)');
  const [content, setContent] = useState(defaultValue ?? "");
  const [users,setUsers] = useState([]);

  useEffect(()=>{
    setUsers(getAllUsers());
  },[]);

  const getSimilarUsers = (text) => {
    const similarUsers = users.filter((user) => user.toLowerCase().includes(text.toLowerCase()));
    return similarUsers.map((user) => ({ name: user, char: '@' }));
  }

  return (
    <Box
      sx={matchesLargeSize?{
        width: "max(25vw, 340px)",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 30px 60px rgba(32, 56, 85, 0.15)",
        borderRadius: "8px",
        padding: "16px 24px 24px 24px",
      }:{
        width: "max(25vw, 255px)",
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 30px 60px rgba(32, 56, 85, 0.15)",
        borderRadius: "8px",
        padding: "16px 24px 24px 24px",
      }
    }
    >
      {/* Action Buttons */}
      {
        (isDisabled !== undefined)
          ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <IconButton onClick={deleteRequest} sx={{ padding: 0 }}>
                <DeleteForeverIcon />
              </IconButton>
              <Box>
                <IconButton onClick={() => setIsDisabled(false)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onCloseButtonClick(content)} sx={{ padding: 0 }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          )
          : (
            <Box sx={{ textAlign: 'right' }}>
              <IconButton onClick={() => onCloseButtonClick(content)} sx={{ padding: 0 }}>
                <CloseIcon />
              </IconButton>
            </Box>
          )
      }



      {/* Title */}
      <Typography variant="h5">{title}</Typography>

      {/* TextField */}
      <Box sx={{
        width: "100%",
        margin: "16px 0",
        padding: 0
      }}>
        <ReactTextareaAutocomplete
          className="autocomplete-textarea"
          loadingComponent={Loading}
          style={(matchesLargeSize)?{
            width: "88%",
            padding: '20px',
            boxShadow: "0px 5px 15px rgba(119, 132, 238, 0.3)",
            multiline: true,
            rows: 4,
            fontSize: "16px",
            lineHeight: "20px",
            height: '130px',
            fontFamily: 'Roboto, sans-serif',
          }:{
            width: "80%",
            padding: '20px',
            boxShadow: "0px 5px 15px rgba(119, 132, 238, 0.3)",
            multiline: true,
            rows: 4,
            fontSize: "16px",
            lineHeight: "20px",
            height: '130px',
            fontFamily: 'Roboto, sans-serif',
          }}
          containerStyle={{
            width: '100%',
            padding: 0,
          }}
          minChar={0}
          trigger={{
            "@": {
              dataProvider: token => getSimilarUsers(token)
                .slice(0, 3)
                .map(({ name,char }) => ({ name, char })),
              component: Item,
              output: (item) => item.char+item.name,
            }
            // can add emojis with : trigger if required
          }}
          value={content}
          rows={4}
          placeholder={placeholder}
          onChange={(e) => setContent(e.target.value)}
          disabled={isDisabled}
        />
      </Box>

      {children}

      {/* Primary Button */}
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
            onClick={() => onPrimaryButtonClick(content)}
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

Item.propTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    char: PropTypes.string.isRequired,
  }).isRequired,
};

GenericInputModal.propTypes = {
  onCloseButtonClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  onPrimaryButtonClick: PropTypes.func,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  setIsDisabled: PropTypes.func,
  deleteRequest: PropTypes.func
};

GenericInputModal.defaultProps = {
  onPrimaryButtonClick: () => { },
  onSecondaryButtonClick: () => { },
  secondaryButtonText: undefined,
  children: undefined,
  placeholder: undefined,
  defaultValue: undefined,
  isDisabled: undefined,
  setIsDisabled: () => { },
  deleteRequest: () => { }
};
