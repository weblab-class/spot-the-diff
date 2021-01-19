import React, { Component } from "react";
import "./Card.css";

class Card extends Component {
    constructor(props) {
      super(props);
    }

render() {
    return (
      <div className="Card-shape Card-color">
        {this.props.children}
      </div>
    )
    }
}

export default Card;
  