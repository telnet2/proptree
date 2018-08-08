import React from 'react';
import constants from '../contants';

class NameRenderer extends React.PureComponent {
    render() {
        const { value } = this.props;
        return (<span>{value}</span>);
    }
}

class EnumValueRenderer extends React.PureComponent {
    onChange = ({ target: { value } }) => {
        let node = this.props.node;
        node.value = value;
        this.props.onChange({
            node: node,
            type: constants.ENUM_VALUE_CHANGED
        });
    }

    render() {
        const { node: { value, schema } } = this.props;
        return (
            <select className="type-enum" name="enum" onChange={this.onChange} defaultValue={value}>
                {schema.enum.map((e, i) => (<option key={i} value={e}>{e}</option>))}
            </select>);
    }
}

const DefaultValueRenderer = ({ node: { value } }) => {
    return (<span>{value}</span>);
}

const NodeRenderer = ({ node, onChange, children }) => {
    let ValueRenderer = DefaultValueRenderer;
    if (node.schema && node.schema.enum) {
        ValueRenderer = EnumValueRenderer;
    }
    return (
        <span>
            <NameRenderer value={node.name} />: <ValueRenderer node={node} onChange={onChange} />
            {children}
        </span>);
}

export default NodeRenderer;