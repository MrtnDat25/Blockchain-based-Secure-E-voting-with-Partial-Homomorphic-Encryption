import React, { Component } from "react";
import Router from "next/router";
import { withRouter } from "next/router";

import {
  Card,
  Header,
  Form,
  Button,
  Grid,
} from "semantic-ui-react";

import SidebarMenu from "../../../../components/SidebarMenu";

class PersonInfor extends Component {
  state = {
    role: "",

    company_email: "",
    voter_email: "",

    election_address: "",

    old_password: "",
    new_password: "",

    loading: false,
  };

componentDidMount() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const address =
    this.props.router?.query?.address ||
    window.location.pathname.split("/")[2];

  this.setState({
    role: user.role,
    company_email: user.email,
    voter_email: user.email,
    election_address: address,
  });
}

  changePassword = async () => {
    this.setState({ loading: true });

    try {
      const {
        role,
        company_email,
        voter_email,
        election_address,
        old_password,
        new_password,
      } = this.state;

      if (!old_password || !new_password) {
        alert("Missing password fields");
        this.setState({ loading: false });
        return;
      }

      // =====================
      // COMPANY
      // =====================
      if (role === "company") {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const accounts = await web3.eth.getAccounts();

        await Election_Factory.methods
          .updatePassword(
            company_email,
            old_password,
            new_password
          )
          .send({
            from: accounts[0],
          });

        alert("Company password updated");
      }

      // =====================
      // VOTER
      // =====================
      else {
        const response = await fetch(
          "/api/voter/change_password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: voter_email,
              oldPassword: old_password,
              newPassword: new_password,
              election_address,
            }),
          }
        );

        const data = await response.json();
        alert(data.message);
      }

      this.setState({
        old_password: "",
        new_password: "",
      });
    } catch (err) {
      console.log(err);

      alert(
        err.message ||
          "Change password failed"
      );
    }

    this.setState({ loading: false });
  };

  render() {
    const {
      role,
      company_email,
      voter_email,
      election_address,
    } = this.state;

    return (
      <Grid>
        <Grid.Row>
          {/* SIDEBAR */}
          <Grid.Column width={2}>
            <SidebarMenu
              address={election_address}
            />
          </Grid.Column>

          {/* CONTENT */}
          <Grid.Column width={14} style={{ padding: "30px" }}>
            <Header as="h2">
              Person Information
            </Header>

            <Card fluid>
              <Card.Content>
                <Card.Header>
                  {role === "company"
                    ? "Company Account"
                    : "Voter Account"}
                </Card.Header>

                <Card.Description>
                  <p>
                    <strong>Email:</strong>{" "}
                    {role === "company"
                      ? company_email
                      : voter_email}
                  </p>

                  <p>
                    <strong>Election Address:</strong>{" "}
                    {election_address}
                  </p>
                </Card.Description>
              </Card.Content>
            </Card>

            <br />

            <Card fluid>
              <Card.Content>
                <Card.Header>
                  Change Password
                </Card.Header>

                <br />

                <Form>
                  <Form.Input
                    type="password"
                    label="Old Password"
                    value={this.state.old_password}
                    onChange={(e) =>
                      this.setState({
                        old_password:
                          e.target.value,
                      })
                    }
                  />

                  <Form.Input
                    type="password"
                    label="New Password"
                    value={this.state.new_password}
                    onChange={(e) =>
                      this.setState({
                        new_password:
                          e.target.value,
                      })
                    }
                  />

                  <Button
                    primary
                    loading={this.state.loading}
                    onClick={this.changePassword}
                  >
                    Change Password
                  </Button>

                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => Router.back()}
                  >
                    Back
                  </Button>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(PersonInfor);