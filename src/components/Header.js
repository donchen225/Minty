import React from 'react';
import { useDispatch } from "react-redux";
import { logoutUser, logoutAll } from '../actions/auth';
import Link from "./Link";

import clsx from 'clsx';
import { useStyles } from '../styles/useStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';

const Header = ({ handleDrawerOpen, open }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const handleLogout = () => dispatch(logoutUser());
    const handleLogoutAll = () => dispatch(logoutAll());
    return (
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    Dashboard
                </Typography>
                <Link/>
                <IconButton color="inherit">
                    <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon />
                    </Badge>
                </IconButton>
                <button onClick={handleLogout}> Logout </button>
                <button onClick={handleLogoutAll}> Logout All </button>
            </Toolbar>
        </AppBar>
    )
};

export default Header;