import React, { Component } from "react";
import StickyHeader from "react-headroom";
import { Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import AccountPage from "./accountPage";
import Body from "./body";
import Login from "./login";
import Register from "./register";
import axios from "axios";
import BookCardInfo from "./bookCardInfo";
import InterestsPage from "./interestsPage";
import { setTimeout } from "timers";

class Header extends Component {
  state = {
    input: null,
    user: null,
    topRight: null,
    randomBook: [],
    currInterests: []
  };

  componentDidMount() {
    this.setTopRight(
      <React.Fragment>
        <Button
          style={{ margin: "5px" }}
          variant="outline-primary"
          onClick={() => this.props.setContent(<Login setContent={this.props.setContent} login={this.login} api={this.props.api}/>)}
        >
          Login
        </Button>
        <Button
          style={{ margin: "5px" }}
          variant="outline-primary"
          onClick={() => this.props.setContent(<Register login={this.login} api={this.props.api}/>)}
        >
          Register
        </Button>
      </React.Fragment>
    );
  }

  setTopRight = content => {
    this.setState({
      topRight: content
    });
  };

  login = users => {
    if (users == null) {
      this.props.setContent(<Login setContent={this.props.setContent} login={this.login} api={this.props.api}/>);
      return 0;
    }

    this.setState({ user: users, currInterests: users.interestsList });
    this.randomBook();
    this.props.setContent(
      <AccountPage
        user={users}
        updateInter={this.updateInter}
        randomBook={this.randomBook}
      />
    );
    this.setState({ user: users });
    this.props.setContent(<AccountPage user={users} api={this.props.api} signOut={this.signOut}/>)
    this.setTopRight(
      <Button
        style={{ margin: "5px" }}
        variant="outline-primary"
        onClick={() => this.signOut()}
      >
        Sign Out
      </Button>
    );
    return 1;
  };

  signOut = () => {
    this.props.setContent(<Body api={this.props.api}/>);
    this.setState({ user: null });
    this.setTopRight(
      <React.Fragment>
        <Button
          style={{ margin: "5px" }}
          variant="outline-primary"
          onClick={() => this.props.setContent(<Login setContent={this.props.setContent} login={this.login} api={this.props.api}/>)}
        >
          Login
        </Button>
        <Button
          style={{ margin: "5px" }}
          variant="outline-primary"
          onClick={() => this.props.setContent(<Register login={this.login} api={this.props.api}/>)}
        >
          Register
        </Button>
      </React.Fragment>
    );
  };

  // search = obj => {
  //   axios
  //     .post(this.props.api+"/search", obj)
  //     .then(res => {
  //       this.props.setContent(
  //         <React.Fragment>
  //           {res.data.data.map(book => (
  //             <BookCardInfo key={book._id} bookInfo={book} api={this.props.api} />
  //           ))}
  //         </React.Fragment>
  //       );
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  //display random books using current user interests
  randomBook = () => {
    if (this.state.user == null) {
      console.log("did not find user.");
      return false; //error?
    } else {
      let interList = this.state.currInterests;
      let localRandomBook = [];
      let localTime = 0;
      for (let i = 0; i < interList.length; i++) {
        setTimeout(function() {
          axios
            .post("http://localhost:3001/api/search", { course: interList[i] })
            .then(res => {
              console.log("loop add random books round: " + i);
              console.log("the res data length: " + res.data.data.length);
              localTime = res.data.data.length;
              if (res.data.data.legnth == 0) {
                console.log(
                  "this is when data is empty. should not get this because this error will be catched"
                );
              } else if (res.data.data.legnth == 1) {
                console.log(
                  "TEST HISTORY COURSE: should see this message because there is only one book of History"
                );
                localRandomBook.push(res.data.data[0]);
              } else {
                let random1 = Math.floor(
                  Math.random() * Math.floor(res.data.data.length)
                );
                let random2 = Math.floor(
                  Math.random() * Math.floor(res.data.data.length)
                );
                while (random2 == random1) {
                  random2 = Math.floor(
                    Math.random() * Math.floor(res.data.data.length)
                  );
                }
                localRandomBook.push(res.data.data[random1]);
                localRandomBook.push(res.data.data[random2]);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }, localTime);
      }

      //after for loop
      this.setState({ randomBook: localRandomBook });
    }
  };

  updateInter = obj => {
    let tempInter = this.state.currInterests;
    if (!tempInter.includes(obj)) {
      tempInter.push(obj);
      console.log("push new Interests to header successfully!!!!!!!");
    }
    for (let i = 0; i < tempInter.length; i++) {
      console.log("inter " + i + " in newInterlist: " + tempInter[i]);
    }
    this.setState({ currInterests: tempInter });
  };

  render() {
    return (
      <Navbar
        bg="navbar navbar-dark bg-dark"
        expand="lg"
        style={{ marginBottom: 10 }}
      >
        <Navbar.Brand href="#home">
          UB Platform
          <img
            src="https://img.icons8.com/doodle/48/000000/books.png"
            style={{ width: 30 }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link
              href="#home"
              onSelect={() => {
                this.props.setContent(<Body api={this.props.api}/>);
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="#accountPage"
              onSelect={() => {
                this.login(this.state.user);
              }}
            >
              Account
            </Nav.Link>
            <Nav.Link
              href="#InterestsPage"
              onSelect={() => {
                //this.randomBook();
                //this.updateInterPage();
                this.props.setContent(
                  <InterestsPage randomBook={this.state.randomBook} />
                );
              }}
            >
              InterestsPage
            </Nav.Link>
          </Nav>
          <Form inline>
            {this.state.topRight}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
