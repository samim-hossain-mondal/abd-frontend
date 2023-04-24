const poNoteImg = '../../assets/images/screens/ponote.png';
const calendarImg = '../../assets/images/screens/calendar2.png';

const dsmImg = '../../assets/images/screens/dsm.png'; 

const texts = {
    // whyMyAgile: 
    // 'My Agile Dashboard is all about improving collaboration and transparency in any Agile project.\n My Agile Dashboard provides you with an intuitive and user friendly web-based dashboard where you can effectively run your Daily Standup Meetings (DSMs), maintain Product Owner (PO) Notes about action items, stay informed about presence of team members using the availability calendar, organize project and team information so that it sticks to the mind.',
    whyMyAgile: '\u{1F91D} Improve collaboration and \u{1F50D} transparency in any Agile project\n\u{1F4BB} Intuitive and user-friendly web-based dashboard\n\u{1F4C5} Run your Daily Standup Meetings (DSMs) more efficiently\n\u{1F4CC} Maintain Product Owner (PO) Notes about action items\n\u{1F5D3} Stay informed about availability of team members\n\u{1F4D6} Make sticky notes on the go\n',
    welcome: 'Welcome to My Agile Dashboard',
    welcomeBack: 'Welcome back',
    yourProjects: 'Your Projects \u{1F5C3}',
    getStarted: 'Start using My Agile Dashboard today! \u{1F680} \n',
    
}

const slides = [
    {
        id: 1,
        title: 'Run your Daily Standup Meetings more efficiently \u{2705}',
        description: "Keep up with your team's well being, achievements, requests, blockers and reminders, all within a single Agile dashboard.",
        image: dsmImg
    },
    {
        id: 2,
        title: 'Product Owners can easily categorise their notes \u{1F4CC}',
        description: 'The PO Notes section helps the Product Owner prioritise and categorise their notes, so that team can easily find the information they need.',
        image: poNoteImg
    },
    {
        id: 3,
        title: "Stay informed about your team's availability status \u{1F5D3}",
        description: 'The availability calendar helps you stay informed about your team members availability status, so that you can plan your meetings accordingly.',
        image: calendarImg
    }
]

export { texts, slides };