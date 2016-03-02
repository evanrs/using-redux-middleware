import React from "react";
import { debounce, clone } from 'lodash';


class DebouncedInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || ''
    }

    this.onChangeCallback = debounce(this.props.onChange, 500);
  }

  shouldComponentUpdate(props, state) {
    return this.state.value !== state.value;
  }

  handleChange (e) {
    this.setState({
      value: e.target.value
    });

    this.onChangeCallback({
      target: { value: e.target.value } });
  }

  render () {
    return (
      <input
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

export default DebouncedInput;
