<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/DavidAngell/discord-lmgtfy">
    <img src="images/logo.png" alt="Logo" width="96">
  </a>

  <h3 align="center">Discord "Let Me Google That For You" Bot</h3>

  <p align="center">
    A Discord bot that lets you create a "Let Me Google That For You" gif with a slash command
    <br />
    <br />
    <a href="https://github.com/DavidAngell/discord-lmgtfy/issues">Report Bug</a>
    ·
    <a href="https://github.com/DavidAngell/discord-lmgtfy/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
        <a href="#running-bot">Running Bot</a>
        <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#installation">Installation</a></li>
            <li><a href="#running">Running</a></li>
        </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

![Example GIF][product-screenshot]

This is a Discord bot that lets you create a "Let Me Google That For You" gif with a slash command. I created this while I was supposed to be studing for my finals lol. It uses puppeteer to load [Let Me Google That](https://letmegooglethat.com/), puppeteer-screen-recorder to record the page, and then ffmpeg to convert the video to a gif. Finally, it @'s the user being shamed and uploads the gif to the channel.

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

### Built With

[![Discord][discord.com]][discord-url]
[![Zod][zod.dev]][zod-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- RUNNING BOT -->
## Running Bot
### Prerequisites
* [Node.js](https://nodejs.org/en/)
* TypeScript
  ```sh
  npm install -g typescript
  ```
* [Discord Bot Token](https://discord.com/developers/applications): You will need to create a Discord app and bot. You can follow [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) to create your bot and get your token.

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/DavidAngell/discord-lmgtfy
   cd discord-lmgtfy
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Rename `.env.example` to `.env` and fill in the information you got from the prerequisites

### Running
1. Register your slash commands with Discord (you will need to do this every time you add a new command)
    ```sh
    npm run register
    ```
2. Start the bot
    ```sh
    npm start
    ```

<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this site, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE`]() for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## ContactLICENSE

David Angell - [@DavidJAngell42](https://twitter.com/DavidJAngell42) - davidjangell42@gmail.com


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Let Me Google That](https://letmegooglethat.com/)

* [Othneil Drew's README Template](https://github.com/othneildrew/Best-README-Template)

* [Simple Badges](https://badges.pages.dev/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/DavidAngell/discord-lmgtfy.svg?style=for-the-badge
[contributors-url]: https://github.com/DavidAngell/discord-lmgtfy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/DavidAngell/discord-lmgtfy.svg?style=for-the-badge
[forks-url]: https://github.com/DavidAngell/discord-lmgtfy/network/members
[stars-shield]: https://img.shields.io/github/stars/DavidAngell/discord-lmgtfy.svg?style=for-the-badge
[stars-url]: https://github.com/DavidAngell/discord-lmgtfy/stargazers
[issues-shield]: https://img.shields.io/github/issues/DavidAngell/discord-lmgtfy.svg?style=for-the-badge
[issues-url]: https://github.com/DavidAngell/discord-lmgtfy/issues
[license-shield]: https://img.shields.io/github/license/DavidAngell/discord-lmgtfy.svg?style=for-the-badge
[license-url]: https://github.com/DavidAngell/discord-lmgtfy/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/the_answer.gif
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
<!-- [Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com -->
[discord.com]: https://img.shields.io/badge/Discord-5865F2?logo=discord&logoColor=fff&style=for-the-badge
[discord-url]: https://discord.com
[zod.dev]: https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=fff&style=for-the-badge
[zod-url]: https://zod.dev