import React from 'react';
import classNames from 'classnames';
import constants from '../contants';
import { Renderer } from '../shapes/rendererShapes';

const Selectable = ({ node, children, onChange }) => {
    const { state: { selected } = {}, ...rest } = node;
    const className = classNames({
        'mi mi-check-box': selected,
        'mi mi-check-box-outline-blank': !selected,
    });
    return (
        <span>{children}<i className={className} onClick={() => onChange({
            node: Object.assign(node, {
                state: { selected: !selected }
            }),
            type: constants.SELECT
        })} /></span>
    );
};

Selectable.propTypes = {
    ...Renderer,
};

export default Selectable;