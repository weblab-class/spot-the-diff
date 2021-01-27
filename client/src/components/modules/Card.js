import React, { Component } from "react";
import "./Card.css";

class Card extends Component {
    constructor(props) {
      super(props);
    }

render() {
    const color = this.props.isCommon ? "Card-common" : "Card-color"
    return (
      <div className={`Card-shape Card-color ${color}`}>
        {this.props.children}
      </div>
    )
    }
}

export default Card;
  