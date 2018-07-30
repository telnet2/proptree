import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Tree, { renderers } from './react-tree';
import classNames from 'classnames';

import 'material-icons/css/material-icons.css'
import 'react-virtualized/styles.css'
import './react-tree/main.css'

import logo from './logo.svg';
import './App.css';

const { Deletable, Expandable, Favorite } = renderers;
const SELECT = 3;

const schema = {
  type: "object",
  title: "VwdObject",
  properties: {
    id: {
      type: "string",
      title: "ObjectID"
    },
    type: {
      type: "string",
      enum: ["line", "polygon"]
    }
  }
}

const objectsToNode = (objs, schema) => {
  let id = 0;
  const objectToNode = (obj) => {
    return {
      id: id++,
      name: obj.id,
      children: [
        { id: id++, name: "type", value: obj.type, schema: schema.properties.type }
      ]
    }
  }
  return objs.map(obj => {
    return objectToNode(obj);
  });
}

const NodeRenderer = ({ node: { name, value, schema }, children }) => (
  <span>
    {name}: <span>{value}</span>
    {children}
  </span>
);

const Selection = ({ node, children, onChange }) => {
  const { state: { selected } = {}, ...rest } = node;
  const className = classNames({
    'mi mi-check-box': selected,
    'mi mi-check-box-outline-blank': !selected,
  });

  const newNode = Object.assign({}, node, { state: { selected: !selected } });
  return (
    <span>{children}<i className={className} onClick={() => onChange({
      node: newNode, type: SELECT
    })} /></span>
  );
};



class PropertyTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: props.nodes
    };
  }

  handleChange = nodes => {
    this.setState({ nodes });
  };


  selectNodes = (nodes, selected) =>
    nodes.map(node => ({
      ...node,
      children: node.children ? this.selectNodes(node.children, selected) : [],
      state: { ...node.state, selected },
    }));

  nodeSelectionHandler = (nodes, updatedNode) =>
    nodes.map(node => {
      if (node.id === updatedNode.id) {
        return {
          ...updatedNode,
          children: node.children ? this.selectNodes(node.children, updatedNode.state.selected) : [],
        };
      }

      if (node.children) {
        return { ...node, children: this.nodeSelectionHandler(node.children, updatedNode) };
      }

      return node;
    });


  extensions = {
    updateTypeHandlers: {
      [SELECT]: this.nodeSelectionHandler,
    },
  };

  render() {
    return (
      <Tree nodes={this.state.nodes} onChange={this.handleChange} extensions={this.extensions}>
        {({ node, ...rest }) => {
          return (<Expandable node={node} {...rest}>
            <Selection node={node} {...rest}>
              <NodeRenderer node={node} {...rest} />
            </Selection>
          </Expandable>)
        }}
      </Tree>);
  }
}

class App extends Component {
  render() {
    const objs = [
      { id: 'first-0-0', type: 'line' },
      { id: 'first-0-1', type: 'line' },
    ];

    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">React Object Property Tree</h1>
          </header>
        </div>
        <SplitPane minSize={200} defaultSize={400}>
          <PropertyTree nodes={objectsToNode(objs, schema)}/>
          <div>Hello</div>
        </SplitPane>
      </div>
    );
  }
}

export default App;
