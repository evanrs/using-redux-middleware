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
import * as ns from "redux-namespace";
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from "moment";

import AppBar from 'material-ui/lib/app-bar';
import Avatar from 'material-ui/lib/avatar';
import { Colors as colors } from "material-ui/lib/styles";
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

import theme from "../theme";
import APIPoll from './APIPoll';

import { search } from '../actions/search';
import { selectSearch } from '../reducers/globalReducer';
import { setInterval } from '../store/interval';
import { findResource } from '../api/reducer';

import { getPost } from '../api/actions';

import style from './page.less';


class UserPostDetails extends Component {
  static propTypes = {

  };

  componentDidMount () {
    this.push(this.props)
  }

  componentWillReceiveProps (props) {
    this.push(props);
  }

  push (props) {
    const { assign, select, location, params, post } = props;

    const displayName = post
      ? post.drugDisplayNamePrimary
      : `Post ${params.postId}`
    ;

    const last = select('lastDetail', {});

    if (last.value !== location.pathname || last.label !== displayName) {
      assign('lastDetail', {
        value: location.pathname,
        label: displayName
      })
    }
  }


  render () {
    const { results, post } = this.props;

    return (
      <APIPoll action={getPost(this.props.params.postId)}>
        { post &&
          <Post {...{ post, results }} />
        }
      </APIPoll>
    )
  }
}

function Post (props, context) {
  const { results, post } = props;

  return (
    <div>
      <Paper className={style.content}>
      </Paper>
    </div>
  )
}

function mapStateToProps(state, props) {
  let post = findResource(state, { type: 'prescription', id: props.params.postId });
  let search = selectSearch(state);
  let results = post;

  if (search) {
    results = {};
    Object.keys(post).
      filter(key =>
        new RegExp(search.replace(/\s+/gi, ''), 'gi').test(key+post[key])).
      forEach(key => results[key] = post[key])
  }

  return {
    post,
    results
  }
}

export default ns.connect('page')(
  connect(mapStateToProps)(UserPostDetails));
