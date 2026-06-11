import React, { Component } from "react";

import {
  Grid,
  Header,
  Button,
  Form,
  Icon,
  Menu,
  Sidebar,
  Container,
  Card,
} from "semantic-ui-react";

import Layout from "../../../../components/Layout";
import SidebarMenu from "../../../../components/SidebarMenu";

import Cookies from "js-cookie";

import Link from "next/link";

import Head from "next/head";

import Router from "next/router";

import { withRouter } from "next/router";
import api from "../../../services/api"

class VotingList extends Component {

  state = {
    loading: false,

    election_address:
      Cookies.get("address"),

    election_name: "",

    election_description: "",

    voters: [],

    item: [],
  };

async componentDidMount() {
  try {

    const electionId =
      localStorage.getItem("electionId");

    if (!electionId) {
      console.log("Missing electionId");
      return;
    }

    const meRes =
      await api.get("/auth/me");

    const res =
      await api.get(
        `/voters?electionId=${electionId}`
      );

    const voters =
      res.data.data || [];

    const items =
      voters.map((voter) => ({
        header:
          voter.fullName || voter.email,

        description:
          voter.email,

        extra: (
          <Button
            negative
            basic
            onClick={() =>
              this.deleteVoter(
                voter._id
              )
            }
          >
            Delete
          </Button>
        ),
      }));

    this.setState({
      election_address:
        meRes.data.data._id,

      voters,
      item: items,
    });

  } catch (err) {

    console.log(err);
  }
}

  loadVoters = async () => {

    try {

      const body =
        new URLSearchParams({
          election_address:
            this.state
              .election_address,
        });

      const res = await fetch(
        "/api/voter",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: body.toString(),
        }
      );

      const data =
        await res.json();

      const voters =
        data?.data?.voters || [];

      const items =
        voters.map((voter) => {

          return {

            header:
              voter.email,

            description: (
              <div>
                <Button
                  negative
                  basic
                  onClick={() =>
                    this.deleteEmail(
                      voter._id
                    )
                  }
                >
                  Delete
                </Button>
              </div>
            ),
          };
        });

      this.setState({
        voters,
        item: items,
      });

    } catch (err) {

      console.error(err);
    }
  };

deleteVoter = async (id) => {

  try {

    await api.delete(
      `/voters/${id}`
    );

    alert(
      "Deleted successfully"
    );

    this.componentDidMount();

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Delete failed"
    );
  }
};

  renderTable = () => {

    return (
      <Card.Group
        items={this.state.item}
      />
    );
  };

  signOut = () => {

    Cookies.remove("address");

    Cookies.remove(
      "company_email"
    );

    Cookies.remove(
      "companyid"
    );

    alert("Logging out....");

    Router.push("/homepage");
  };

 register = async (event) => {

  event.preventDefault();

  try {

    this.setState({
      loading: true,
    });

    const email =
      document
        .getElementById(
          "register_voter_email"
        )
        .value;

    if (!email) {

      alert("Missing email");
      return;
    }

    const electionId =
      localStorage.getItem(
        "electionId"
      );

    await api.post(
      "/voters",
      {
        electionId,
        email,
      }
    );

    alert(
      "Voter added"
    );

    await this.componentDidMount();

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Register failed"
    );

  }

  this.setState({
    loading: false,
  });
};

handleExcelImport = async (
  event
) => {

  const file =
    event.target.files[0];

  if (!file) return;

  try {

    this.setState({
      loading: true,
    });

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "electionId",
      localStorage.getItem(
        "electionId"
      )
    );

    const response =
      await api.post(
        "/voters/import",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    alert(
      `Imported ${response.data.inserted} voters`
    );

    this.componentDidMount();

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Import failed"
    );
  }

  this.setState({
    loading: false,
  });
};

  SidebarExampleVisible = () => (

    <SidebarMenu address={this.state.election_address} />
  );

  render() {

    return (

      <div>

        <Head>

          <title>
            Voting list
          </title>

          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="../../public/logo3.png"
          />

        </Head>

        <Grid>

          <Grid.Row>

            <Grid.Column width={2}>
              {
                this
                  .SidebarExampleVisible()
              }
            </Grid.Column>

            <Layout>

              <br />

              <br />

              <Grid.Column
                width={14}
                style={{
                  minHeight:
                    "630px",
                }}
              >

                <Grid.Column
                  style={{
                    float: "left",
                    width: "60%",
                  }}
                >

                  <Header
                    as="h2"
                    color="black"
                  >
                    Voter List
                  </Header>

                  {
                    this.renderTable()
                  }

                </Grid.Column>

                <Grid.Column
                  style={{
                    float: "right",
                    width: "30%",
                  }}
                >

                  <Container>

                    <Header
                      as="h2"
                      color="black"
                    >
                      Register Voter
                    </Header>

                    <Card
                      style={{
                        width: "100%",
                      }}
                    >

                      <br />

                      <Form
                        size="large"
                        style={{
                          marginLeft:
                            "15%",

                          marginRight:
                            "15%",
                        }}
                      >

                        <Form.Input
                          fluid
                          id="register_voter_email"
                          label="Email:"
                          placeholder="Enter voter email"
                        />

                        <br />

                        <Button
                          primary
                          loading={
                            this.state
                              .loading
                          }
                          onClick={
                            this.register
                          }
                          style={{
                            marginBottom:
                              "15px",
                          }}
                        >
                          Register
                        </Button>

                        <br />

                        <p>
                          Import Excel
                        </p>

                        <input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={
                            this
                              .handleExcelImport
                          }
                        />

                      </Form>

                    </Card>

                  </Container>

                </Grid.Column>

              </Grid.Column>

            </Layout>

          </Grid.Row>

        </Grid>

      </div>
    );
  }
}

export default withRouter(
  VotingList
);