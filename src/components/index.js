import {Component, Fragment} from 'react';
import Rows from "./Row";
import { Button, notification } from 'antd';

const symbolsMap = {
  2: ["marking", "32"],
  0: ["marking marking-x", 9587],
  1: ["marking marking-o", 9711]
};

const patterns = [
  //horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [2, 4, 6]
];

const AIScore = { 2: 1, 0: 2, 1: 0 };

class Game extends Component {
  state = {
    boardState: new Array(9).fill(2),
    turn: 0,
    active: true,
    mode: "1P",
    winningBlocks: [],
    xwin: 0,
    owin: 0
  };

  processBoard = () => {
    let won = false;
    patterns.forEach(pattern => {
      let firstMark = this.state.boardState[pattern[0]];
      if (firstMark !== 2) {
        let marks = this.state.boardState.filter((mark, index) => {
          return pattern.includes(index) && mark === firstMark;
        });

        if (marks.length === 3) {
          this.openNotificationWithIcon('success', String.fromCharCode(symbolsMap[marks[0]][1]) + " wins!");
          let winningBlocks = [];
          pattern.forEach(index => {
            let id = index + "-" + firstMark;
            winningBlocks.push(id);
          });
          let xwin = this.state.xwin, owin = this.state.owin;
          if(symbolsMap[marks[0]][1] === 9587) {
            xwin++;
          } else {
            owin++;
          }
          this.setState({ active: false, winningBlocks: winningBlocks, xwin: xwin, owin: owin });
          won = true;
        }
      }
    });

    if (!this.state.boardState.includes(2) && !won) {
      this.openNotificationWithIcon("success", "Game Over - It's a draw");
      this.setState({ active: false });
    } else if (this.state.mode === "1P" && this.state.turn === 1 && !won) {
      this.makeAIMove();
    }
  }

  makeAIMove = () => {
    let emptys = [];
    let scores = [];
    this.state.boardState.forEach((mark, index) => {
      if (mark === 2) emptys.push(index);
    });

    emptys.forEach(index => {
      let score = 0;
      patterns.forEach(pattern => {
        if (pattern.includes(index)) {
          let xCount = 0;
          let oCount = 0;
          pattern.forEach(p => {
            if (this.state.boardState[p] === 0) xCount += 1;
            else if (this.state.boardState[p] === 1) oCount += 1;
            score += p === index ? 0 : AIScore[this.state.boardState[p]];
          });
          if (xCount >= 2) score += 10;
          if (oCount >= 2) score += 20;
        }
      });
      scores.push(score);
    });

    let maxIndex = 0;
    scores.reduce(function(maxVal, currentVal, currentIndex) {
      if (currentVal >= maxVal) {
        maxIndex = currentIndex;
        return currentVal;
      }
      return maxVal;
    });
    this.handleNewMove(emptys[maxIndex]);
  }

  handleReset = () => {
    this.setState({
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true,
      winningBlocks: []
    });
  }

  handleNewMove = (id) => {
    this.setState(
      prevState => {
        return {
          boardState: prevState.boardState
            .slice(0, id)
            .concat(prevState.turn)
            .concat(prevState.boardState.slice(id + 1)),
          turn: (prevState.turn + 1) % 2
        };
      },
      () => {
        this.processBoard();
      }
    );
  }

  handleBoxClick = (marking, id) => {
    if (!this.state.active) {
      this.openNotificationWithIcon('info', "Game is already over! Reset if you want to play again.");
      return false;
    } else if (marking === 2)
      this.handleNewMove(parseInt(id));
  }

  handleModeChange = (mode) => {
    this.setState({ mode: mode },() => {
      this.handleReset();
    });
  }

  openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  render() {
    const rows = [];
    for (let i = 0; i < 3; i++)
      rows.push(
        <Rows
          key={i}
          row={i}
          boardState={this.state.boardState}
          onNewMove={this.handleNewMove}
          onBoxClick={this.handleBoxClick}
          symbolsMap={symbolsMap}
          winningBlocks={this.state.winningBlocks}
        />
      );
    return (
      <Fragment>
        <h3 className="heading">TIC TAC TOE</h3>
        <p>
          <Button type={this.state.mode === '1P' ? 'primary' : ''} onClick={() => this.handleModeChange('1P')}>
            1 Player
          </Button>
          <Button type={this.state.mode === '2P' ? 'primary' : ''} onClick={() => this.handleModeChange('2P')}>
            2 Players
          </Button>
        </p>
        <p>{String.fromCharCode(symbolsMap[this.state.turn][1])}'s turn</p>
        <div className="board">{rows}</div>
        <p><span style={{marginRight: '10px'}}><b>X:</b> {this.state.xwin}</span> <span style={{marginLeft: '10px'}}><b>O:</b> {this.state.owin}</span></p>
        <Button onClick={this.handleReset}>
          Reset board
        </Button>
      </Fragment>
    );
  }
}

export default Game;
