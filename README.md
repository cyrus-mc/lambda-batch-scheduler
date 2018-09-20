# How to run this project

### Prerequisites

The following tools are required

Docker:

  - [Community Edition for Mac](https://download.docker.com/mac/stable/Docker.dmg)
  - [Community Edition for Windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)

Visual Studio Code:

   - [Mac](https://go.microsoft.com/fwlink/?LinkID=534106)
   - [Windows](https://go.microsoft.com/fwlink/?LinkID=534107)

Okta + AWS cli:

   - [AWS CLI with Okta Authentication](https://transcore.jira.com/wiki/spaces/AD/pages/209190918/AWS+CLI+With+Okta+Authentication)

#### Launch in Docker:

### Running from the CLI

Running the lambda function locally run the following command:

  - `npm run compose:up`

This will bring up a local Oracle database, seed it with the required users and data
structures and invoke the Lambda function.

** Oracle is initialized on the first run and takes upwards of 5 minutes to complete **

To support active development, tsc-watch will be invoked and upon source changes the
code will be transpiled and executed again.

To shutdown the service execute:

  - `npm run compose:down`
