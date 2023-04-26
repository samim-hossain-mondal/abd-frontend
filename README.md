# My Agile Portal

In the software industry, there is often a lack of transparency, collaboration, and effective communication, which can lead to missed deadlines, poor decision-making, and a negative impact on team morale. Additionally, teams often struggle with risk and planning, which can result in inefficient use of time and resources.

The objective of this app is to enhance:-
* Transparency
* Collaboration
* Communication

It aims to provide a centralized platform where team members can easily access important information, collaborate effectively, and manage risk and planning efficiently.

## Project Status

Currently, The app includes four modules: 
* PO notes: In this module, PO is able to add action items, key decisions and raise any open question, which helps us achieve transparency.
* DSM: This module further contains four sections:
  * Sentiment Meter: Through this feature, PO and leadership are able to view the sentiment/morale of team which helps them plan in a better manner.
  * Celebration Board: Through this feature, people can show their appreciation towards their colleagues or can post impediment.
  * Requests: Through this feature, the users are able to request for meeting or resource.
  * Announcement: Through this feature, the user is able to make any announcement.
* Availabilty Calendar: In this module, the user is able to add his/her availability, which would help the team plan in an efficient manner.
* Made to Stick: In this module, PO is able to create multiple draggable and resizable notes where they can store necessary information.

## Installation and Setup Instructions

Step-1: Clone this repository. You will be required to have node and npm installed on your machine.
```
git clone https://github.com/tech-university-india/abd-frontend.git
```
Step-2: Setup the backend repository: https://github.com/tech-university-india/abd-backend and start the backend server.

Step-3: Setup the env file:
```
 REACT_APP_OKTA_CLIENT_ID = <octa-client-id>
 REACT_APP_OCTA_DOMAIN = <octa-domain>
```
Step-4: Install the dependencies:
```
npm install
```
Step-5: Start the application:

```
npm start
```

To visit the application:
```
http://localhost:3000
```

To run the tests along with coverage:
```
npm run test -- --coverage .
```

## Technologies used:
* React
* Material UI
* react-router-dom
* okta-react
* okta-auth-js
* Jest
* HTML
* CSS
