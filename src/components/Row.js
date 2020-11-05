import Column from "./Column";
import {Row} from 'antd';

const Rows = (props) => {
  const cols = [];
  for (let i = 0; i < 3; i++) {
    let id = props.row * 3 + i;
    let marking = props.boardState[id];
    cols.push(
      <Column
        key={id + "-" + marking}
        id={id + "-" + marking}
        marking={marking}
        onNewMove={props.onNewMove}
        onBoxClick={props.onBoxClick}
        symbolsMap={props.symbolsMap}
        winningBlocks={props.winningBlocks}
      />
    );
  }
  return <Row>{cols}</Row>;
}

export default Rows;
