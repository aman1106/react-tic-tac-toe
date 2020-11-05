import { Col } from 'antd';

const Column = (props) => {
  return (
    <Col className={`${props.winningBlocks.includes(props.id) && 'winning-blocks'} block`} span={8}>
      <div className={props.symbolsMap[props.marking][0]} id={props.id} onClick={(e) => {props.onBoxClick(props.marking, e.target.id)}}>
        {String.fromCharCode(props.symbolsMap[props.marking][1])}
      </div>
    </Col>
  );
}

export default Column;
