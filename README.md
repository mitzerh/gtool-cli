# Github Tool CLI

Unix command line helper tool for Github repositories.

# Installation

```
npm install gtool-cli
```

## Commands

### `info`

Information about the current repo

```
gtool info
```

### `repo`

Opens the Github repository in your web browser.

```
gtool repo
```


### `pull`
Sends you to the web browser, opening a pull request for your current branch.

```
gtool pull
```

### `config`
You can set certain config values for your installation.

```
gtool config [command] [key] [value]
```

| Commands | Description |
|:---------|:------------|
| **`set`** | Sets a configuration value |
| **`unset`** | Removes a configuration value |

> Example:
>
> ```
> gtool config set browser firefox
> ```

## Setting your browser opener

For usage of commands that opens a browser ( `repo`; `pull` ) you can set the specific browser via `config`

```
gtool config set browser [chrome/firefox/edge]
```

Without this config setting, the app will attempt to open via the default browser set on your computer
