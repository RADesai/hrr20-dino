import React from 'react';

// import TestComponent from './test-component.react';
import PreAuthNav from '../routine/pre-auth-nav.react';

import Routine from '../routine/routine.react';
import CreateRoutine from '../routine/create-routine.react';
import EditRoutine from '../routine/edit-routine.react';
import MyRoutines from '../routine/my-routines.react';
import Task from '../task/task.react';
import CreateTask from '../task/create-task.react';
import Home from '../home/home.react';
import SideMenu from '../side-menu/side-menu.react';
import LogIn from "./login";
import SignUp from "./signup";
import { Link, Router, Route, browserHistory } from 'react-router';
import data from '../../utils/api-utils';

// material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as themes from '../theme/theme';

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'green'
    }

    this.colorChange = this.colorChange.bind(this);


    this.checkAuthenticate = (nextState)=>{

      $.ajax({
        type:'GET',
        url:'/checkAuth',
        success:function() {
          browserHistory.push(nextState.location.pathname);
        },
        error:function(error) {
          browserHistory.push('/login');
        }
      });
    }
  }

  colorChange(colorName) {
    this.setState({
      color: colorName
    });
  }


  render() {
    return (
      <div id='application'>
        <MuiThemeProvider muiTheme={themes.getTheme(this.state.color)} >
          <Router history={browserHistory}>
            <Route path='/'
              component={()=>(<MyRoutines
              colorChange={this.colorChange}
              />)}
              onEnter={this.checkAuthenticate.bind(this)}>
            </Route>
            <Route  path='/create-task' 
                   component={CreateTask} onEnter = {this.checkAuthenticate.bind(this)}> 
            </Route>
            <Route path='/routines/:id'
                   component={Routine}
                   test={[1, 2, 3]}
                   onEnter = {this.checkAuthenticate.bind(this)}/>
            <Route  path='/create-routine'
                    component={CreateRoutine}
                    onEnter = {this.checkAuthenticate.bind(this)}>
            </Route>
            <Route  path='/edit-routine/:id'
                    component={EditRoutine}
                    onEnter = {this.checkAuthenticate.bind(this)}>
            </Route>
            <Route  path='/create-task'
                    component={CreateTask}
                    onEnter = {this.checkAuthenticate.bind(this)}>
            </Route>
            <Route path='/tasks/:id'
                   component={Task}
                   onEnter = {this.checkAuthenticate.bind(this)}/>
            <Route path='/login' component= {LogIn}/>
            <Route path='/signup' component={SignUp}/>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}
