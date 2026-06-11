import React, { Component } from "react";
import Link from "next/link";
import Head from "next/head";

import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
} from "semantic-ui-react";

class HomepageLayout extends Component {
  renderHero = () => {
  return (
    <div className="hero-section">
      <Menu secondary size="large" className="menu">
        <Container>
          <h1 className="logo">Election Voting</h1>
        </Container>
      </Menu>

      <div className="hero-content">
        <Header
          as="h1"
          textAlign="center"
          content="Blockchain based Secure E voting with Homomorphic Encryption."
          style={{
            fontSize: "4rem",
            fontWeight: "normal",
            color: "black",
            lineHeight: 1.4,
          }}
        />

        <Header
          as="h3"
          textAlign="center"
          content="Make your vote count!"
          style={{
            fontSize: "2rem",
            fontWeight: "normal",
            color: "grey",
            marginTop: "1.5rem",
          }}
        />

        <Grid
          columns={3}
          stackable
          style={{
            marginTop: "6rem",
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          {/* Company */}
          <Grid.Column
            textAlign="center"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Header as="h4" style={{ color: "grey" }}>
              Register / Sign in for the company
            </Header>

            <Link href="/company_login">
              <Button
                primary
                size="huge"
                style={{
                  backgroundColor: "#627eea",
                  marginTop: "1rem",
                  minWidth: "220px",
                }}
              >
                <Icon name="building" />
                Company
              </Button>
            </Link>
          </Grid.Column>

          {/* Candidate */}
          <Grid.Column
            textAlign="center"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Header as="h4" style={{ color: "grey" }}>
              Sign in for Candidates!
            </Header>

            <Link href="/candidate_login">
              <Button
                primary
                size="huge"
                style={{
                  backgroundColor: "#627eea",
                  marginTop: "1rem",
                  minWidth: "220px",
                }}
              >
                <Icon name="user circle" />
                Candidate
              </Button>
            </Link>
          </Grid.Column>

          {/* Voters */}
          <Grid.Column
            textAlign="center"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Header as="h4" style={{ color: "grey" }}>
              Sign in for Voters!
            </Header>

            <Link href="/voter_login">
              <Button
                primary
                size="huge"
                style={{
                  backgroundColor: "#627eea",
                  marginTop: "1rem",
                  minWidth: "220px",
                }}
              >
                Voters
                <Icon name="right arrow" />
              </Button>
            </Link>
          </Grid.Column>
        </Grid>
      </div>

      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          background: linear-gradient(
              rgba(255, 255, 255, 0.75),
              rgba(255, 255, 255, 0.75)
            ),
            url("/blockchain.jpg") no-repeat;
          background-size: cover;
          background-position: center;
          padding-top: 1rem;
        }

        .logo {
          width: 100%;
          text-align: center;
          color: #627eea;
          font-size: 5rem;
          font-family: "Georgia", serif;
          margin-top: 1rem;
        }

        .hero-content {
          width: 100%;
          margin-top: 8rem;
          padding: 0 2rem;
        }
      `}</style>
    </div>
  );
};

  renderFeatures = () => {
    return (
      <Segment vertical style={{ padding: "8em 0em" }}>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row columns={3}>
            <Grid.Column textAlign="center">
              <Header as="h2">Private</Header>

              <p style={{ fontSize: "1.2rem" }}>
                Doesn't give any information
                <br />
                regarding personal data.
              </p>

              <Header as="h2" style={{ marginTop: "3rem" }}>
                Secure
              </Header>

              <p style={{ fontSize: "1.2rem" }}>
                No single point of failure
                <br />
                in the voting system.
              </p>
            </Grid.Column>

            <Grid.Column textAlign="center">
              <Image
                src="../public/ether2.png"
                centered
                style={{
                  width: "220px",
                }}
              />
            </Grid.Column>

            <Grid.Column textAlign="center">
              <Header as="h2">Decentralized</Header>

              <p style={{ fontSize: "1.2rem" }}>
                Blockchain technology distributes
                <br />
                trust across the network.
              </p>

              <Header as="h2" style={{ marginTop: "3rem" }}>
                Immutable
              </Header>

              <p style={{ fontSize: "1.2rem" }}>
                Votes cannot be modified
                <br />
                after submission.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  };

  renderQuote = () => {
    return (
      <Segment
        inverted
        vertical
        style={{
          padding: "5em 0em",
          backgroundColor: "#627eea",
        }}
      >
        <Container text>
          <Header
            as="h2"
            textAlign="center"
            style={{
              color: "white",
              marginBottom: "2rem",
            }}
          >
            A fascinating quote
          </Header>

          <p
            style={{
              fontSize: "1.5rem",
              textAlign: "center",
              color: "white",
              fontStyle: "italic",
            }}
          >
            "We have elected to put our money and faith in a
            mathematical framework that is free of politics and
            human error."
          </p>

          <Header
            as="h3"
            textAlign="center"
            style={{
              color: "white",
              marginTop: "2rem",
            }}
          >
            Tyler Winklevoss
          </Header>
        </Container>
      </Segment>
    );
  };

  render() {
    return (
      <div>
        <Head>
          <title>HomePage</title>

          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />

          <link
            rel="shortcut icon"
            href="../public/logo3.png"
          />
        </Head>

        {this.renderHero()}

        {this.renderFeatures()}

        {this.renderQuote()}
      </div>
    );
  }
}

export default HomepageLayout;