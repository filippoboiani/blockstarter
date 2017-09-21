# BlockStarter 4.0 Final Project

Group E
- Ahmad Jawid Jamiulahmadi (380457) @jawid
- Aqa Mustafa Akhlaqi (380455) @akhlaqi
- Filippo Boiani (387680) @filippo.boiani
- Gabriel Vilen (387555) @gavil
- Hekmatullah Sajid (380454) @hekmatullah.sajid
- Riccardo Sibani (382708) @riccardo.sibani
- Rohullah Ayobi (380448) @rohullahayobi
- Stefan Stojkovski (387529) @stefan.stojkovski

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


## Tasks (25; 25 done, 0 in progress, 0 todo)
- Project contract: withdraw funds (only owner) [ X ]
- Project contract: claim project shares (only backers) [ X ]
- MongoDB Connection [ X ]
- MongoDB Schema Definition [ X ]
- Create a Project API [ X ]
- Show Project Info API [ X ]
- List Projects API [ X ]
- List Created Project API [ X ]
- List Backed Project API [ X ]
- Login API (passport) [ X ]
- Back a Project API [ X ]
- Withdraw funds API [ X ]
- Get Project API [ X ]
- Show Status API [ X ]
- Claim Shares API [ X ]
- Show Share API [ X ]
- Kill project API [ X ]
- Project deadline [ X ]
- Automatic kill when the goal is not met [ X ]
- Login View [ X ]
- List projects View [ X ]
- Create a Project View [ X ]
- Project Info View [ X ]
- Back a Project View [ X ]
- Kill Project View [ X ]




