import React, { FunctionComponent } from "react";
import { useAuth0 } from "../App/react-auth0-spa";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import config from "../App/config";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  menu: {
    color: "white"
  }
}));

const NavigationHeader: FunctionComponent = (): React.ReactElement => {
  const classes = useStyles();
  const { logout } = useAuth0();
  let history = useHistory();
  //Menu location management
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (action: string): void => {
    setAnchorEl(null);
    switch (action) {
      case "database":
        history.push("/database");
        return;
      case "match":
        history.push("/matchlist");
        return;
      case "logout":
        logout({
          returnTo: config.baseURL
        });
        return;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            OXO Engine
          </Typography>
          <div>
            <IconButton
              className={classes.menu}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleClose("database")}>
                Database
              </MenuItem>
              <MenuItem onClick={() => handleClose("match")}>Match</MenuItem>
              <MenuItem onClick={() => handleClose("logout")}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationHeader;
