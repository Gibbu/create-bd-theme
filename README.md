# create-bd-theme

A CLI to scaffold BetterDiscord themes using SCSS.

<br>

## Usage

Have [NPM](https://nodejs.org/en/) v5.2+ installed with NodeJS and then run the following command:

```bash
npx create-bd-theme <folder name>
```

<br>

This will ask a series of questions such as: Theme name, Description and your GitHub name.  
> Make sure your GitHub name is correct as the CLI will use that for the GitHub Pages `@import`.

Install the dependency using:  

```bash
npm install
```

<br>

The only command you'll have to interact with normally is:

```bash
npm run dev
```

As that will watch the file(s) specified in `bd-scss.config.json` dev object and autocompile them to your BetterDiscord themes folder.  
> View [bd-scss](https://github.com/Gibbu/bd-scss) for more info.

<br>

## Deployment

When you're ready to share your awesome theme, all you need to do is push the changes to your repository and enable GitHub pages to target the `deploy` branch.  
GitHub actions will take care of the compiling of the SCSS. 