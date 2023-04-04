/* eslint-disable import/no-extraneous-dependencies */
import { Tab, Box } from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { animateScroll } from "react-scroll";

function MobileTabs({ sections }) {
  const [activeTab, setActiveTab] = useState("Daily Retro");

  const handleTabClick = (e, name, ref) => {
    e.stopPropagation();
    setActiveTab(name);
    animateScroll.scrollTo(ref.current.offsetTop, {
      duration: 200,
      delay: 0,
      smooth: 'easeInOutQuint',
    });
  };

  return (
    <Box
      sx={{
        zIndex: 9999,
        backgroundColor: "white",
        color: "black",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: "divider",
        marginY: 1
      }}
    >
      {sections.map((section) => (
        <Box
          key={section.name}
          sx={{
            width: '33%',
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderBottom: activeTab === section.name ? "5px solid" : "none",
            borderBottomColor: activeTab === section.name ? "logoBlue.main" : "none",
          }}
        >
          <Tab
            centered
            key={section}
            label={section.name}
            onClick={(e) => handleTabClick(e, section.name, section.ref)}
            sx={{
              marginInline: 0,
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
              overflow: "hidden",
              fontSize: "0.85rem",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default MobileTabs;

MobileTabs.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      ref: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        .isRequired,
    })
  ).isRequired,
};
