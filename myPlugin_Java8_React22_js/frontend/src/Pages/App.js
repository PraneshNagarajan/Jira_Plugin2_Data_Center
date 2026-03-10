import React from 'react';
import logo from './react.svg';
import './App.css';

function App(props) {
  const info = String(props.info).split("_")
  const host = info[0]
  const contextPath = info[1]
  return (
    <div className="App">
      <header className="App-header">
        <img src={"/jira/download/resources/com.atlassian.aservo.myPlugin:entrypoint-app/images/react.svg"} className="App-logo" alt="logo" />
        <p style={{color: 'green'}}>Deployed Jira Plugin UI Successfully.</p>
        <p> 
          Host : {host}
          <br/>
          contextPath : '{contextPath}'
        </p>
      </header>
    </div>
  );
}

export default App;
