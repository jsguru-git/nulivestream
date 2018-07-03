import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      channels: []
  };
  }
  async componentDidMount() {
    // if (!this.props.isAuthenticated) {
    //   alert('not auth!')
    //   console.log(this.props)
    //   return;
    // }

    try {
      const channels = await this.channels();
      this.setState({ channels })
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  channels() {
    return API.get("channel", "/channels");
  }

  handleChannelClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderchannelsList(channels) {
    return [{}].concat(channels).map(
      (channel, i) =>
        i !== 0
          ? <ListGroupItem
              key={channel.channel_id}
              href={`/channels/${channel.channel_id}`}
              onClick={this.handleChannelClick}
              header={channel.name}
            >
              {"Created: " + new Date(channel.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/channels/new"
              onClick={this.handleChannelClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new Channel
              </h4>
            </ListGroupItem>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple channel taking app</p>
      </div>
    );
  }

  renderchannels() {
    return (
      <div className="channels">
        <PageHeader>Your channels</PageHeader>
        <ListGroup className="channels">
          {!this.state.isLoading && this.renderchannelsList(this.state.channels)}
        </ListGroup>
      </div>
    );
  }

  render() {

    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderchannels() : this.renderLander()}
      </div>
    );
  }
}
