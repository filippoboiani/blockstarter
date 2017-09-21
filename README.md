# BlockStarter 4.0 Final Project

The distributed database blockchain is drastically increasing popularity in software development and many other fields. In this report we present Blockstarter 4.0, a kickstarter-inspired project built upon the blockchain for the course  Advanced Enterprise Computing  at TU-Berlin, summer semester 2017. Blockstarter 4.0 consists of two parts, first one of a backend and smart contracts, and the second part (extension) handles projects with deadlines.

![alt text](https://github.com/filippoboiani/blockstarter/blob/master/choco.png)

The first part,  backend and smart contracts , has the following requirements:
    - allows project owners to withdraw funds when a project has been funded successfully
(and not be able to withdraw if the funding goal has not been reached, yet)
    - allows backers to retrieve a share (token) for each project they invest in

In the second part we choose  Projects with deadline :
    - A project has a deadline until which the funding goal must be reached. Otherwise, the
project is automatically cancelled and all backers are refunded.

## How to run it
- Go to project folder. 
- Run the following command: 

    `docker-compose up --build`
- Open your browser at the following link:

    `your-docker-machine-ip:4000`

## Ho to test it
- To log in 
    - It is only necessaray to specify a number **from 0 to 9**, this numebrs will be mapped to the related web.eth.accounts[] account. 
- Create a project 
    - Specify the number of available shares (in form of tokens)
    - Specify how much of them will be available 

## Api 

Method | Route | Params | Description
--- | --- | --- | ---
*GET* | `/api/v1/` |  | Get Hello World
*POST* | `/api/v1/projects` | *see below* | Create a project
*POST* | `/api/v1/projects/fund` | - project<br> - backer<br> - amount | Fund a project
*GET* | `/api/v1/projects` |  | Get all projects
*GET* | `/api/v1/projects/creator/:creator` |  | Get all projects created by a creator
*GET* | `/api/v1/projects/backer/:backer ` |  | Get all projects funded by a backer
*GET* | `/api/v1/projects/status/:project ` | | Show project status
*GET* | `/api/v1/projects/:project ` |  | Show project information
*POST* | `/api/v1/projects/withdraw ` | - project<br> - creator<br> - amount  | Withdraw funds from the project
*POST* | `/api/v1/projects/claim-shares ` | - project<br> - backer<br> - token  | Claim project shares
*POST* | `/api/v1/projects/show/shares ` | - project<br> - backer  | Show the shares owned by a backer

### Create Project 

Requst body: 

```javascript
{
    token: {
        initialSupply: 100, // number of shares
        tokenName: "Example Token",
        tokenSymbol: "Symbol",
        creator: "0x ..." // creator address
    },
    project: {
        title: "Example",
        description: "Frist Project With Token",
        goal: 100, // in ethers
        duration: 120, // in minutes
        sharesAvailable: 50, // number of tokens available (50 %)
        creator: "0x ..." // creator address
    }
}
```

## Project extension
- A: kill a project when the time is up and the goal is not met. 


## Metodology 
- Scrum (1 week iteration)

## Tools 
Technologies: 
- Slack for communication
- GitLab for VCS
- Slack WebHook for commit notifications 

Dev Tools:
- Server: Node.js 
- Client: Angular.js






