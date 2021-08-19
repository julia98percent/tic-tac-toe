import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function NumOfSpace() {
  return (
    <select name="numSelect">
      <option value="">칸 수 선택</option>
      <option value="학생">3 X 3</option>
      <option value="회사원">4 X 4</option>
      <option value="기타">5 X 5</option>
    </select>
  );
}
function Square(props) {
  return (
    <button
      className={"square " + (props.val_color ? "colored" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        val_color={this.props.colored[i]}
      />
    );
  }
  renderBoard() {
    let rowArr = [];
    for (let i = 0; i < 7; i += 3) {
      let squareArr = [];
      for (let j = 0; j < 3; j++) {
        squareArr.push(this.renderSquare(i + j));
      }
      rowArr.push(<div className="board-row">{squareArr}</div>);
    }
    return rowArr;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastIndex: -1,
          colored: Array(9).fill(false),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //사본 배열 생성
    const squares = current.squares.slice();
    const colored = current.colored.slice();
    const lastIndex = i;
    if (calculateWinner(squares) || squares[i]) {
      //이미 winner가 나왔거나 이미 선택된 사각형일 때
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    if (calculateWinner(squares)) {
      //결과가 나왔을 때
      let temp = calculateWinner(squares).where;
      for (let i = 0; i < temp.length; i++) {
        colored[temp[i]] = true;
      }
    }

    this.setState({
      //concat(): 기존 배열 수정 x
      history: history.concat([
        {
          squares: squares,
          lastIndex: lastIndex,
          colored: colored,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  setAsc() {
    this.setState({
      isAsc: !this.state.isAsc,
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    if (!this.state.isAsc) history = history.slice().reverse();
    const moves = history.map((step, move) => {
      move = this.state.isAsc ? move : history.length - 1 - move;
      const item =
        step.lastIndex >= 0
          ? "Go to move #" +
            move +
            " (" +
            parseInt(step.lastIndex / 3) +
            "," +
            (step.lastIndex % 3) +
            ")"
          : "Go to game start";
      return (
        <li key={move}>
          <button className="moves-button" onClick={() => this.jumpTo(move)}>
            {item}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      if (winner.who == "D") status = "DRAW";
      else status = "Winner: " + winner.who;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            colored={current.colored}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setAsc()}>
            {this.state.isAsc ? "오름차순" : "내림차순"}
          </button>
          <NumOfSpace />
          <ol {...(this.state.isAsc ? {} : { reversed: true })}>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { who: squares[a], where: [a, b, c] };
    }
  }
  if (squares.filter((e) => e === null).length === 0)
    return { who: "D", where: 0 };
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
