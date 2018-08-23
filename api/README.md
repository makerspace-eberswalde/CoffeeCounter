# dm-tpl
- using gitflow: https://www.atlassian.com/git/tutorials/comparing-workflows

# Install
```
npm install dm-tpl -g
# or
npm install dm-tpl --save-dev
```
# Features

## Technical Features
- [x] programatic mocha testing with livereload (```npm run test:watch```)
- [x] nyc code coverage with livereload (```npm run coverage:watch```)
- [x] class based typescript
- [x] gitflow support 
- [x] run via ts-node with livereload (```npm run start:watch```)
- [ ] node debugger
- [ ] ci

## Workflow Features
- npm
  - [ ] publish release
- gitflow
  - [ ] publish release
  - [ ] create hotfix
  - [ ] publish hotfix
  - [ ] create feature

# TODO: Usage

# Utility vs Tasks

## Utility
- are [Singletons](https://stackoverflow.com/questions/30174078/how-to-define-singleton-in-typescript)
- offer Helper functions

## Tasks
- have a run function
- use Utility functions
