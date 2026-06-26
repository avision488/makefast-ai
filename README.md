#  Makefast AI

AI-powered crazy useful terminal tool for developers and builders Developed by Avision488

```
  ███╗   ███╗ █████╗ ██╗  ██╗███████╗███████╗ █████╗ ███████╗████████╗      █████╗ ██╗
  ████╗ ████║██╔══██╗██║ ██╔╝██╔════╝██╔════╝██╔══██╗██╔════╝╚══██╔══╝     ██╔══██╗██║
  ██╔████╔██║███████║█████╔╝ █████╗  █████╗  ███████║███████╗   ██║        ███████║██║
  ██║╚██╔╝██║██╔══██║██╔═██╗ ██╔══╝  ██╔══╝  ██╔══██║╚════██║   ██║        ██╔══██║██║
  ██║ ╚═╝ ██║██║  ██║██║  ██╗███████╗██║     ██║  ██║███████║   ██║        ██║  ██║██║
  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝        ╚═╝  ╚═╝╚═╝
```

[![npm version](https://img.shields.io/npm/v/makefast-ai.svg?style=flat-square&color=00C9B1)](https://www.npmjs.com/package/makefast-ai)
[![npm downloads](https://img.shields.io/npm/dm/makefast-ai.svg?style=flat-square&color=00C9B1)](https://www.npmjs.com/package/makefast-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org)

I built MakeFast AI because I kept running into the same problem whenever I wanted to start something new.
The actual coding part usually comes later, Before that, there is a whole messy stage where I am trying to figure out what the thing even is. I try different ideas, test names write fake landing page copy, think about which stack makes sense, and sometimes just scaffold a startr project so the idea feels real enough to continue.
That repeated starting phase is what this project is for.
Makefast AI is a CLI tool that puts those early tasks in one place so I stay on the terminal and keep moving insted of bouncing between random tabs and notes.

## DEMO VIDEO
[![DEMO VIDEO](https://cdn-icons-png.flaticon.com/512/1383/1383260.png)](https://youtu.be/B746aFd9cAs)

## So what is in here?
here now, the CLI can help things like:
- startup or product ideas
- naming
- landing page copy
- UI prompt generation
- tech stack suggestion
- project scaffolding
- brainstorming
- pitch outlines
- launch tweets
- README drafts
- saved history/config stuff
The commands are small on purpose. I did not want one giant "do everything" command. I wanted seperate pieces that are simple enough to call when I need them.

## Main commands
These are the commands currently in the project that u can use:

 - `makefast idea`
 - `makefast ui`
 - `makefast copy`
 - `makefast brainstorm`
 - `makefast scaffold`
 - `makefast stack`
 - `makefast roast`
 - `makefast pitch`
 - `makefast tweet`
 - `makefast name`
 - `makefast validate`
 - `makefast readme`
 - `makefast history`
 - `makefast config`
 
 Some of them are obviously more serious than others. `roast ` exist because sometimes the fastest way to understand an idea is to hear what is weak about it.

 ## How I usually use it hihi
 Most of the time I use it in a rough sequence, not in a strict flow
 A normal session looks something like this:
 1. Generate a few ideas or angles.
 2. Try names.
 3. Check landing copy.
 4. Ask for a stack.
 5. Scaffold something if the idea still feels worth exploring.
 That is not a rule. It is just how the tool ended up fitting into my own workflow

 ## Setup
 You need Node.js, npm, and a Groq API key.
 Quick version:
 ```bash
 node -v
 npm -v
 ```
 If those work, clone the repo and install dependencies:

 ```bash
 git clone https://github.com/avision488/Makefast-ai.git
 cd Makefast-ai
 npm install
 ```
 ## `.env` file
 Create a `.env` file in the root of the project.
 ```bash
 touch .env
 ```
 Put this inside it:
 ```env
 GROQ_API_KEY=your_groq_api_key_here
 ```
 If your version of the project supports model selection thorough env vars, you can also add:
 ```env
 GROD_MODEL=llama-3.3-70b-versatile
 ```
 If you are on Windows, just create the file manually,

 ## Running it locally
 There are a few ways to run it. I ended up using all of them at different times while testing.

 ### Directly with Node
 If the entry file is `index.js`, you can run:
```bash
node index.js
```
And if the CLI accepts arguments that way:
```bash
node index.js idea
node index.js scaffold
```
If your entry file is somewhere else, use that instead.

### Through npm scripts
If your `package.json` has scripts for local dev, use them: 
```bash
npm run dev
npm run build
npm start
```
Not every repo has all of these, so just check the scripts section first.

### As a linked CLI
This is probably the nicest way to test it like a command:
```bash
npm link
makefast idea
```
That points the global command to your local version of the project.

## Installing globally

If you want to use it like a normal CLI package then do this:
```bash
npm install -gmakefast-ai
```
Then run:
```bash
makefast idea
```
You can also try:
```bash
npx makefast-ai idea
```
if your npm package config is set up for that.

## A few examples
```bash
makefast idea --niche "B2B SaaS for restaurants"
makefast copy --product "AI writing tool for marketers"
makefast stack --project "real chat app"
makefast scaffold --type nextjs
makefast brainstorm
```
## Scaffold
The scaffold command currently supports templates such as:
- `nextjs`
- `SaaS`
- `api`
- `mobile`
- `cli`
- `landing`
If this list drifts away from the codebase later, that means the README needs updating.

## Where local data goes
The CLI stores local files here:
```bash
~/.makefast
```
That usually includes config, history, logs, and cached out put.
I kept this local on purpose because I wanted the tool to remember previous runs and feel a bit less disposable.

## Things that confused me while building/testing
A few issue came up more than once, so they are worth writing down.
- If the API key is missing, most commands fail immidiately.
- If the `.env` file is there but nothing works, the project may not be loading env vars correctly.
- If `makefast` does not work after install, `npm link` or restarting the terminal usually fixes it.
- If the package name and repo name do not match cleanly, it gets confusing fast.
If `.env` values are not being picked up, the entry file may need to load them with `dotnv`.

For commonJS:
```js
require("dotenv").config();
```
For ESM:
```js
import "dotenv/config";
```

## What I was trying to make
MOre than anything, I wanted a terminal tool that was useful before the "real build" starts.
There are already plenty of tools that help once a project is well-defined. I was more interested in the part before that, where the project is still fuzzy and you are trying to shape it. That is why the commands lean toward ideation, writing, planning, and scaffolding.
I do not think of this as a magic answer machine. it is closer to a helper for getting unstuck or getting moving.

## What I learned from this project
When I started this project, I only knew basic Node and simple scripts.
This is my first "proper" CLI tool, so I learned a lot of new things step by step while building it.
Some things I learned while making MakefastAI:
- how to create CLI command in js
- how to connect Node with an AI API and send prompts from the terminal
- how to use .env and keep my API key outside the code
- how to read and write JSON files for saving history and config
- how to make different commands like makefast idea, makefast copy, makefast scaffold etc
- how to handle errors in terminal so the app does not crash with node index.js
- how to organize the project into small files
- how to test the CLI locally with npm link and also run it with node index.js
- how to think about prompts
This project is important for me because it is the first I tried to mix "AI stuff" with real developer tools.
I am still learning, so maybe the code is not perfect, but I am happy because I actually made something I can use myself when I want to start a new idea.

## Contributing
If you want to cintribute:
1. Fork the repo
2. Create a branch
3. Make your changes
4. Test the command or part you changed
5. Open a pull request
Small fixes are fine too.

## License
MIT

<p align="center">Made by <a href="https://github.com/avision488">Avision488</a></p>
