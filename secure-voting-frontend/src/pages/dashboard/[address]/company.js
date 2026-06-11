import React, { Component } from "react";

import api from "../../../services/api";
import Cookies from "js-cookie";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";

import Layout from "../../../../components/Layout";
import SidebarMenu from "../../../../components/SidebarMenu";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import {
  Grid,
  Icon,
  Menu,
  Sidebar,
  Header,
  Button,
  Step,
  Card,
  Table,
} from "semantic-ui-react";

class CompanyDashboard extends Component {
  state = {
    loading: false,
    elections: [],

    election_address: "",
    election_name: "",
    election_desc: "",

    totalRegisteredVoters: 0,
    voters: 0,
    candidates: 0,

    graphEmail: [],
    graphVotes: [],
  };

  async componentDidMount() {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please login first");
        Router.push("/company_login");
        return;
      }

      const meRes = await api.get("/auth/me");
      console.log(meRes.data);
    //   const candidateRes = await api.get("/candidates");
    //   const voterRes = await api.get("/voters");

    //   const candidates = candidateRes.data.data || [];
    //   const voters = voterRes.data.data || [];

      this.setState({
        election_address: meRes.data.data._id,
        election_name: "Secure Voting System",
        election_desc: `Company Dashboard - ${meRes.data.data.fullName}`,

        // totalRegisteredVoters: voters.length,
        // voters: voters.length,
        // candidates: candidates.length,

        // graphEmail: candidates.map((c) => c.fullName || c.email),
        // graphVotes: candidates.map((c) => c.voteCount || 0),
      });
    } catch (err) {
      console.log(err);
      alert("Session expired");
      Router.push("/company_login");
    }
  }

  signOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    Cookies.remove("accessToken");
    Router.push("/homepage");
  };

  endElection = async () => {
    alert("End Election API not implemented yet");
  };

  renderGraph() {
    const data = {
      labels: this.state.graphEmail,
      datasets: [
        {
          label: "Vote Counts",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 2,
          data: this.state.graphVotes,
        },
      ],
    };

    return <Bar data={data} />;
  }

  render() {
    return (
      <div>
        <Head>
          <title>Dashboard</title>
        </Head>

        <Grid>
          <Grid.Row>
          <Grid.Column width={2}>
            <SidebarMenu address={this.state.election_address} />
          </Grid.Column>

            <Layout>
              <Grid.Column width={14}>
                <Header as="h2">
                  <Icon name="address card" />
                  <Header.Content>
                    {this.state.election_name}
                    <Header.Subheader>
                      {this.state.election_desc}
                    </Header.Subheader>
                  </Header.Content>
                </Header>

                <Button
                  color="red"
                  onClick={this.endElection}
                  loading={this.state.loading}
                >
                  End Election
                </Button>

                <Step.Group>
                  <Step
                    icon="users"
                    title="Voters"
                    description={
                      this.state.totalRegisteredVoters
                    }
                  />
                  <Step
                    icon="user outline"
                    title="Candidates"
                    description={this.state.candidates}
                  />
                  <Step
                    icon="chart bar outline"
                    title="Total Votes"
                    description={this.state.voters}
                  />
                </Step.Group>

                <div style={{ marginTop: 30 }}>
                  {this.renderGraph()}
                </div>
              </Grid.Column>
            </Layout>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default CompanyDashboard;