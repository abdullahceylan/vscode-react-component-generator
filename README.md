# React Component Generation Extension for VSCode
(**vscode-react-component-generator**)

[![Version](https://vsmarketplacebadge.apphb.com/version/abdullahceylan.vscode-react-component-generator.svg)](https://marketplace.visualstudio.com/items?itemName=abdullahceylan.vscode-react-component-generator)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/abdullahceylan.vscode-react-component-generator.svg)](https://marketplace.visualstudio.com/items?itemName=abdullahceylan.vscode-react-component-generator)
[![The MIT License](https://flat.badgen.net/badge/license/MIT/orange)](http://opensource.org/licenses/MIT)
[![GitHub](https://flat.badgen.net/github/release/abdullahceylan/vscode-react-component-generator)](https://github.com/abdullahceylan/vscode-react-component-generator/releases)

## Description
The extension automatically creates folder for react component containing :
- `index.js`
- `ComponentName.jsx`
- `ComponentName.styles.js` (for `styled`-component or `emotion` option)
- `ComponentName.css` (for `standard` style option)
- `ComponentName.sass` (for `sass` style option)
- `ComponentName.less` (for `less` style option)

## Installation

Install through VS Code extensions. Search for `VSCode React Component Generator`

[Visual Studio Code Market Place: VSCode React Component Generator](https://marketplace.visualstudio.com/items?itemName=abdullahceylan.vscode-react-component-generator)

Can also be installed in VS Code: Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```
ext install abdullahceylan.vscode-react-component-generator
```

## Usage

- Right click on the file or folder in the file explorer
- Select one of following options:
    - "New React Container Component"
    - "New React Stateless Component"
    - "New React Container Component with Redux"
    - "New React Stateless Component with Redux"
- Enter a component name in the pop up in camelCase or PascalCase. If you enter the component name as in camelCase, then extension will convert it PascalCase automatically.

![Container component](assets/images/vscode-1.gif)

![Basic component](assets/images/vscode-2.gif)

![Container component with redux](assets/images/vscode-3.gif)

![Extension settings](assets/images/vscode-settings.png)

## Configuration
You can access to the extension's settings through VSCode settings. You can customize:


#### `ACReactComponentGenerator.global.generateFolder` (default: `true`)
Generate or not separate folder for newly created component

#### `ACReactComponentGenerator.global.quotes` (default: `single`)
Controls the quotes for the imports in the files. Valid options:
 - "single" - e.g.: import React from `'`react`'`
 - "double"  - e.g.: import React from `"`react`"`
  
#### `ACReactComponentGenerator.global.lifecycleType` (default: `legacy`)
The lifecycle type of generated component. Valid options:
 - "legacy" - Contains `componentWillReceiveProps`, `componentWillMount`
 - "reactv16"  - Contains `getSnapshotBeforeUpdate`, `getDerivedStateFromProps`, `getDerivedStateFromError`, `componentDidCatch` and removes `componentWillReceiveProps` and `componentWillMount`

#### `ACReactComponentGenerator.indexFile.create` (default: `true`)
Weather to generate component's index file or not.

#### `ACReactComponentGenerator.indexFile.extension` (default: `js`)
The extension of generated component index file. e.g.: index.(`extension`)

#### `ACReactComponentGenerator.mainFile.create` (default: `true`)
Weather to generate component's main file or not.

#### `ACReactComponentGenerator.mainFile.extension` (default: `jsx`)
The extension of generated component file. e.g.: ComponentName.(`extension`)

#### `ACReactComponentGenerator.styleFile.create` (default: `true`)
Weather to generate component's stylesheet file or not.

#### `ACReactComponentGenerator.styleFile.extension` (default: `js`)
The extension of generated stylesheet file. e.g.: ComponentName.styles.(`extension`)

#### `ACReactComponentGenerator.styleFile.suffix` (default: `.styles`)
The suffix to add to the end of the stylesheet filename. Default: ComponentName`.styles`.(extension)

#### `ACReactComponentGenerator.styleFile.type` (default: `styled-components`)
The type of stylesheet file to create. Valid options:
- "styled-components (.js)" - ComponentName.styles.`js`
- "emotion (.js)" - ComponentName.styles.`js`
- "standard (.css)" - ComponentName.styles.`css`
- "sass (.sass)" - ComponentName.styles.`sass`
- "less (.less)" - ComponentName.styles.`less`

### Changelog

#### [Click here](CHANGELOG.md)

## Bugs

Please report [here](https://github.com/abdullahceylan/vscode-react-component-generator/issues)
