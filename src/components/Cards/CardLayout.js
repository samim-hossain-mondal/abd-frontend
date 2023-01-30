import React from 'react';
import CustomCard from './CustomCard';

const actionItems = [
  {
    'actionItemDescription': "PO is to get the marketing approvals for the Payment screen text content by Monday so that we are prepared for our next sprint.",
    'collabrators': ['Kartik Goel', 'Alokam Nikitha', 'Ananya Gupta']

  },
  {
    'actionItemDescription': "Create a design system for a hero section in 2 different variants. Create a simple presentation with these components.",
    'collabrators': ['Kartik Goel', 'Riya Singh']

  },
  {
    'actionItemDescription': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In laoreet volutpat mi in lacinia. Mauris maximus maximus ex in pulvinar. Nulla tristique egestas tempus. Integer lorem magna, ultricies in massa sed, porttitor varius nisl. Mauris ac arcu luctus, dapibus sapien et, tristique lectus. Aenean mattis quis libero vitae consequat. Nam efficitur tristique quam sit amet ullamcorper. Pellentesque ex nisl, pulvinar a bibendum id, malesuada ut est. Sed tempus molestie metus in sodales. In elementum, libero vitae volutpat malesuada, erat ante condimentum tellus, sit amet sodales leo lorem vel sem. Mauris non urna id enim pulvinar fermentum et a augue. Proin aliquet ac magna at tempor. Curabitur mollis pretium nulla eu finibus. Donec vel tincidunt quam. Sed commodo commodo mi ornare egestas. Proin a elit tortor. Duis eget magna consequat ante vulputate dapibus non in urna. Sed aliquet rutrum suscipit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed in ultrices lacus, in molestie neque. In commodo faucibus eros id viverra. Duis tempor justo magna, vel efficitur nisi rhoncus non. In vel justo rhoncus, laoreet ipsum ac, ultricies leo. Donec id eros non odio dignissim dignissim. Nam pellentesque libero non tincidunt bibendum. Nullam laoreet turpis vitae lorem vehicula fringilla. Donec tempor rhoncus quam, eget fermentum ipsum lobortis vitae. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla nec viverra tortor, vel tincidunt nulla. In ac mauris placerat, maximus lacus quis, dapibus arcu. Morbi tincidunt volutpat risus vitae suscipit. Ut ultrices sit amet neque in aliquet. Vivamus tincidunt.",
    'collabrators': ['Kartik Goel', 'Riya Singh']

  }
]

function CardLayout(props) {
  return (
    <>
      {
        actionItems.map((actionItem) => {
          // eslint-disable-next-line react/destructuring-assignment, react/prop-types
          const combinedProp = { ...actionItem, 'colour': props.colour, 'chckBox': props.chckBox };
          return <CustomCard {...combinedProp} />
        })
      }
    </>
  );
}

export default CardLayout;
