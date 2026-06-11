import React, { Component } from "react";
import { Menu, Sidebar, Icon, Button } from "semantic-ui-react";
import Link from "next/link";
import Cookies from "js-cookie";

class SidebarMenu extends Component {
  signOut = () => {
    Cookies.remove("address");
    Cookies.remove("company_email");
    Cookies.remove("company_id");

    alert("Logging out...");
    window.location.href = "/homepage";
  };

  render() {
    const address =
      this.props.address || Cookies.get("address");

    return (
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          vertical
          visible
          width="thin"
          style={{ backgroundColor: "white" }}
        >
          <Menu.Item style={{ color: "grey" }}>
            <h2>MENU</h2>
            <hr />
          </Menu.Item>

          <Link href={`/dashboard/${address}/company`}>
            <Menu.Item style={{ color: "grey" }}>
              <Icon name="dashboard" />
              Dashboard
            </Menu.Item>
          </Link>

          <Link href={`/election/${address}/candidate_list`}>
            <Menu.Item style={{ color: "grey" }}>
              <Icon name="user outline" />
              Candidate List
            </Menu.Item>
          </Link>

          <Link href={`/election/${address}/voting_list`}>
            <Menu.Item style={{ color: "grey" }}>
              <Icon name="list" />
              Voter List
            </Menu.Item>
          </Link>

          <Link href={`/election/${address}/person_infor`}>
            <Menu.Item style={{ color: "grey" }}>
              <Icon name="id card" />
              Person Information
            </Menu.Item>
          </Link>

          <hr />

          <Button onClick={this.signOut} style={{ backgroundColor: "white" }}>
            <Menu.Item style={{ color: "grey" }}>
              <Icon name="sign out" />
              Sign Out
            </Menu.Item>
          </Button>
        </Sidebar>
      </Sidebar.Pushable>
    );
  }
}

export default SidebarMenu;