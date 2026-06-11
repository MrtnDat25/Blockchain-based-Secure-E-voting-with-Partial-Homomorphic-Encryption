import React, { Component } from 'react';
import { Grid, Table, Button, Form, Image, Header, Icon, Menu, Modal, Sidebar, Container, Card } from 'semantic-ui-react';
import Layout from "../../../../components/Layout";
import Cookies from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';

import * as XLSX from "xlsx"

import Head from "next/head";

import { uploadToPinata } from "../../../services/pinata";
import api from "../../../services/api"

import { withRouter } from "next/router";
import SidebarMenu from '../../../../components/SidebarMenu';

class VotingList extends Component { 

    state = {
      candidates: [],
      item: [],
      election_address: "",

      cand_name: "",
      cand_desc: "",

      file: null,

      loading: false,
    };

async componentDidMount() {
  try {

    const electionId = localStorage.getItem("electionId");
    if (!electionId) {
    console.log("Missing electionId");
    return;
  }
console.log(
  "electionId:",
  localStorage.getItem("electionId")
);

    const meRes = await api.get("auth/me");
    this.setState({election_address: meRes.data.data._id})
    const res = await api.get(
      `/candidates?electionId=${electionId}`
    );

    const candidates = res.data.data || [];

    const item = candidates.map((candidate) => ({
      header: candidate.fullName,
      description: candidate.email,

      image: candidate.imageCid
        ? `https://gateway.pinata.cloud/ipfs/${candidate.imageCid}`
        : "/avatar.png",

      extra: candidate.bio || "",
    }));

    this.setState({
      candidates,
      item,
    });

  } catch (err) {
    console.log(err);
  }
}

captureFile = (event) => {
  const file = event.target.files[0];

  this.setState({
    file,
  });
};


    getElectionDetails = () => {
        const {
            election_name,
            election_description
        } = this.state;
    
        return (
          <div style={{marginLeft: '45%',marginBottom: '2%',marginTop: '2%'}}>
            <Header as="h2">
              <Icon name="address card" />
              <Header.Content>
                {election_name}
                <Header.Subheader>{election_description}</Header.Subheader>
              </Header.Content>
            </Header>
          </div>
        );
      }

    renderTable = () => {
        return (<Card.Group>
        {this.state.candidates.map((candidate) => (
          <Card key={candidate._id}>
            <Image
              src={
                candidate.imageCid
                  ? `https://gateway.pinata.cloud/ipfs/${candidate.imageCid}`
                  : "/avatar.png"
              }
            />

            <Card.Content>
              <Card.Header>
                {candidate.fullName}
              </Card.Header>

              <Card.Meta>
                {candidate.email}
              </Card.Meta>

              <Card.Description>
                {candidate.bio}
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>)
          } 


    
onSubmit = async (event) => {

  event.preventDefault();

  try {

    this.setState({
      loading: true,
    });

    const name = this.state.cand_name;

    const email =
      document.getElementById("email").value;

    const bio =
      this.state.cand_desc;

    if (!name || !email) {
      alert("Missing fields");
      return;
    }

    let imageCid = "";

    if (this.state.file) {
      imageCid = await uploadToPinata(
        this.state.file
      );
    }

    const electionId =
      localStorage.getItem("electionId");
    const res = await api.get(
      `/candidates?electionId=${electionId}`
    );

    await api.post(
      "/candidates",
      {
        electionId,
        name,
        email,
        bio,
        imageCid,
      }
    );

    alert("Candidate added");

    await this.componentDidMount();

    this.setState({
      cand_name: "",
      cand_desc: "",
      file: null,
      loading: false,
    });

  } catch (err) {

    console.log(err);
      console.log("STATUS:", err.response?.status);
  console.log("DATA:", err.response?.data);
  console.log("ERROR:", err);
    alert(
      err.response?.data?.message ||
      "Add candidate failed"
    );

    this.setState({
      loading: false,
    });
  }
};
    
    SidebarExampleVisible = () => (
        <SidebarMenu address={this.state.election_address} />
      )
signOut = () => {
	Cookies.remove('address');
	Cookies.remove('company_email');
	Cookies.remove('company_id');

	alert('Logging out.');

	Router.push('/homepage');
};
  

  render() {
      const {Body, Row, HeaderCell, Header} = Table;
    return (
      <div>
          <Head>
            <title>Candidate list!</title>
            <link rel="shortcut icon" type="image/x-icon" href="../../public/logo3.png" />
          </Head>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              {this.SidebarExampleVisible()}
            </Grid.Column>
            <Layout>
                {this.getElectionDetails()}                      
              <br />
              <br />
              <Grid.Column width={14} style={{ minHeight: '630px' }}>
                <Grid.Column style={{ float: 'left', width: '60%' }}>
                  <Header as='h2' color='black'>
                    Candidate List
              </Header>
                  <Container>                      
                      
                      {this.renderTable()}
                                                              
                  </Container>
                </Grid.Column>
                <Grid.Column style={{ float: 'right', width: '30%' }}>
                <Container style={{marginLeft:'50px'}}>                      
                <Header as='h2' color='black' style={{ textAlign: 'center' }}>                 
                        Add Candidate
                       </Header>
                       <Card style={{width: '100%'}}>      
                       <Form></Form>
                       <Form.Group size='large'style={{marginLeft: '15%',marginRight: '15%'}} >                       
                       <br/>
                      <Form.Input
                          fluid
                          label="Name"
                          placeholder="Enter candidate name"
                          value={this.state.cand_name}
                          onChange={(e) =>
                            this.setState({
                              cand_name: e.target.value,
                            })
                          }
                        />      
                        
                        <p>Image:</p>
                       
                        
                        <div className="ui fluid" style={{ borderWidth: '0px', marginRight: '20%' }}>
                          <input
                              type="file"
                              accept="image/*"
                              onChange={this.captureFile}
                            />

                            <label htmlFor="embedpollfileinput">
                              Upload image
                            </label>
                        </div><br /><br /><br />
                        <p>Description:</p>
                        <Form.TextArea
                          label="Description"
                          placeholder="Describe candidate"
                          onChange={(e) =>
                            this.setState({
                              cand_desc: e.target.value,
                            })
                          }
                        />
                       <br/><br/>
                       <p>E-mail ID: </p>
                       <Form.Input
                          id="email"
                          fluid
                          placeholder="Candidate Email"
                        />
                       <br/>
                       <Button primary onClick={this.onSubmit} loading={this.state.loading} style={{marginBottom: '10px',marginBottom: '10px'}}>Register</Button>
                        </Form.Group>                                  
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


export default VotingList