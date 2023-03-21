import DSMImg from '../../assets/images/screens/dsm.png';
import PONoteImg from '../../assets/images/screens/ponote.png';

const texts = {
    whyMyAgile: 
    'My Agile Dashboard is all about improving collaboration and transparency in any McKinsey Agile project. My Agile Dashboard provides you with an intuitive and user friendly web-based dashboard where you can effectively run your Daily Standup Meetings (DSMs), maintain Product Owner (PO) Notes about action items, stay informed about presence of team members using the availability calendar, organize project and team information so that it sticks to the mind.',
}

const slides = [
    {
        id: 1,
        title: 'DSM',
        description: 'The DSM is a dashboard that provides a high-level view of the current state of the business. It is a single source of truth for the business and provides a holistic view of the business.',
        image: DSMImg
    },
    {
        id: 2,
        title: 'PO Notes',
        description: 'PO Notes is a tool that allows users to create and manage notes for a specific PO. It allows users to create notes, view notes, and delete notes.',
        image: PONoteImg
    }
]

export { texts, slides };