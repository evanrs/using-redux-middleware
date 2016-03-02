import map from 'lodash/fp/map';
import mapValues from 'lodash/fp/mapValues';
import omitBy from 'lodash/fp/omitBy';
import pick from 'lodash/fp/pick';
import merge from 'lodash/merge';
import isObjectLike from 'lodash/fp/isObjectLike';
import isString from 'lodash/fp/isString';
import get from 'lodash/fp/get';
import flow from 'lodash/flow';

import React, { Component, PropTypes } from 'react'
import * as ns from 'redux-namespace';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import AppBar from 'material-ui/lib/app-bar';
import Avatar from 'material-ui/lib/avatar';
import { Colors as colors } from 'material-ui/lib/styles';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import Badge from 'material-ui/lib/badge';
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
import CircularProgress from 'material-ui/lib/circular-progress';

import theme from '../theme';
import APIPoll from './APIPoll';

import { search } from '../actions/search';
import { selectSearch } from '../reducers/globalReducer';
import { setInterval } from '../store/interval';
import { findResource } from '../api/reducer';

import { fetchUser, fetchPostsByUser } from '../api/actions';

import style from './page.less';


class UserDashboard extends Component {
  static propTypes = {

  };

  componentDidMount () {
    this.push(this.props)
  }

  componentWillReceiveProps (props) {
    this.push(props);
  }

  push (props) {
    const { assign, select, location, params, user } = props;

    const displayName = user
      ? user.profile.name
      : `User ${params.userId}`
    ;

    if (select('lastPage.label') !== displayName) {
      assign('lastPage', {
        value: `user/${params.userId}`,
        label: displayName
      })
      assign('lastDetail', false)
    }
  }


  render () {
    const { children, dispatch, results, user } = this.props;
    console.log('user', user)
    return children ? children : (
      <APIPoll action={fetchUser(this.props.params.userId)} wait={! user}>
        { user &&
          <User {...{ dispatch, user, results }} />
        }
      </APIPoll>
    )
  }
}

function User (props, context) {
  const { dispatch, results, user } = props;
  const { profile } = user;

  return (
    <div>
      <Paper className={style.content}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={profile.avatar} size='60' style={{ marginRight: theme.baseline * 2 }}/>
          <h1 style={{ flex: 1 }}> {profile.name} </h1>
        </div>
        <APIPoll action={fetchPostsByUser(user)} wait={! user.posts}>
          { user &&
            Posts(results)
          }
        </APIPoll>
      </Paper>
    </div>
  )
}

function Posts (posts=[]) {
  return (
    <List>
      {posts.map((post) =>
        <Paper zDepth={1}>
          <ListItem className={style.content}>
            <h4>{post.title}</h4>
            <h5>{post.subtitle}</h5>
            <p>
              {post.intro}
            </p>
            <p>
              {post.body}
            </p>
            <div className={style.footer}>
              <h6>
                {moment(post.createdAt).fromNow()}
              </h6>
              { post.likes &&
                <h6>
                  { post.likes.length } Likes
                </h6>
              }
            </div>
          </ListItem>
        </Paper>
      )}
    </List>
  )
}


function mapStateToProps(state, props) {
  let user = findResource(state, { type: 'user', id: props.params.userId });

  let search = selectSearch(state);
  let results = user.posts;

  if (search) {
    results =
      results.filter(value =>
        new RegExp(search.replace(/\s+/gi, ''), 'gi').test(value.sentence + value.words + value.paragraph));
  }

  return {
    user,
    results
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    dispatch,
    update: dispatch.bind(null, fetchUser({ id: props.params.userId }))
  };
}

export default ns.connect('page')(
  connect(mapStateToProps, mapDispatchToProps)(UserDashboard));
