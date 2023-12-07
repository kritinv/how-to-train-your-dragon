# COS 426 Final Project Template

This skeleton project will help you get started with a ThreeJS project and provide a strong foundation for extension. It sets up a simple scene, camera, and renderer in a modern JavaScript environment, and is written using some common best-practices that you may want to draw from.

To see it running live on the web, check out the [Online Demo](https://adamfinkelstein.github.io/cos426finalproject-vite/)

## Cloning this template at Github

To make your own copy of this project at Github, sign into your Github account, navigate to this project [at Github](https://github.com/adamfinkelstein/cos426finalproject-vite/tree/main) and then click the big green button at the top: "Use this template" > "Create a new repository".

## Installation on your own computer

Having made your own copy of the project at Github (previous step) you can clone your repository to your own computer.

To build this project, you will need to use Node Package Manager (npm) to manage and install project dependencies. All npm settings, as well as your project dependencies and their versionings, are defined in the file `package.json`. We will unpack this file in the next section.

Node Package Manager, which is the world's largest software registry and supports over one million open source JavaScript packages and libraries, runs in a NodeJS runtime. The NodeJS runtime is essentially a port of Google Chrome's JavaScript V8 engine that will run directly in your terminal (instead of within a browser).

Before you begin, you will need to install [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Then, open a new terminal instance, set your working directory to the root of the project, and run `npm install`.

**Note on node versions:** The current version of this scaffolding code is known to work with the two newest LTS versions of Node, `v20.10.0` and `v18.19.0`, and we therefore recommend running this project with those versions. It is easy to switch among different versions of node on your computer by installing [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm).

## Setting Up Your Project

Before you start your project, look inside `package.json`. Take a note of the following fields, and adjust them where appropriate:

-   `name`: This is your project name as it would appear on the npm registry (if published). You should replace this with your own project name, but make sure to preserve the all lowercase and hyphenated format.

-   `repository`: This holds the name of your repository for this project. It should match name of your GitHub repository as it appears in the URL. For instance, "https://github.com/adamfinkelstein/cos426finalproject-vite" would become "cos426finalproject-vite".

-   `version`: This field is used to version your project. The standard format for these is "MAJOR.MINOR.PATCH". You can update this as needed (for instance, setting it to "1.0.0" when you are finished with the project), or you can choose to ignore it.

-   `title`: This field contains the "pretty" name of your project. When you run your project in the browser, this title will be injected into the site's HTML header. Most browsers will use this to label the browser tab.

-   `description`: A really quick description of your project.

-   `keywords`: A list of keywords for you project. Feel free to modify as needed, note that the last keyword should **not** be followed by a comma, since `package.json` must adhere to JSON format.

-   `scripts`: This field contains several npm scripts that you will find useful. The first three commands (`start`, `prebuild`, and `build`) are used to build the development webserver, as well as the production bundle, for your project. `format` is used to "prettify" your JavaScript into a standardized format, as specified by the `prettier` field. You can run any of these commands from the command line using `npm run <script-name>`.

-   `prettier`: This field specifies formatting rules for Prettier, a JavaScript code formatting tool. Take a look at [Prettier's documentation](https://prettier.io/docs/en/options) if you want to change the existing rules.

The dependencies below these fields tell npm what libraries (and more specifically, which versions of these libraries) to download when you run `npm install`. If there are further packages you would like to add to your project, you can install them by running `npm install <package-name>`.

## Launching a Local Webserver

Now that your development environment is ready to go, you can spin up a local development webserver using `npm start`. This command will bundle the project code and output a link to localhost. Visit this in your web browser; every time you make changes to the code, _the page will automatically refresh!_ If you did everything correctly, you should see something that looks like [this](https://adamfinkelstein.github.io/cos426finalproject-vite/) in your browser. Congratulations --- now you are ready to work!

## Vite and GitHub Pages

This project uses the Vite web framework to run the development server and build code for deployment on the web. Settings for Vite can be specified in `vite.config.ts` (see [Vite's config reference](https://vitejs.dev/config/)). Through GitHub Actions, this repo is currently configured to create a Vite production build and automatically deploy it to GitHub Pages every time a change is pushed to the `main` branch. In order for this deployment to work, you'll need to [follow these steps to configure the `gh-pages` branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), and make sure that Vite serves your project from a folder which matches your repository name. The scaffolding code for this second step is already included in `vite.config.ts`.

## Working with TypeScript

This project has been adapted from previous years to use TypeScript, a type annotation syntax for JavaScript which prevents common bugs and allows for more detailed autocompletion in programming environments like VS Code. Learning TypeScript is as simple as learning how to define types and use existing type definitions; you can quickly pick up the basics by skimming [the TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/basic-types.html).

TypeScript verifies types by checking types with the TypeScript compiler, `tsc`, before removing type annotations and transpiling to JavaScript. You can control how strict the TypeScript compiler is by editing `tsconfig.json` (see the [tsconfig reference](https://www.typescriptlang.org/tsconfig)).

Note that older NPM packages may not include TypeScript-compatible type definitions by default. Type definitions for these packages can often be found in the `@types` NPM repository and installed alongside the package using `npm install --save-dev @types/<package-name>`.

## Editing the Code

The first file you should open is `./src/app.ts`. This includes the setup for your ThreeJS scene, as well important global-level operations like the render loop. At the top of the file, you will see both modular imports for objects from the ThreeJS library dependency, and also modular imports from the local project directory.

Next, navigate to `.src/scenes/SeedScene.ts`. This file contains the definition for the class `SeedScene`, and the sets this class as the default export. We can import the `SeedScene` class directly from `./scenes/SeedScene` (this [bare import syntax](https://vitejs.dev/guide/features#npm-dependency-resolving-and-pre-bundling) is one of Vite's features).

Take a look at the constructor in `SeedScene.ts`. The call `super()` invokes the parent constructor for the class, which is `Scene()` here. Then we add an instance variable called `state`, and populate it with some default settings. One of these initialization, `new dat.GUI()`, will create a simple user interface that should already be familiar to you. You can [learn more about dat.GUI here](https://github.com/dataarts/dat.gui/blob/master/API.md), or you can uninstall it from the project via `npm uninstall dat.gui`.

The next primary line after `this.state = ...` is not creating a new instance variable, but is rather modifying the `background` instance variable that was initialized in the `Scene` constructor (invoked by `super()`). Setting this property will alter the current color of the scene's background. Try changing this property to `0xff0000`, and see what happens to your pretty scene in the browser!

After (re)setting the background to a nice sky blue, turn your eyes to the next block of code, wherein we initialize and insert a few objects into the scene. Finally, at the end of the constructor, we tell the dat.GUI user interface to add a slider for the "rotationSpeed" property of `this.state`. The dat.GUI instance will automatically update `this.state.rotationSpeed` to whatever the user sets it to via the interface.

Real quickly, another interesting function in the `SeedScene` class is `update()`. If you return to `app.ts`, you will see that we invoke this function via `scene.update()` in the render loop. Be careful to understand what we are doing within `SeedScene.update()` and how it affects the dynamic behavior on the screen.

Once you understand the `SeedScene` class, the next place to look is `./src/objects/Flower.ts`. Overall, this `Flower` class is fairly similar to `SeedScene`, but watch out for a few key differences: first, `Flower` extends `Group`, not `Scene`; second, the `Flower` constructor takes an argument, which is used to reference the `gui` property of the parent (`SeedScene` here). Finally, for a more advanced animation example, check out the `spin()` function to see how we time the flower's jump using TweenJS.

## Importing Local Files

Local files, such as images and 3D models, are imported into the application as URLs then loaded asynchronously with ThreeJS. Almost any filetype that ThreeJS might conceivably use should already be supported out of the box, though import syntax may vary between use cases. For instance, shader files can be loaded as raw text. For more information on asset loading, see [Vite's documentation](https://vitejs.dev/guide/assets.html).

## Importing Modules from the Web

As mentioned above, if you want to add additional libraries to your project, you can search for packages on the [npm repository](https://www.npmjs.com/). Then, you can install them by running `npm install <package-name>`.

## Building the Project for the Web

Once you are happy with your project, try building a production bundle using `npm run build`. This will place an optimized and minified executable version of your project in the `./dist/` directory. You can locally preview this production build using `npm run preview`.

Once you have a working production build and are ready for the site to go live, you can push your changes to your GitHub `main` branch to automatically deploy to GitHub Pages. Note that this requires that (1) your project is part of a repository, and (2) you've correctly set the base URL in `vite.config.ts`.

## CC Attributes and Credits

Both models were downloaded from the Google Poly project:

-   [Floating island](https://poly.google.com/view/eEz9hdknXOi)

-   [Flower](https://poly.google.com/view/eydI4__jXpi)

This skeleton project was adapted from edwinwebb's ThreeJS [seed project](https://github.com/edwinwebb/three-seed) by Reilly Bova (Princeton ’20), and published [here on github](https://github.com/ReillyBova/three-seed). It was later slightly updated and setup as a github template by Adam Finkelstein and Joseph Lou (Princeton '23), and is hosted [here on github](https://github.com/adamfinkelstein/cos426finalproject-vite). Finally it was ported from `webpack` and Javascript to the more modern `vite` and Typescript by Jude Muriithi (Princeton '24).

## License

[MIT](./LICENSE)
