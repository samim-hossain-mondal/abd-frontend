export const HEADING = "Daily Retro Board"
export const GENERIC_NAME = 'Celebration';
export const CHAR_COUNT = 300;

export const celebrationType = {
  CELEBRATION: 'CELEBRATION',
  IMPEDIMENT: 'SUGGESTION',
}

export const celebrationPlaceholder = {
  CELEBRATION: 'Example: Thank you @GC for helping out on Payment integration yesterday.',
  SUGGESTION: 'Example: We should make sure designs are getting marketing sign-off before given for development.'
}

export const instructions = {
  CELEBRATION: {
    header: 'Sharing is Caring',
    points: [
      'Thank your team members to taking an extra step to help you on something.',
      'Celebrate your small achievements.'
    ]
  },
  SUGGESTION: {
    header: 'Act wisely',
    points: [
      'Try not to be personal.',
      'Seek attention to the core issue by highlighting the impact and your proposed suggestion.'
    ]
  }
}

export const WATERMARK = "Celebrate your team!"

export const celebrationTypes = Object.values(celebrationType)