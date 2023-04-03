import { Tab, Box } from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";

function MobileTabs({ sections }) {
  const [activeTab, setActiveTab] = useState("Daily Retro");
  const handleTabClick = (e, name, ref) => {
    e.stopPropagation();
    setActiveTab(name);
    ref.current.scrollIntoView({ behavior: "smooth" });
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
      }}
    >
      {sections.map((section) => (
        <Box
            key={section.name}
            sx={{
                width: 130,
                height: 50
            }}
        >
          <Tab
            centered
            key={section}
            label={section.name}
            onClick={(e) => handleTabClick(e, section.name, section.ref)}
            sx={{
              marginInline: 0,
              borderBottom: activeTab === section.name ? "5px solid" : "none",
              borderBottomColor: activeTab === section.name ? "logoBlue.main" : "none",
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
