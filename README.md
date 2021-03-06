[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/6CCS3PRJ/server">
    <img src="docs/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Server</h3>

  <p align="center">
    Web server for a WiFi based contact tracing application, developed as part of <a href="https://github.com/danilo-delbusso"><b>@danilo-delbusso</b></a>'s a final year project
    <br />
    <a href="https://github.com/6CCS3PRJ/server/issues">Report Bug</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


## About The Project

This project contains a NodeJS based REST API to interface with the MongoDB backend provided for the WiFi contact tracing project.

Automatically generated documentation can be accessed at [localhost:4863/api-docs](http://localhost:4683/api-docs) once the project has started.

<p align="center">
  <img alt="" src="docs/screenshot-1.png" width="80%">
</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Installation for this project are described for linux. For other operating systems, please refer to the links provided.

* [Node.js](https://nodejs.org/en/)
* [npm](http://npmjs.com/)

It is suggested to install Node.js and npm using [nvm](https://github.com/nvm-sh/nvm#install--update-script).

### Installation

To install, first clone the repository

```zsh
git clone https://github.com/6CCS3PRJ/server.git
```

Then download all dependencies

```zsh
npm install
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

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/6CCS3PRJ/server/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create.


The repo itself is just used to show the project. It is **NOT** actively maintained. The author suggests forking the project instead of opening new issues.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Danilo Del Busso - [@danilo_delbusso](https://twitter.com/danilo_delbusso)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/6CCS3PRJ/server.svg?style=for-the-badge
[contributors-url]: https://github.com/6CCS3PRJ/server/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/6CCS3PRJ/server.svg?style=for-the-badge
[forks-url]: https://github.com/6CCS3PRJ/server/network/members
[stars-shield]: https://img.shields.io/github/stars/6CCS3PRJ/server.svg?style=for-the-badge
[stars-url]: https://github.com/6CCS3PRJ/server/stargazers
[issues-shield]: https://img.shields.io/github/issues/6CCS3PRJ/server.svg?style=for-the-badge
[issues-url]: https://github.com/6CCS3PRJ/server/issues
[license-shield]: https://img.shields.io/github/license/6CCS3PRJ/server.svg?style=for-the-badge
[license-url]: https://github.com/6CCS3PRJ/server/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/danilo-delbusso/