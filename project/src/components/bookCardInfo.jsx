import React, { Component } from "react";
import mongodb from "mongodb";

class BookCardInfo extends Component {
  state = {
    id: this.props.bookInfo._id
  };
  render() {
    return (
      <div className="col-sm-3" style={{ display: "inline-grid" }}>
        <div className="card">
          <div className="card-body">
            <div className="badge badge-primary">
              <img
                style={{ width: 200 }}
                src={this.props.bookInfo.url}
                alt="Logo"
              />
              <h5 className="card-title">{this.props.bookInfo.title}</h5>
              <p className="card-text">{this.props.bookInfo.course}</p>
              <p> {this.props.bookInfo.price}</p>
              <p>{this.state._id}</p>
              <p>{this.props._id}</p>
              <button
                onClick={() => {
                  this.props.deleteByIdFromDB(this.props.bookInfo._id);
                }}
              >
                Delete This Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BookCardInfo;