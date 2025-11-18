# create-bd-theme

A CLI to scaffold BetterDiscord themes using SCSS.

<br>

## Usage

Have [NPM](https://nodejs.org/en/) v5.2+ installed with NodeJS and then run the following command:

```bash
npx create-bd-theme MyTheme [options]
```

This will ask a series of questions such as: Theme name, Description, your GitHub name, and if you'd like it initalize a Git repository.

<br>

> Make sure your GitHub name is correct as the CLI will use that for the GitHub Pages `@import`.  
> Providing the `--git` option will initialize a git repo and skip asking you.

<br>

Move into the newly created directory and install the dependency using:

```bash
cd MyTheme
npm install
```

<br>

Now you're able to access the `dev` and `build` scripts using:

```bash
npm run dev
# and
npm run build
```

The `dev` script will build the necessary files to your local development.
the `build` script will build the necessary files to the `/dist` folder relative to the `package.json` (where you run the script from).

> **View [bd-scss](https://github.com/Gibbu/bd-scss) for more info.**

<br>

## Deployment

When you're ready to share your awesome theme, all you need to do is push the changes to your repository and enable GitHub pages to target the `deploy` branch.  
GitHub actions will take care of the compiling of the SCSS.
