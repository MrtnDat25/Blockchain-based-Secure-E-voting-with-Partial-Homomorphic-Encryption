import React, { Component } from 'react';
import { Grid, Table, Button, Form, Image, Header, Icon, Menu, Modal, Sidebar, Container, Card } from 'semantic-ui-react';
import Layout from "../../../../components/Layout";
import Cookies from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';

import * as XLSX from "xlsx"

import Head from "next/head";

import { Buffer } from "buffer";
import { uploadToPinata } from "../../../../pinata";
import api from "../../../services/api"


class VotingList extends Component { 

  state = {
    candidates: [],
    item: [],

    cand_name: "",
    cand_email: "",

    buffer: null,

    loading: false,
  };

async componentDidMount() {
  try {

    const res =
      await api.get("/candidates");

    const candidates =
      res.data.data || [];

    const item =
      candidates.map((candidate) => ({
        header:
          candidate.fullName,

        description:
          candidate.email,

        image:
          candidate.imageCid
            ? `https://gateway.pinata.cloud/ipfs/${candidate.imageCid}`
            : null,
      }));

    this.setState({
      candidates,
      item,
    });

  } catch (err) {
    console.log(err);
  }
}
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
        return (<Card.Group items={this.state.item}/>)
    } 

    captureFile = (event) => {
      event.stopPropagation();
      event.preventDefault();

      const file = event.target.files[0];

      if (!file) {
        alert("No file selected");
        return;
      }

      let reader = new FileReader();

      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        const buffer = Buffer.from(reader.result);

        this.setState({
          file: file,
          buffer: buffer
        });
      };
    };

loadCandidates = async () => {
  try {
    const add = Cookies.get("address");

    const election = Election(add);

    const c = await election.methods.getNumOfCandidates().call();

    let candidates = [];

    for (let i = 0; i < c; i++) {
      candidates.push(
        await election.methods.getCandidate(i).call()
      );
    }

    const items = candidates.map((candidate) => {
      return {
        header: candidate[0],
        description: candidate[1],
        image: (
          <Image
            src={`https://gateway.pinata.cloud/ipfs/${candidate[2]}`}
          />
        ),
        extra: (
          <div>
            <Icon name="pie graph" />
            {candidate[3].toString()}
          </div>
        ),
      };
    });

    this.setState({
      candidates,
      item: items,
    });

  } catch (err) {
    console.log(err);
  }
};



    
onSubmit = async (event) => {

  event.preventDefault();

  try {

    this.setState({
      loading: true,
    });

    const {
      cand_name,
      buffer,
    } = this.state;

    const email =
      document.getElementById("email")
      .value;

    if (
      !cand_name ||
      !email
    ) {
      alert("Missing fields");
      return;
    }

    let imageCid = "";

    if (buffer) {

      const formData =
        new FormData();

      formData.append(
        "file",
        buffer
      );

      const uploadRes =
        await api.post(
          "/upload/pinata",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      imageCid =
        uploadRes.data.cid;
    }

    await api.post(
      "/candidates",
      {
        fullName:
          cand_name,

        email,

        imageCid,
      }
    );

    alert(
      "Candidate added"
    );

    await this.componentDidMount();

    this.setState({
      cand_name: "",
      loading: false,
    });

  } catch (err) {

    console.log(err);

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
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin' style={{ backgroundColor: 'white', borderWidth: "10px" }}>
          <Menu.Item  style={{ color: 'grey' }} >
          <h2>MENU</h2><hr/>
          </Menu.Item>      
          <Link href={
            {
              pathname : "/election/[address]/company_dashboard",
              query : { address: Cookies.get('address')}
            }
          }>
          
          
            <Menu.Item style={{ color: 'grey' }}>
              <Icon name='dashboard'/>
              Dashboard
            </Menu.Item>
          
            </Link>
            <Link href={
            {
              pathname : "/election/[address]/candidate_list",
              query : { address: Cookies.get('address')}
            }
          }>
       
            <Menu.Item  style={{ color: 'grey' }}>
              <Icon name='user outline' />
              Candidate List
            </Menu.Item>
        
            </Link>
            <Link href={
            {
              pathname : "/election/[address]/voting_list",
              query : { address: Cookies.get('address')}
            }
          }>
         
            <Menu.Item  style={{ color: 'grey' }}>
              <Icon name='list' />
              Voter List
            </Menu.Item>
           
            </Link>

            <Link
              href={{
                pathname: "/election/[address]/person_infor",
                query: { address: Cookies.get("address") },
              }}
            >
      
                <Menu.Item as="a" style={{ color: "grey" }}>
                  <Icon name="id card" />
                  Person Information
                </Menu.Item>
         
            </Link>
            <hr/>
            <Button onClick={this.signOut} style={{backgroundColor: 'white'}}>
            <Menu.Item  style={{ color: 'grey' }}>
              <Icon name='sign out' />
              Sign Out
            </Menu.Item>       
            </Button>  
          </Sidebar>
        </Sidebar.Pushable>
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
                      <table>
                      {this.renderTable()}
                      </table>                                        
                  </Container>
                </Grid.Column>
                <Grid.Column style={{ float: 'right', width: '30%' }}>
                <Container style={{marginLeft:'50px'}}>                      
                <Header as='h2' color='black' style={{ textAlign: 'center' }}>                 
                        Add Candidate
                       </Header>
                       <Card style={{width: '100%'}}>      
                       
                       <Form.Group size='large'style={{marginLeft: '15%',marginRight: '15%'}} >                       
                       <br/>
                       <Form.Input
                        fluid
                        label='Name:'
                        placeholder='Enter your name.'
                        onChange={event => this.setState({ cand_name: event.target.value })}
                        style={{ textAlign: 'center' }}
                       
                    />        
                        
                        <p>Image:</p>
                       
                        
                        <div className="ui fluid" style={{ borderWidth: '0px', marginRight: '20%' }}>
                          <input
                              type="file"
                              id="embedpollfileinput"
                              onChange={this.captureFile}
                            />

                            <label htmlFor="embedpollfileinput">
                              Upload image
                            </label>
                        </div><br /><br /><br />
                        <p>Description:</p>
                        <Form.Input as='TextArea'
                         fluid
                         label='Description:'                         
                         placeholder='Describe here.'
                         style={{width: '100%'}}
                         centered={true}
                         onChange={event => this.setState({ cand_desc: event.target.value })}
                          />
                       <br/><br/>
                       <p>E-mail ID: </p>
                       <Form.Input fluid
                         id="email"
                         placeholder="Enter your e-mail"
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