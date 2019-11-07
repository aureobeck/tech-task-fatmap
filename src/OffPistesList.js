import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Toolbar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';
import GoogleMapReact from 'google-map-react';
import { NAME, SKI_DIFFICULTY } from './constants/sorting-types.js';
import getSortedArray from './util/getSortedArray.js';
import formatGoogleMapsLineArray from './util/formatGoogleMapsLineArray.js';
import { GOOGLE_MAPS_API } from './constants/api.js';

export default class OffPistes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offPistes: [],
      sortingType: null,
      isPisteLineDialogOpen: false,
      currentPisteGeoData: null,
    }

    this.parseAndRefreshOffPistes();

    this.handleClosePisteLineDialog = this.handleClosePisteLineDialog.bind(this);
  }

  async parseAndRefreshOffPistes() {
    const offPistes = await require('./assets/off-pistes.json');
    this.setState({ offPistes });
  }

  renderOffPisteItem(offPiste) {
    const { name, short_description, ski_difficulty, geo_data } = offPiste;

    return (
      <div key={name}>
        <ListItem k button alignItems="flex-start" onClick={() => this.setState({ isPisteLineDialogOpen: true, currentPisteGeoData: geo_data })}>
          <ListItemText
            primary={name}
            secondary={<React.Fragment>
              <Typography>
                {short_description}
              </Typography>
              <Typography>
                {`Ski difficulty: ${ski_difficulty}`}
              </Typography>
            </React.Fragment>} />
        </ListItem>
      </div>
    )
  }

  onSortingChecked(type) {
    const { sortingType, offPistes } = this.state;

    if (sortingType !== type) {
      const sortedOffPistes = getSortedArray(offPistes, type, true);
      this.setState({ sortingType: type, offPistes: sortedOffPistes })
    }
  }

  handleClosePisteLineDialog() {
    this.setState({ isPisteLineDialogOpen: false });
  }

  handleGoogleMapApi(google) {
    const { currentPisteGeoData } = this.state;

    if (!currentPisteGeoData) return;
    const { coordinates } = currentPisteGeoData;
    const formatedLineArray = formatGoogleMapsLineArray(coordinates);

    formatedLineArray.forEach(formatedLine => {
      const line = new google.maps.Polyline({
        path: formatedLine,
        geodesic: true,
        strokeColor: '#33BD4E',
        strokeOpacity: 1,
        strokeWeight: 5
      });

      line.setMap(google.map);
    })
  }

  getFirstPositionInLine() {
    const { currentPisteGeoData } = this.state;

    if (!currentPisteGeoData || !currentPisteGeoData.coordinates) return;
    return {
      lat: currentPisteGeoData.coordinates[0][0][1],
      lng: currentPisteGeoData.coordinates[0][0][0],
    };
  }

  render() {
    const { classes } = this.props;
    const { offPistes, sortingType, isPisteLineDialogOpen, currentPisteGeoData } = this.state;

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
        <Dialog onClose={this.handleClosePisteLineDialog} aria-labelledby="customized-dialog-title" open={isPisteLineDialogOpen}>
          <DialogTitle id="customized-dialog-title">
            {'Piste Line'}
          </DialogTitle>
          <DialogContent>
            {currentPisteGeoData ?
              <div style={{ height: 300, width: 400 }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: GOOGLE_MAPS_API }}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={google => this.handleGoogleMapApi(google)}
                  defaultCenter={this.getFirstPositionInLine()}
                  defaultZoom={13}
                >
                </GoogleMapReact>
              </div> : <Typography>
                {'No lines available'}
              </Typography>}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleClosePisteLineDialog} color="primary">
              {'Close'}
          </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
