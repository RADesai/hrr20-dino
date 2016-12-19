import React from 'react';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import ColorLens from 'material-ui/svg-icons/image/color-lens';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import Reorder from 'material-ui/svg-icons/action/reorder';
import * as Colors from 'material-ui/styles/colors';
import {Link, browserHistory} from 'react-router';
import * as themes from '../theme/theme';

export default class MyRoutinesNav extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      themePop: false
    }

    this.themeChange = this.themeChange.bind(this);
    this.toggleThemePop = this.toggleThemePop.bind(this);
  }

  themeChange(color) {
    this.props.colorChange(color);
    this.toggleThemePop();
  }

  toggleThemePop() {
    this.setState({
      themePop: !this.state.themePop
    })
  }

  logout(e) {
    e.preventDefault();
    console.log(this.state);
    $.ajax({
      type:'GET',
      url:'/logout',
      data: this.state,
      success:function() {
          browserHistory.push('/login');
          console.log("DONE!");
        },
      error:function() {
          browserHistory.push('/login');
          console.log('lololol');
      }
    })
  }
  render() {
    const logoStyle = {
      fontWeight: 'bold',
      fontSize: 24,
      color: Colors.white
    };
    const titleStyle = {
      fontSize: 24,
      color: Colors.white
    };
    return (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            {/* handle reorder href to open SideMenu */}
            <IconButton>
              <Reorder/>
            </IconButton>
            <Link to='/'>
              <ToolbarTitle style={logoStyle} text="DinoParrotTask"/>
            </Link>
            <RaisedButton primary={true} icon={< ColorLens />} onClick={this.toggleThemePop}/>
              <div className={"style-popout " + (this.state.themePop ? 'show' : 'hidden')}>
                <div onClick={() => this.themeChange('green')} className="box theme-green"></div>
                <div onClick={() => this.themeChange('pink')} className="box theme-pink"></div>
                <div onClick={() => this.themeChange('blue')} className="box theme-blue"></div>
                <div onClick={() => this.themeChange('cara')} className="box theme-cara"></div>
                <div onClick={() => this.themeChange('bright')} className="box theme-bright"></div>
              </div>
          </ToolbarGroup>
          <ToolbarGroup lastChild={true}>
            {/* insert onClick/onTapTouch to ArrowBack */}
            <ToolbarTitle style={titleStyle} text="My Routines" />
            <ToolbarSeparator />
            <Link to='/create-routine'>
              <RaisedButton label="Create routine" labelPosition="before" primary={true} icon={< AddCircleOutline />}/>
            </Link>
            <ToolbarSeparator />
            {/* insert onClick/onTapTouch to RaisedButton */}
            <RaisedButton
              label="Logout"
              labelPosition="before"
              primary={true}
              icon={<PowerSettingsNew />}
              onClick={this.logout.bind(this)}/>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}
