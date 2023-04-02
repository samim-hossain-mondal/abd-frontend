import { Tab } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';

function MobileTabs({ 
    sections
}) {
    // const [activeTab, setActiveTab] = useState('Daily Retro');
    const handleTabClick = (e, ref) => {
        e.stopPropagation();
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };
    
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 10, position: 'fixed', zIndex: 999 }}>
        {sections.map((section) => (
            <Tab
            key={section}
            // value={index}
            label={section.name}
            onClick={(e) => handleTabClick(e, section.ref)}
            />
        ))}
        </Box>
    );
}

export default MobileTabs;

MobileTabs.propTypes = {
    sections: PropTypes.array.isRequired,
};