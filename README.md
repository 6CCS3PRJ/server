[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/wifi-tracing/server">
    <img src="docs/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Server</h3>

  <p align="center">
    Web server for a WiFi based contact tracing application, developed as part of <a href="https://github.com/danilo-delbusso"><b>@danilo-delbusso</b></a>'s a final year project
    <br />
    <a href="https://github.com/wifi-tracing/server/issues">Report Bug</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
 <ul>
<li><a href="#about-the-project">About The Project</a><ul>
<li><a href="#getting-started">Getting Started</a></li>
<li><a href="#prerequisites">Prerequisites</a></li>
</ul>
</li>
<li><a href="#installation">Installation</a><ul>
<li><a href="#docker-installation">Docker installation</a></li>
<li><a href="#local-installation">Local installation</a></li>
<li><a href="#installation-on-an-aws-ec2-instance">Installation on an AWS EC2 instance</a><ul>
<li><a href="#connect-to-ec2-instance">Connect to EC2 instance</a></li>
<li><a href="#install-mongodb">Install mongodb</a></li>
<li><a href="#install-node-and-npm-using-nvm">Install Node and npm using nvm</a></li>
<li><a href="#clone-repository-with-github-cli">Clone repository with Github CLI</a></li>
<li><a href="#initialise-repository">Initialise Repository</a></li>
<li><a href="#install-pm2">Install PM2</a></li>
<li><a href="#start-application">Start application</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#roadmap">Roadmap</a></li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#license">License</a></li>
<li><a href="#contact">Contact</a></li>
</ul>

</ul>

</details>

## About The Project

This project contains a NodeJS based REST API to interface with the MongoDB backend provided for the WiFi contact
tracing project.

Automatically generated documentation can be accessed at [localhost:4863/api-docs](http://localhost:4683/api-docs) once
the project has started.

<p align="center">
  <img alt="" src="docs/screenshot-1.png" width="80%">
</p>

<!-- GETTING STARTED -->

### Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Installation for this project are described for linux. For other operating systems, please refer to the links provided.

* [Node.js](https://nodejs.org/en/)
* [npm](http://npmjs.com/)

It is suggested to install Node.js and npm using [nvm](https://github.com/nvm-sh/nvm#install--update-script).

## Installation

### Docker installation

This installation is the fastest, but requires [docker](https://docs.docker.com/engine/install/#server)
and [docker-compose](https://docs.docker.com/compose/install/#prerequisites).

Once installed run

```zsh
docker-compose up --build
```

And that's it! The server is running on `localhost:4683`

### Local installation

This installation is suggested for development.

```zsh
git clone https://github.com/wifi-tracing/server.git
```

Then download all dependencies

```zsh
npm install
```

Import the public key used by the package management system

```zsh
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
```

Add sources

```zsh
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
```

Install MongoDB

```zsh
sudo apt update && sudo apt install -y mongodb-org
```

Start and verify the service

```zsh
sudo systemctl start mongod
sudo systemctl status mongod
```

Enable service restart on every reboot

```zsh
sudo systemctl enable mongod
```

Finally, start the server using

```zsh
npm start
```

Or, for a prettified view of the live API logs, run

```zsh
npm run dev
```

The server will start at [http://localhost:4863](http://localhost:4863)

### Installation on an AWS EC2 instance

This guide assumes you'll have started the EC2 instance already. For a guide on how to do it please refer
to [AWS's Documentation](https://docs.aws.amazon.com/quickstarts/latest/vmlaunch/step-1-launch-instance.html)

#### Connect to EC2 instance

1. Open an SSH client.
2. Locate your private key file. The key used to launch this instance is key.pem
3. Run this command, if necessary, to ensure your key is not publicly viewable.

```zsh
 chmod 400 key.pem
```

Connect to your instance using its Public DNS:

Example:

```zsh
 ssh -i "key.pem" ubuntu@ec2-ip-address.eu-west-2.compute.amazonaws.com
```

#### Install docker and docker-compose

For docker use

```zsh
sudo snap install docker
```

For docker-compose follow instructions [here](https://docs.docker.com/compose/install/#prerequisites)

#### Build Docker image and run it

```zsh
sudo docker-compose up --build
```

#### Initialise Repository

```zsh
npm i
```

The .env file is added for simplicity's sake. But it is important to  **CHANGE THE VALUES** for security reasons.

This is an overview of the used .env values:

| Name                         | Default Value                                                | Description                                                     |
| ---------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| PORT                         | 4683                                                         | The port the server is going to run on                          |
| CLIENT_ORIGIN_URL            | http://localhost:3000                                        | The URL of the client in development mode                       |
| CLIENT_ORIGIN_URL_PRODUCTION | http://localhost:3000                                        | The URL of the client in production mode                        |
| DATABASE_URL                 | mongodb://localhost:27017/prj                                | The URL of the MongoDB to connect to                            |
| ENGLAND_GEOJSON_URL          | https://martinjc.github.io/UK-GeoJSON/json/eng/topo_wpc.json | The URL of the GeoJSON file containing England's county data    |
| TOKEN_KEY                    | uzTxjqj0SRG6QHkjMdKM9h98iEAxYL3S                             | The private key used to generate, verify, and decode JWT tokens |
| TOKEN_EXPIRATION_TIME        | 1m                                                           | The time of expiry of generate JWT tokens                       |
| API_PREFIX                   | /api/v1/                                                     | The prefix for the REST api                                     |

#### Install PM2

```zsh
npm install pm2@latest -g
```

#### Start application

```zsh
pm2 start npm --name "server" -- start
```

More information about PM2's configuration can be found on
their [official documentation](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/wifi-tracing/server/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create.

The repo itself is just used to show the project. It is **NOT** actively maintained. The author suggests forking the
project instead of opening new issues.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Danilo Del Busso - [@danilo_delbusso](https://twitter.com/danilo_delbusso)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/wifi-tracing/server.svg?style=for-the-badge

[contributors-url]: https://github.com/wifi-tracing/server/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/wifi-tracing/server.svg?style=for-the-badge

[forks-url]: https://github.com/wifi-tracing/server/network/members

[stars-shield]: https://img.shields.io/github/stars/wifi-tracing/server.svg?style=for-the-badge

[stars-url]: https://github.com/wifi-tracing/server/stargazers

[issues-shield]: https://img.shields.io/github/issues/wifi-tracing/server.svg?style=for-the-badge

[issues-url]: https://github.com/wifi-tracing/server/issues

[license-shield]: https://img.shields.io/github/license/wifi-tracing/server.svg?style=for-the-badge

[license-url]: https://github.com/wifi-tracing/server/blob/master/LICENSE.txt

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-url]: https://www.linkedin.com/in/danilo-delbusso/
