import flow from "lodash/flow";
import pick from "lodash/pick";

import React, { Component, PropTypes } from 'react'
import { replace } from 'react-router-redux'
import { connect } from 'react-redux'
import * as namespace from 'redux-namespace'
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
import Paper from 'material-ui/lib/paper';

import { postLogin } from '../api/actions';
import { selectAuthorization } from '../api/reducer';

import style from "./form-login.less";


const connector = flow(
  namespace.connect('LoginForm', { debounce: 500 }),
  connect((state) => ({
    authorization: selectAuthorization(state)
  }))
)

/**
 * if account exists navigate to next query or landing
 * otherwise present form, postLogin, then process should repeat
 */
class LoginForm extends Component {
  componentWillMount() {
    this.redirect(this.props)
  }

  componentWillReceiveProps(props) {
    this.redirect(props)
  }

  redirect(props) {
    props.authorization && this.props.dispatch(replace('/'));
  }

  render () {
    let {select, assigns, dispatch, children} = this.props;

    return (
     <Paper className={style.container} zDepth={0}>
       <form onSubmit={(e) => {
         e.preventDefault();
         dispatch(postLogin(select()))
       }}>
         <TextField
           fullWidth={true}
           floatingLabelText="email"
           value={select('email')}
           onChange={assigns('email', 'target.value')}/>
         <TextField
           className={style.lastInput}
           fullWidth={true}
           floatingLabelText="password"
           value={select('password')}
           type="password"
           onChange={assigns('password', 'target.value')}/>
         <RaisedButton
           className={style.button}
           fullWidth={true}
           type="submit"
           label="Sign in"
           primary={true}
         />
       </form>
     </Paper>
    )
  }
}

export default connector(LoginForm);
