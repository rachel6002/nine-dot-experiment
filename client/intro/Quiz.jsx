import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Quiz extends React.Component {
  state = { sum: "", horse: "" };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value.trim().toLowerCase() });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.sum !== "1" || this.state.horse !== "a") {
      alert("Incorrect! Read the instructions, and please try again.");
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    const { sum, horse } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="sum">Please fill in Number '1'.</label>
              <input
                type="text"
                dir="auto"
                id="sum"
                name="sum"
                placeholder="Please fill in 1"
                value={sum}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>
            <p>
              <label htmlFor="horse">
                Please fill in letter 'a'.
              </label>
              <input
                type="text"
                dir="auto"
                id="horse"
                name="horse"
                placeholder="e.g. a"
                value={horse}
                onChange={this.handleChange}
                autoComplete="off"
                required
              />
            </p>

            <p>
              <button type="button" onClick={onPrev} disabled={!hasPrev}>
                Back to instructions
              </button>
              <button type="submit">Submit</button>
            </p>
          </form>
        </div>
      </Centered>
    );
  }
}
