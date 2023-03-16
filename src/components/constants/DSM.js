const celebrationType = {
  CELEBRATION: 'CELEBRATION',
  IMPEDIMENT: 'IMPEDIMENT'
}

const celebrationPlaceholder = {
  CELEBRATION: 'Example: Thank you @GC for helping out on Payment integration yesterday.',
  IMPEDIMENT: 'Example: We should make sure designs are getting marketing sign-off before given for development.'
}

const instructions = {
  CELEBRATION: {
    header: 'Sharing is Caring',
    points: [
      'Thank your team members to taking an extra step to help you on something.',
      'Celebrate your small achievements.'
    ]
  },
  IMPEDIMENT: {
    header: 'Act wisely',
    points: [
      'Try not to be personal.',
      'Seek attention to the core issue by highlighting the impact.'
    ]
  }
}

const celebrationTypes = [
  'CELEBRATION', 'IMPEDIMENT'
]

export { celebrationType, celebrationPlaceholder, instructions, celebrationTypes }