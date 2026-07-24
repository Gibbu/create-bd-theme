# create-bd-theme

A CLI to scaffold BetterDiscord themes.

<br>

## Usage

Have [BunJS](https://bun.com/docs/installation) v1.0 or above installed and then run the following command:

```bash
bunx create-bd-theme <directory name> [options]
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

The `dev` script will watch the the `src` folder and compile them to your BetterDiscord themes folder.  
The `build` script will compile the necessary files based off your `bd-css.config.js` config.

> **View [bd-css](https://github.com/Gibbu/bd-css) for more info.**

<br>

## Deployment

When you're ready to share your awesome theme, all you need to do is push the changes to your repository and enable GitHub pages to target the `deploy` branch.

The resulting files will look along the lines of:

> _CoolTheme.theme.css_

```css
/**
 * @name CoolTheme
 * @author CoolPerson
 * @version 1.0.0
 * @description My cool theme
 * @source https://github.com/me/CoolTheme
 */

@import url('https://coolperson.github.io/CoolTheme/CoolTheme.css');

:root {
	--theme-variable: red;
}
```

> _CoolTheme.css_

```css
#app-mount .container__2637a {
	background: var(--theme-variable);
}
```

Users will just need to download `CoolTheme.theme.css` and upon enabling the theme, Discord will fetch the `@import` contents.
