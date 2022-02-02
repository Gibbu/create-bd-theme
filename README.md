# create-bd-theme

A CLI to scaffold BetterDiscord themes using SCSS.

<br>

## Usage

Have [NPM](https://nodejs.org/en/) v5.2+ installed with NodeJS and then run the following command:

```bash
npx create-bd-theme MyTheme [options]
```

<br>

This will ask a series of questions such as: Theme name, Description, your GitHub name, and if you'd like it initalize a Git repository.  
> Make sure your GitHub name is correct as the CLI will use that for the GitHub Pages `@import`.  

> Providing the `--git` option will skip asking you to initialize a git repository.

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

The `dev` script will watch the file(s) specified in `bd-scss.config.json` `dev` array and autocompile them to your BetterDiscord themes folder.  

The `build` script will compile the file(s) specified in `bd-scss.config.json` `build` array and compile them to the desired location relative to your project directory.
> View [bd-scss](https://github.com/Gibbu/bd-scss) for more info.

<br>

## Deployment

When you're ready to share your awesome theme, all you need to do is push the changes to your repository and enable GitHub pages to target the `deploy` branch.  
GitHub actions will take care of the compiling of the SCSS. 