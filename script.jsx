var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

var StarsFrame = React.createClass({
  render: function() {
    var stars = []
    for (var i = 0; i < this.props.numberOfStars; i++) {
      stars.push(
        <span className="glyphicon glyphicon-star"></span>
      )
    }
    
    return (
      <div id="stars-frame">
        <div className="well">
          { stars }
        </div>
      </div>
    )
  }
})

var ButtonFrame = React.createClass({
  render: function() {
    var button
    var disabled
    var correct = this.props.correct
    var acceptAnswer = this.props.acceptAnswer
    var redraw = this.props.redraw
    
    switch(correct) {
      case true:
        button = (
          <button className="btn btn-success btn-lg" onClick={ acceptAnswer }>
            <span className="glyphicon glyphicon-ok"></span>
          </button>
        )
        break
      case false:
        button = (
          <button className="btn btn-danger btn-lg">
            <span className="glyphicon glyphicon-remove"></span>
          </button>
        )
        break
      default:
        disabled = (this.props.selectedNumbers.length === 0)
        button = (
          <button 
            className="btn btn-primary btn-lg" 
            disabled={ disabled }
            onClick={ this.props.checkAnswer }>
            =
          </button>
        )  
    }
    
    return (
      <div id="button-frame">
        { button }
        <br />
        <br />
        <button 
          className="btn btn-warning btn-xs" 
          onClick={ redraw }
          disabled={ this.props.redraws === 0 }>
          <span className="glyphicon glyphicon-refresh"></span>
          &nbsp;
          { this.props.redraws }
        </button>
      </div>
    )
  }
})

var AnswerFrame = React.createClass({
  render: function() {
    var props = this.props
    var selectedNumbers = props.selectedNumbers.map(function(number) {
      return (
        <span onClick={ props.unselectNumber.bind(null, number) }>
          { number }
        </span>
      )
    })
    return (
      <div id="answer-frame">
        <div className="well">
          { selectedNumbers }
        </div>
      </div>
    )
  }
})

var NumbersFrame = React.createClass({
  render: function() {
    var numbers = []
    var className
    var selectedNumbers = this.props.selectedNumbers
    var selectNumber = this.props.selectNumber
    var usedNumbers = this.props.usedNumbers
    
    for (var i = 1; i <=9; i++) {
      var numberIsUsed = (usedNumbers.indexOf(i) >= 0)
      className = "number selected-" + (selectedNumbers.indexOf(i) >= 0) +
                  " " +
                  "used-" + numberIsUsed
      
      numbers.push(
        <div className={ className } onClick={ selectNumber.bind(null, i) }>{ i }</div>
      )
    }
    
    return (
      <div id="numbers-frame">
        <div className="well">
          { numbers }
        </div>
      </div>
    )
  }
})

var DoneFrame = React.createClass({
  render: function() {
    return (
      <div className="well text-center">
        <h2>{ this.props.doneStatus }</h2>
        <button 
          className="btn btn-success"
          onClick={ this.props.resetGame }>Play again</button>
      </div>  
    )
  }
})

var Game = React.createClass({
  getInitialState: function() {
    return { 
      numberOfStars: this.randomNumber(),
      selectedNumbers: [],
      usedNumbers: [],
      correct: null,
      redraws: 5,
      doneStatus: null
    }
  },
  randomNumber: function() {
    return Math.floor(Math.random() * 9) + 1
  },
  selectNumber: function(clickedNumber) {
    if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
      this.setState({
        selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
        correct: null
      }) 
    }
  },
  unselectNumber: function(clickedNumber) {
    console.log(clickedNumber)
    var selectedNumbers = this.state.selectedNumbers
    var clickedNumberIndex = selectedNumbers.indexOf(clickedNumber)
    selectedNumbers.splice(clickedNumberIndex, 1)
    this.setState({ 
      selectedNumbers: selectedNumbers,
      correct: null
    }) 
  },
  sumOfSelectedNumbers: function() {
    return this.state.selectedNumbers.reduce(function(current, accumulator){
      return current + accumulator
    }, 0)
  },
  checkAnswer: function() {
    console.log(this.sumOfSelectedNumbers())
    var correct = (this.state.numberOfStars === this.sumOfSelectedNumbers())
    this.setState({ correct: correct })
  },
  acceptAnswer: function() {
    var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers)
    this.setState({
      selectedNumbers: [],
      usedNumbers: usedNumbers,
      correct: null,
      numberOfStars: this.randomNumber()
    }, function() {
        this.updateDoneStatus()
      })
  },
  redraw: function() {
    if (this.state.redraws > 0) {
      this.setState({
        selectedNumbers: [],
        correct: null,
        numberOfStars: this.randomNumber(),
        redraws: this.state.redraws - 1
      }, function() {
        this.updateDoneStatus()
      })
    }
  },
  solutionIsPossible() {
    var numberOfStars = this.state.numberOfStars
    var possibleNumbers = []
    var usedNumbers = this.state.usedNumbers
    
    for (var i = 0; i <= 9; i++) {
      if (usedNumbers.indexOf(i) < 0) {
        possibleNumbers.push(i)
      }
    }
    
    return possibleCombinationSum(possibleNumbers, numberOfStars)
  },
  updateDoneStatus() {
    if (this.state.usedNumbers.length === 9) {
      this.setState({ doneStatus: 'You win!' })
      return
    }
    if (this.state.redraws === 0 && !this.solutionIsPossible()) {
      this.setState({ doneStatus: 'You lose!' })
      return
    }
  },
  resetGame: function () {
    this.replaceState(this.getInitialState())
  },
  render: function() {
    var numberOfStars = this.state.numberOfStars
    var selectedNumbers = this.state.selectedNumbers
    var usedNumbers = this.state.usedNumbers
    var redraws = this.state.redraws
    var bottomFrame
    var doneStatus = this.state.doneStatus
    
    if (doneStatus) {
      bottomFrame = <DoneFrame 
        doneStatus={ doneStatus }
        resetGame={ this.resetGame }/>  
    } else {
      bottomFrame = <NumbersFrame 
        selectedNumbers={ selectedNumbers } 
        selectNumber={ this.selectNumber }
        usedNumbers={ usedNumbers }/>
    }
    
    return (
      <div id="game">
        <h2>Play Nine, Play Nice</h2>
        <hr />
        <div class="clearfix">
          <StarsFrame numberOfStars={ numberOfStars }/>
          <ButtonFrame selectedNumbers={ selectedNumbers }
                        sumOfSelectedNumbers={ this.sumOfSelectedNumbers }
                        checkAnswer={ this.checkAnswer }
                        correct={ this.state.correct }
                        acceptAnswer={ this.acceptAnswer }
                        redraw={ this.redraw }
                        redraws={ redraws }/>
          <AnswerFrame selectedNumbers={ selectedNumbers } 
                       unselectNumber={ this.unselectNumber }/>
        </div>
        { bottomFrame }
      </div>
    )
  }
})

React.render(<Game />, document.getElementById('container')
);
