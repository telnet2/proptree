import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Tree, { renderers } from './react-tree';

import constants from './react-tree/contants';
import 'material-icons/css/material-icons.css'
import 'react-virtualized/styles.css'
import './react-tree/main.css'

import logo from './logo.svg';
import './App.css';

const { Expandable, Selectable, NodeRenderer } = renderers;

const schema = {
    type: "object",
    title: "VwdObject",
    properties: {
        id: {
            type: "string",
            title: "ObjectID"
        },
        class: {
            type: "string",
            enum: ["lane", "lane-property"]
        },
        type: {
            type: "string",
            enum: ["line", "polygon"]
        }
    }
}

/**
 *
 * @param {object[]} objs
 * @param {object} schema
 */
const objectsToNode = (objs, schema) => {
    let id = 0;
    const objectToNode = (obj) => {
        return {
            id: id++,
            name: obj.id,
            children: [
                {
                    id: id++,
                    name: "type",
                    value: obj.type,
                    schema: schema.properties.type
                }
            ].concat((obj.children && obj.children.map(objectToNode)) || [])
        }
    }
    return objs.map(obj => {
        return objectToNode(obj);
    });
}


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

    enumValueChanged = (nodes, updatedNode) => nodes.map(node => {
        if (node.id === updatedNode.id) {
            console.log(updatedNode);
            node.value = updatedNode.value;
        } else {
            if (node.children) {
                node.children = this.enumValueChanged(node.children, updatedNode);
            }
        }
        return node;
    });

    extensions = {
        updateTypeHandlers: {
            [constants.SELECT]: this.nodeSelectionHandler,
            [constants.ENUM_VALUE_CHANGED]: this.enumValueChanged,
        },
    };

    render() {
        return (
            <Tree nodes={this.state.nodes} onChange={this.handleChange} extensions={this.extensions}>
                {({ node, ...rest }) => {
                    return (
                        <Expandable node={node} {...rest}>
                            <Selectable node={node} {...rest}>
                                <NodeRenderer node={node} {...rest} />
                            </Selectable>
                        </Expandable>);
                }}
            </Tree>);
    }
}

class App extends Component {
    render() {
        const objs = [
            {
                class: 'lane',
                id: 'first-0',
                type: 'single',
                children: [
                    { id: 'first-0-0', class: 'lane-property', type: 'line' },
                    { id: 'first-0-1', class: 'lane-property', type: 'line' },
                ]
            },
            { id: 'second-0', type: 'line' },
            { id: 'second-1', type: 'line' },
        ];

        return (
            <SplitPane minSize={200} defaultSize={400}>
                <PropertyTree nodes={objectsToNode(objs, schema)} />
                <div>Hello</div>
            </SplitPane>
        );
    }
}

export default App;
