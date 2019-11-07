import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { List, ListItem, ListItemText, Divider, Container, Typography, Toolbar } from '@material-ui/core';

export default class OffPistes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offPistes: []
    }

    this.updateOffPistes();
  }
  
  async updateOffPistes() {
    const offPistes = await require('./assets/off-pistes.json');
    this.setState({ offPistes });
  }

  renderOffPisteItem(offPiste) {
    const { name, short_description } = offPiste;

    return (
      <div>
        <ListItem button alignItems="flex-start">
          <ListItemText
            primary={name}
            secondary={<React.Fragment>
              <Typography>
                {short_description}
              </Typography>
            </React.Fragment>} />
        </ListItem>
        <Divider />
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    const { offPistes } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              {'Off-piste Lines'}
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Container className={classes.cardGrid} maxWidth="md">
            <List component="nav" aria-label="main mailbox folders">
              {offPistes.map(offPiste => this.renderOffPisteItem(offPiste))}
              </List>
          </Container>
        </main>
      </React.Fragment>
    )
  }
}
