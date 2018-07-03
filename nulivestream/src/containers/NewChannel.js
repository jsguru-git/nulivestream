import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Grid, Row, Col } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import { API } from "aws-amplify";
import "./NewChannel.css";

export default class NewNote extends Component {
    constructor(props) {
      super(props);

      this.file = {
          logo_image: '',
          poster_image: ''
      }

      this.state = {
          isLoading: null,
          channel_name: '',
          fps: '25',
          input_resolution: '720',
          input_bitrate: '3000'};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
        return this.state.channel_name.length > 0;
    }

    handleChange(event) {
      this.setState({[event.target.id]: event.target.value});
    }

    handleFileChangeLogo = event => {
        this.file.logo_image = event.target.files[0];
    }

    handleFileChangePoster = event => {
        this.file.poster_image = event.target.files[0];
    }

    handleSubmit = async event => {
      event.preventDefault();

      if (this.file.logo_image && this.file.logo_image.size > config.MAX_ATTACHMENT_SIZE) {
        alert("Please pick a logo image smaller than 5MB");
        return;
      }

      if (this.file.poster_image && this.file.poster_image.size > config.MAX_ATTACHMENT_SIZE) {
        alert("Please pick a poster smaller than 5MB");
        return;
      }

      this.setState({ isLoading: true });

      try {
        const logo_image = this.file.logo_image
        ? await s3Upload(this.file.logo_image)
        : null;

        const poster_image = this.file.poster_image
        ? await s3Upload(this.file.poster_image)
        : null;

        await this.createChannel({
          channel_name: this.state.channel_name,
          fps: this.state.fps,
          input_bitrate: this.state.input_bitrate,
          input_resolution: this.state.input_resolution,
          logo_image,
          poster_image
        });
        this.props.history.push("/");
      } catch (e) {
        alert(e);
        this.setState({ isLoading: false });
      }
    }

    createChannel(channel) {
      console.log(channel)
      return API.post("channel", "/channel", {
        body: channel
      });
    }

    render() {
      return (
          <Grid>
            <div className="NewChannel">
              <form onSubmit={this.handleSubmit}>
                <Row>
                  <Col xs={6} md={4}>
                    <FormGroup controlId="channel_name">
                      <ControlLabel>Channel name</ControlLabel>
                      <FormControl
                        type="text"
                        autoFocus
                        value={this.state.channel_name}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="fps">
                        <ControlLabel>Input FPS</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="Select input FPS"
                          value={this.state.fps}
                          onChange={this.handleChange}>
                        >
                          <option value="25">25</option>
                          <option value="30">30</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="input_resolution">
                        <ControlLabel>Input resolution</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="Select input resolution"
                          value={this.state.input_resolution}
                          onChange={this.handleChange}>
                        >
                          <option value="720">720</option>
                          <option value="1080">1080</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="input_bitrate">
                        <ControlLabel>Input bitrate</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="Select input bitrate"
                          value={this.state.input_bitrate}
                          onChange={this.handleChange}>
                        >
                          <option value="3000">3000</option>
                          <option value="5000">5000</option>
                          <option value="4000">4000</option>
                          <option value="2000">2000</option>
                          <option value="1000">1000</option>
                        </FormControl>
                    </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup controlId="logo_image">
                          <ControlLabel>Channel Logo</ControlLabel>
                          <FormControl onChange={this.handleFileChangeLogo} type="file" />
                        </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup controlId="poster_image">
                          <ControlLabel>Video Cover</ControlLabel>
                          <FormControl onChange={this.handleFileChangePoster} type="file" />
                        </FormGroup>
                    </Col>
                </Row>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Create"
              loadingText="Creating…"
            />
        </form>
        </div>
    </Grid>
      );
    }
  }
