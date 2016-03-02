global.fp = require('lodash/fp');

import map from 'lodash/fp/map';
import omitBy from 'lodash/fp/omitBy';
import pick from 'lodash/fp/pick';
import merge from 'lodash/merge';
import isObjectLike from 'lodash/fp/isObjectLike';
import get from 'lodash/fp/get';
import flow from 'lodash/flow';

import React, { Component, PropTypes } from 'react'
import * as ns from "redux-namespace";
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as reselect from 'reselect';

import AppBar from 'material-ui/lib/app-bar';
import Avatar from 'material-ui/lib/avatar';
import Badge from 'material-ui/lib/badge';
import { Colors as colors } from "material-ui/lib/styles";
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import Paper from 'material-ui/lib/paper';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import AutoComplete from 'material-ui/lib/auto-complete';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import DebouncedInput from '../components/DebouncedInput'

import theme from "../theme";
import APIPoll from './APIPoll';

import { search } from '../actions/search';
import { selectSearch } from '../reducers/globalReducer';
import { filterResources } from '../api/reducer';

import { fetchUsers, logout } from '../api/actions';
import { key } from '../api/reducer';

import style from './page.less';


class Dashboard extends Component {
  static propTypes = {

  };

  static contextTypes = {
    muiTheme: React.PropTypes.object,
  };

  state = {
    tab: this.props.location.pathname
  }

  handleTab = (tab) => {
    this.setState({ tab });

    this.props.dispatch(push(tab));

    return tab;
  }

  componentWillReceiveProps(props) {
    setTimeout(() =>
      this.setState({ tab: props.location.pathname }));
  }

  render () {
    const { muiTheme } = this.context;
    const { children, dispatch, search, searchTerm, users } = this.props;

    return (
      <div>
        <Paper zDepth={0} style={{ backgroundColor: muiTheme.baseTheme.palette.primary1Color, display: 'flex' }}>
          <Tabs
            style={{ flex: 1 }}
            value={this.state.tab}
            onChange={this.handleTab}
            children={[
              <Tab key="Dashboard" label="Dashboard" value={'/'}/>,
              this.props.select('lastPage') &&
                <Tab key="lastPage" {...this.props.select('lastPage')} />,
              this.props.select('lastDetail') &&
                <Tab key="lastDetail" {...this.props.select('lastDetail')} />
            ].filter(x => x)}
          />
          <ToolbarGroup className={style.container} style={{ flex: 0.5, padding: '0 1em' }}>
            <TextField
              inputStyle={{ color: "white" }}
              value={searchTerm}
              onChange={flow(get('target.value'), search)}
              onEnterKeyDown={() => {
                if (users.length === 1) {
                  dispatch(search(''));
                  dispatch(push(`/user/${users[0].id}`))
                }
              }}
            />
            {/*<DebouncedInput onChange={flow(get('target.value'), search)} value={searchTerm} />*/}
          </ToolbarGroup>
          <ToolbarGroup style={{ display: "flex", alignItems: "center"}}>
            <RaisedButton style={{ margin: "0 12px" }} label="Logout" onClick={() => {
                dispatch(logout())
                dispatch(push('login'))
            }}/>
          </ToolbarGroup>
        </Paper>
        <div className={[style.container].join(' ')}>
          { children ? children
          : <Paper className={style.content}>
              <APIPoll action={fetchUsers()} poll={false}>
                <List>
                { users &&
                  users.map((user) =>
                  <ListItem
                    key={key(user)}
                    leftAvatar={<Avatar src={user.profile.avatar} />}
                    primaryText={[user.profile.name].join(' ')}
                    secondaryText={user.profile.jobTitle + ' at ' + user.profile.company.name}
                    onClick={
                      dispatch.bind(null, push(`/user/${user.id}`))}
                    onKeyboardFocus={(e) => {
                      switch (e.key) {
                        case "Enter":
                          dispatch(search(''))
                          return dispatch(push(`/user/${user.id}`))
                      }
                    }}
                  />
                  )
                }
                </List>
              </APIPoll>
            </Paper>
          }
        </div>
      </div>
    )
  }
}

const selector = reselect.createSelector(
  (state, props) => filterResources(state, { type: 'user' }),
  (state, props) => selectSearch(state),
  (users, search) => {
    if (search) {
      users = users.filter((user) =>
        new RegExp(search.replace(/\s+/gi, ''), 'gi').
          test(`${user.profile.name} ${user.profile.jobTitle} ${user.profile.company.name} id:${user.id}`))
    }

    return {
      users,
      searchTerm: search
    }
  }
)

function mapStateToProps(state, props) {
  let users = filterResources(state, { type: 'user' });
  let search = selectSearch(state);

  if (search) {
    users = users.filter((user) =>
      new RegExp(search.replace(/\s+/gi, ''), 'gi').
        test(`${user.profile.name} ${user.profile.jobTitle} ${user.profile.company.name} id:${user.id}`))
  }

  return {
    users, searchTerm: search
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    dispatch,
    ...bindActionCreators({ search, push }, dispatch)
  };
}

export default ns.connect('page')(connect(selector, mapDispatchToProps)(Dashboard));
