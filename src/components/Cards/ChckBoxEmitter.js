import {Checkbox} from '@mui/material';

const chckBoxEmitter=(chck)=>{
    return (
        <div>
          {chck===true? (
                <Checkbox color='primary' size="large"/>
          ):(<Checkbox color='primary' size="large" sx={{visibility: 'hidden'}}/>)
          }
        </div>
      );
};

export default chckBoxEmitter;