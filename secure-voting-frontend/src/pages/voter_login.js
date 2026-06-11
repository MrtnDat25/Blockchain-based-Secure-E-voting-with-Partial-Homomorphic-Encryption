
import axios from "axios";
import Router from "next/router";
import Cookies from "js-cookie";
import React, { Component } from "react";


import {
  Button,
  Divider,
  Transition,
  Form,
  Grid,
  Icon,
  Segment,
} from "semantic-ui-react";

import Head from "next/head";
import Link from "next/link";


class DividerExampleVerticalForm extends Component {
  state = { visible: false, email: "" };

  toggleVisibility = () =>
    this.setState({ visible: !this.state.visible });

  returnBackImage = () => (
    <div className="login-form">
      <style jsx>{`
        .login-form {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("/blockchain.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #000; /* nền đen phần dư */
          z-index: -1;
        }
          }
      `}</style>
    </div>
  );

signin = async (e) => {
  try {

    const email =
      document.getElementById("signin_email").value;

    const password =
      document.getElementById("signin_password").value;

    const response =
      await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

    const token =
      response.data.token;

    const user =
      response.data.user;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    Cookies.set(
      "token",
      token,
      {
        expires: 7,
      }
    );

    Router.push(
      "/dashboard/voter"
    );

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Login failed"
    );

  }
};


signup = async (e) => {

  try {

    const fullName =
      document.getElementById("signup_fullname").value;

    const email =
      document.getElementById("signup_email").value;

    const password =
      document.getElementById("signup_password").value;

    const repeat =
      document.getElementById("signup_repeat_password").value;

    if (!fullName || !email || !password) {
      alert("Missing fields");
      return;
    }

    if (password !== repeat) {
      alert("Passwords do not match");
      return;
    }

    const response =
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName,
          email,
          password,
          role: "voter"
        }
      );

    console.log(response.data);

    alert("Register success");

    this.setState({
      visible: false
    });

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Register failed"
    );
  }
};

render() {
  const { visible } = this.state;

  return (
    <div>
      <Head>
        <title>Company Login</title>
      </Head>

      <link
        rel="stylesheet"
        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
      />

      {this.returnBackImage()}

      <Grid>
        <Grid.Row>
          <Grid.Column
            width={5}
            style={{
              marginLeft: "33%",
              marginTop: "8%",
            }}
          >
            {/* 🔥 HOME + SIGN IN/SIGN UP */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <Link href="/homepage">
                <Button
                  color="grey"
                  basic
                  icon
                  labelPosition="left"
                >
                  <Icon name="home" />
                  Home
                </Button>
              </Link>

              <Button
                primary
                content={visible ? "Sign in" : "Sign up"}
                onClick={this.toggleVisibility}
              />
            </div>

            <Segment placeholder>
              {/* SIGN IN */}
            <Transition visible={!visible} animation="scale" duration={300}>
            <Form size="large">
                <h3>Sign in</h3>

                <Form.Input id="signin_email" placeholder="Email" />

                <Form.Input
                id="signin_password"
                type="password"
                placeholder="Password"
                />

                <Button fluid color="blue" onClick={this.signin}>
                Submit
                </Button>
            </Form>
            </Transition>

              {/* SIGN UP */}
            <Transition visible={visible} animation="scale" duration={300}>
            <Form size="large">
                <h3>Sign up</h3>

                <Form.Input id="signup_fullname" placeholder="Full Name" />

                <Form.Input id="signup_email" placeholder="Email" />

                <Form.Input
                id="signup_password"
                type="password"
                placeholder="Password"
                />

                <Form.Input
                id="signup_repeat_password"
                type="password"
                placeholder="Repeat Password"
                />

                <Button fluid color="blue" onClick={this.signup}>
                Submit
                </Button>
            </Form>
            </Transition>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}}

export default DividerExampleVerticalForm;