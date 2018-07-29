import React, { Component } from 'react';
import Tree, { renderers } from 'react-virtualized-tree';

import 'material-icons/css/material-icons.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-tree/lib/main.css'

import logo from './logo.svg';
import './App.css';

import nodes from './testData/sampleTree';

const { Deletable, Expandable, Favorite } = renderers;

const NodeNameRenderer = ({ node: { name }, children }) => (
  <span>
    {name}
    {children}
  </span>
);

class PropertyTree extends Component {
  state = {
    nodes: nodes
  };

  handleChange = nodes => {
    this.setState({ nodes });
  };

  render() {
    return (
      <Tree nodes={this.state.nodes} onChange={this.handleChange}>
        {({ node, ...rest }) => {
          return (<Expandable node={node} {...rest}>
            <NodeNameRenderer node={node} {...rest} />
          </Expandable>)
        }}
      </Tree>);
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Object Property Tree</h1>
        </header>
        <div style={{ fontSize: '14px', height: '400px' }}>
          <PropertyTree />
        </div>
      </div>
    );
  }
}

export default App;
