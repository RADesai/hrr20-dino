import React from 'react';
import MyRoutinesNav from './my-routines-nav.react.js';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Launch from 'material-ui/svg-icons/action/launch';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Link} from 'react-router';
import Create from 'material-ui/svg-icons/content/create';

import data from '../../utils/api-utils';

export default class MyRoutines extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routines: [],
      tasks: [],
      strikeStyle: {textDecoration: 'none'},
    };
    this.getRoutineData = this.getRoutineData.bind(this);
  }

  componentDidMount() {
    this.getRoutineData();
    // check for updates every 2 seconds, in case of emailed routine.
    // Using setstate makes this invisible to user (hopefully), but maybe taxing on db at scale.
    var update = setInterval(this.getRoutineData, 2000);
    this.setState({update: update});
  }

  getRoutineData() {
    data.getRoutines((err, data) => {
      // if (err) console.log(err);
      this.setState({
        routines: data
      });
    });
  }

  handleRemoveRoutine(id) {
    RoutineActions.remove(id);
  }

  render() {
    const paperStyle = {
      float: 'left',
      height: 400,
      width: 300,
      margin: 30,
      overflow: 'auto'
    };

    return (
      <div>
        <MyRoutinesNav colorChange={this.props.colorChange}/> {this.state.routines.map((routine) => {
          return (
            <Paper key={routine._id} style={paperStyle} zDepth={4}>
              {/* insert onTapTouch for FlatButton */}
              <AppBar title={routine.name} titleStyle={{
                fontSize: 18
              }} iconElementLeft={< IconButton onClick = {
                this.handleRemoveRoutine.bind(this, routine._id)
              } > <NavigationClose/> < /IconButton>} iconElementRight={< Link params = {{ id: routine._id }}to = {
                `/edit-routine/${routine._id}`
              } > <IconButton><Create/></IconButton> < /Link>}/>
              <div className="day-quickview text-justify">
                <span className={routine.repeat['Sunday']
                  ? 'day-view-on'
                  : 'day-view-off'}>SUN </span>
                <span className={routine.repeat['Monday']
                  ? 'day-view-on'
                  : 'day-view-off'}>MON </span>
                <span className={routine.repeat['Tuesday']
                  ? 'day-view-on'
                  : 'day-view-off'}>TUE </span>
                <span className={routine.repeat['Wednesday']
                  ? 'day-view-on'
                  : 'day-view-off'}>WED </span>
                <span className={routine.repeat['Thursday']
                  ? 'day-view-on'
                  : 'day-view-off'}>THUR </span>
                <span className={routine.repeat['Friday']
                  ? 'day-view-on'
                  : 'day-view-off'}>FRI </span>
                <span className={routine.repeat['Saturday']
                  ? 'day-view-on'
                  : 'day-view-off'}>SAT </span>
              </div>
              <List>

                {/* for each task in routine */}
                {routine.tasks.map((task, k) => {
                  return (
                    <div key={k}>
                      <Divider/> {/* insert onTapTouch for ListItem */}
                      <ListItem primaryText={task} rightIcon={< Link params = {{ name: routine.name }}to = {
                        `/tasks/${task}`
                      } > <Launch/> < /Link>}></ListItem>
                    </div>
                  );
                })}
              </List>
            </Paper>
          );
        })}
      </div>
    );
  }
}
