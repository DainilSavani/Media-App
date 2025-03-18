import React from "react";

// Constants
import { TABS } from "./navbar.constants";

// Styles
import './navbar.scss';

const renderTab = (selectedTab, setSelectedTab) => (tabConfig, index) => (
    <div key={index} className={'tab ' + (selectedTab===tabConfig.id ? 'selectedTab' : null)} onClick={() => setSelectedTab(tabConfig.id)}>{tabConfig.name}</div>
)

const Navbar = ({ selectedTab, setSelectedTab, fetchMediaFiles }) => {
    return (
        <div className="navbar">
            {
                TABS.map(renderTab(selectedTab, setSelectedTab))
            }
        </div>
    )
};

export default Navbar;
