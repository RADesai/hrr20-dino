import React from 'react';
import RoutineNav from './routine-nav.react.js';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Launch from 'material-ui/svg-icons/action/launch';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import * as Colors from 'material-ui/styles/colors';

import RoutineStore from '../../flux/stores/routine-store';
import TaskStore from '../../flux/stores/task-store';
import MyRoutines from './my-routines.react.js';
import InlineEdit from 'react-edit-inline';

import data from '../../utils/api-utils';
import Delete from 'material-ui/svg-icons/action/delete';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import AppBar from 'material-ui/AppBar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

export default class Routine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routines: [],
      currentRoutine: {},
      task: ''
    };
    this.handleTaskChange = this.handleTaskChange.bind(this);
  }

  componentDidMount() {
    this.getRoutineData();
  }

  getRoutineData() {
    data.getRoutines((err, data) => {
      this.setState({
        routines: data
      });
    });
  }

  findTasksForRoutine(routine) {
    return routine.tasks;
  }

  findCurrentRoutine() {
    return this.state.routines.filter((routine) => {
      if (this.props.params.id === routine._id) {
        this.state.currentRoutine = routine;
        return routine;
      }
    });
  }

  handleChange(fieldName, event) {
    this.setState({
      [fieldName] : event.target.value
    });
  }

  handleTaskChange(e){
    e.preventDefault();
    this.state.currentRoutine.tasks.push(this.state.task);
    this.forceUpdate();
  }

  removeTask(task, e) {
    e.preventDefault();
    this.state.currentRoutine.tasks.splice((this.state.currentRoutine.tasks).indexOf(task), 1);
    this.forceUpdate();
  }

  handleTaskEdit(oldTask, event) {
    console.log('old:', oldTask);
    console.log('NEW:', event);
    this.state.currentRoutine.tasks[this.state.currentRoutine.tasks.indexOf(oldTask)] = event.newTask;
  }

  handleNameEdit(event) {
    this.state.currentRoutine.name = event.newName;
  }

  handleToggle(day) {
    console.log(day, 'before toggle:', this.state.currentRoutine.repeat[day]);
    this.setState({
      currentRoutine: {
        repeat: {
          [day]: !!this.state.currentRoutine.repeat[day]
        }
      }
    });
    console.log(day, 'after toggle:', this.state.currentRoutine.repeat[day]);
  }

  handleSubmit() {
    //****************
    // hard coded user, replace when auth is done.
    //****************
    var userId = 1;
    console.log('submitting routine! state is:', this.state);

    $.ajax({
      method: 'PUT',
      url: '/routines',
      data: JSON.stringify(this.state.currentRoutine),
      dataType: "json",
      contentType: "application/json",
      success: function(err, res){
        if (err) {
          console.log(err);
        }
      }
    });
  }

  render() {
    const paperStyle = {
      height: 750,
      width: 750,
      margin: 35,
      overflow: 'auto'
    };
    const innerPaperStyle = {
      width: 700,
      margin: 35,
      overflow: 'hidden'
    };
    const centerPaper = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    const listStyle = {
      maxWidth: 650,
      alignItems: 'center',
      justifyContent: 'center'
    };
    const titleStyle = {
      fontSize: 32,
      colors: Colors.white
    };
    const taskStyle = {
      fontSize: 18,
    };

    return (
      <div>
        <RoutineNav />
        <div style={centerPaper}>
          <div>
            {this.findCurrentRoutine().map((routine) => {
              return (
                <Paper style={paperStyle} zDepth={4}>
                  <Toolbar >
                    <ToolbarGroup firstChild={true}>
                      <InlineEdit style={titleStyle} text={routine.name} paramName="newName" change={this.handleNameEdit.bind(this)}></InlineEdit>
                    </ToolbarGroup>
                  </Toolbar>
                  <div style={innerPaperStyle}>
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
                    <Divider/>
                    <List title="Tasks" style={listStyle}>
                    {routine.tasks.map((task) => {
                      return (
                        <ListItem key={routine.tasks.indexOf(task)} rightIcon={<IconButton onClick={this.removeTask.bind(this, task)} tooltip="Remove Task"><Delete /></IconButton>}>
                          <InlineEdit text={task} paramName="newTask" style={taskStyle} change={this.handleTaskEdit.bind(this, task)}></InlineEdit>
                        </ListItem>
                      );
                    })}
                    </List>
                    <div>
                      <TextField
                        type="text"
                        floatingLabelText="Anything else you need to do?"
                        hintText="Add to your routine here"
                        onChange={this.handleChange.bind(this, 'task')}
                        />
                      <IconButton tooltip="Add Task" onClick={this.handleTaskChange.bind(this)}><AddCircle /></IconButton>
                    </div>
                    <div>
                      <Link to='/'>
                        <RaisedButton
                          label="Update Routine"
                          labelPosition="before"
                          primary={true}
                          icon={<Refresh />}
                          onClick={this.handleSubmit.bind(this)}
                          Link to='/'
                          />
                      </Link>
                    </div>
                  </div>
                </Paper>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
