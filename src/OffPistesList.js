import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Typography,
  Toolbar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel
} from '@material-ui/core';
import { NAME, SKI_DIFFICULTY } from './constants/sorting-types.js';
import getSortedArray from './util/getSortedArray.js';

export default class OffPistes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offPistes: [],
      sortingType: null,
    }

    this.updateOffPistes();

  }

  async updateOffPistes() {
    const offPistes = await require('./assets/off-pistes.json');
    this.setState({ offPistes });
  }

  renderOffPisteItem(offPiste) {
    const { name, short_description, ski_difficulty } = offPiste;

    return (
      <div>
        <ListItem button alignItems="flex-start">
          <ListItemText
            primary={name}
            secondary={<React.Fragment>
              <Typography>
                {short_description}
              </Typography>
              <Typography>
                {`Ski Difficulty: ${ski_difficulty}`}
              </Typography>
            </React.Fragment>} />
        </ListItem>
        <Divider />
      </div>
    )
  }

  onSortingChecked(type) {
    const { sortingType, offPistes } = this.state;

    let newSortingType;
    if (sortingType !== type) {
      newSortingType = type;

      const sortedOffPistes = getSortedArray(offPistes, type, true);
      this.setState({ sortingType: newSortingType, offPistes: sortedOffPistes })
      return;
    }

    this.setState({ sortingType: newSortingType })
  }

  render() {
    const { classes } = this.props;
    const { offPistes, sortingType } = this.state;

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
            <FormGroup row>
              <FormLabel style={{ marginRight: 15 }} component="legend">{'Sort by: '}</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox checked={sortingType === NAME} onChange={() => this.onSortingChecked(NAME)} value="checkedA" />
                }
                label="Name"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={sortingType === SKI_DIFFICULTY} onChange={() => this.onSortingChecked(SKI_DIFFICULTY)} value="checkedA" />
                }
                label="Ski Difficulty"
              />
            </FormGroup>
            <List component="nav" aria-label="main mailbox folders">
              {offPistes.map(offPiste => this.renderOffPisteItem(offPiste))}
            </List>
          </Container>
        </main>
      </React.Fragment>
    )
  }
}
