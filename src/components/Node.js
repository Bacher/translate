import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Button } from './classes';
import Row from './Row';

const Root = styled.div``;
const NodeItems = styled.div``;
const Path = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 10px;
    font-family: monospace;
    font-size: 18px;
    background: #bbb;
`;
const PathLink = styled.a`
    font-weight: bold;
    color: blue;
    text-decoration: none;
`;

const Actions = styled.div`
    display: flex;
    padding-left: 10px;
`;

export default class Node extends PureComponent {
    static defaultProps = {
        depth: 0,
        keyName: '',
        parentPath: '',
        filterOk: false,
    };

    render() {
        const {
            data,
            depth,
            keyName,
            parentPath,
            filter,
            filterOk,
            locales,
        } = this.props;

        const items = [];
        const subNodes = [];

        for (let key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            const node = data[key];
            const path = (parentPath ? parentPath + '.' : '') + key;
            const _filterOk = filterOk || path.toLowerCase().includes(filter);

            if (!node.__type) {
                subNodes.push(
                    <Node
                        key={key}
                        data={node}
                        depth={depth + 1}
                        keyName={keyName}
                        parentPath={path}
                        filter={filter}
                        filterOk={_filterOk}
                        locales={locales}
                    />,
                );
            } else {
                if (_filterOk) {
                    items.push(
                        <Row
                            key={key}
                            depth={depth}
                            keyName={key}
                            path={path}
                            node={node}
                            locales={locales}
                            onRemove={() => this._onRemoveKey(key)}
                        />,
                    );
                }
            }
        }

        return (
            <Root>
                <Path>
                    {parentPath ? (
                        <PathLink href={`#${parentPath}`}>
                            {parentPath}
                        </PathLink>
                    ) : (
                        '/'
                    )}
                    <Actions>
                        <Button onClick={this._onAddNodeClick}>
                            Добавить узел
                        </Button>
                        <Button onClick={this._onAddKeyClick}>
                            Добавить ключ
                        </Button>
                    </Actions>
                </Path>
                <NodeItems>
                    {items}
                    {subNodes}
                </NodeItems>
            </Root>
        );
    }

    _onAddNodeClick = () => {
        const nodeName = (window.prompt('Node name:') || '').trim();

        if (nodeName) {
            this.props.data[nodeName] = {};
            this.forceUpdate();
        }
    };

    _onAddKeyClick = () => {
        const keyName = (window.prompt('Key name:') || '').trim();

        if (keyName) {
            this.props.data[keyName] = {
                __type: 'leaf',
            };
            this.forceUpdate();
        }
    };

    _onRemoveKey = key => {
        delete this.props.data[key];
        this.forceUpdate();
    };
}
