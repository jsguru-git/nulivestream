import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Grid, Row, Col, PageHeader } from "react-bootstrap";
import VideoPlayer from "../components/VideoPlayer";

export default class Channels extends Component {
  constructor(props) {
    super(props);

    this.logo_image = null;
    this.poster_iamge = null;

    this.state = {
      isLoading: true,
      server: "",
      channel: null,
      name: "",
      logoURL: null,
      posterURL: null
    };
  }

  async componentDidMount() {
    try {
      let logoURL;
      let posterURL;

      const channel = await this.getChannel();
      const { logo_image, poster_image } = channel[0];

      const server = await this.getServer();
      if (logo_image) {
        logoURL = await Storage.vault.get(logo_image);
    }

      if (poster_image) {
        posterURL = await Storage.vault.get(poster_image);
      }

      console.log(posterURL)
      this.setState({
        server: server[0],
        channel: channel[0],
        logoURL,
        posterURL,
        isLoading: false
      });
    } catch (e) {
      alert(e);
    }
  }

  getChannel() {
    return API.get("channel", `/channel/${this.props.match.params.id}`);
  }

  getServer() {
    return API.get("channel", `/server`);
  }

  getLogs() {
    return API.get("channel", `/logs/${this.props.match.params.id}`);
  }

  renderServerDetails(server){
      return
  }

  renderVideoPlayer(channel, server){
      console.log(this.state.posterURL)
      console.log(channel)
      console.log(server)
      // const videoJsOptions = {
      //     autoplay: true,
      //     controls: true,
      //     sources: [{
      //       // src: 'https://'+server.cdn_adress+'/'+channel.streamkey+'/'+channel.streamkey+'.m3u8',
      //       src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
      //       type: '"application/x-mpegURL"'
      //   }],
      //     poster: this.state.posterURL,
      //   }
      // return <VideoPlayer { ...videoJsOptions } />

      const videoJsOptions = {
        isVideoChild: true,
        src: 'https://'+server.cdn_adress+'/'+channel.streamkey+'/'+channel.streamkey+'.m3u8',
        type: "application/x-mpegURL",
        poster: this.state.posterURL,
        logo: this.state.logoURL,
      }

      // return (
      //   <VideoPlayer
      //     isVideoChild
      //     src="https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
      //   />
      // );
      return (
        <VideoPlayer { ...videoJsOptions } />
      );
  }

  renderChannel(){
      return(
      <Grid>
      <PageHeader>{this.state.channel.name}</PageHeader>

        <Row>
          <Col xs={12} md={8}>
              <div className="channel_player">
                {this.renderVideoPlayer(this.state.channel, this.state.server)}
              </div>
          </Col>
          <Col xs={6} md={4}>
              <div className="server_details">
                {this.renderServerDetails(this.state.server)}
              </div>
          </Col>
        </Row>
      </Grid>
      );
  }

  render() {
    return (
      <div className="channels">
        <div>
          {!this.state.isLoading && this.renderChannel()}
        </div>
      </div>
    );
  }
}
