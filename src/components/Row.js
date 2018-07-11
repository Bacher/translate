import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Row as Root, Translate } from './classes';

const RemoveKey = styled.i`
    position: absolute;
    right: 5px;
    top: 0;
    font-style: normal;
    color: #f00;
    opacity: 0;
    transition: opacity 0.15s;
    cursor: pointer;
    user-select: none;
`;

const Name = styled.div`
    position: relative;
    width: 400px;
    word-wrap: break-word;
    font-weight: bold;
    font-family: monospace;
    font-size: 18px;
    color: blue;
    
    &:hover ${RemoveKey} {
      opacity: 1;
    }
`;

const TranslateInput = styled.textarea`
    display: block;
    width: 100%;
`;

const Empty = styled.span`
    color: #999;
`;

const TranslateWrapper = styled.span`
    i {
        color: #999;
        white-space: nowrap;
    }
    b {
        color: #000;
    }
`;

export default class Node extends PureComponent {
    static defaultProps = {
        depth: 0,
        keyName: '',
        parentPath: '',
        filterOk: false,
    };

    state = {
        changes: null,
    };

    render() {
        const { depth, keyName, path, node, locales } = this.props;

        const { changes } = this.state;

        return (
            <Root>
                <Name style={{ paddingLeft: depth * 15 }}>
                    <RemoveKey onClick={this._onRemoveClick}>x</RemoveKey>
                    {keyName}
                </Name>
                {locales.map(
                    locale =>
                        changes && changes.has(locale) ? (
                            <Translate key={locale}>
                                <TranslateInput
                                    value={node[locale]}
                                    autoFocus
                                    onChange={e =>
                                        this._onTranslateChange(locale, e)
                                    }
                                    onBlur={this._onBlur}
                                />
                            </Translate>
                        ) : (
                            <Translate key={locale}>
                                <TranslateWrapper
                                    onMouseDown={this._onTranslateDown}
                                    onMouseUp={e =>
                                        this._onTranslateUp(locale, e)
                                    }
                                    dangerouslySetInnerHTML={
                                        node[locale] == null
                                            ? null
                                            : {
                                                  __html: highlightParams(
                                                      node[locale],
                                                  ),
                                              }
                                    }
                                >
                                    {node[locale] == null ? (
                                        <Empty>--Пусто--</Empty>
                                    ) : null}
                                </TranslateWrapper>
                            </Translate>
                        ),
                )}
            </Root>
        );
    }

    _onTranslateDown = e => {
        this._mouseDown = { x: e.clientX, y: e.clientY };
    };

    _onTranslateUp = (locale, e) => {
        const p = this._mouseDown;

        if (!p || Math.abs(p.x - e.clientX) + Math.abs(p.y - e.clientY) > 10) {
            return;
        }

        if (!this.state.changes) {
            this.state.changes = new Set();
        }

        this.state.changes.add(locale);
        this.forceUpdate();
    };

    _onTranslateChange = (locale, e) => {
        this.props.node[locale] = e.target.value;
        this.forceUpdate();
    };

    _onBlur = () => {
        this.state.changes = null;
        this.forceUpdate();
    };

    _onRemoveClick = () => {
        this.props.onRemove();
    };
}

function highlightParams(str) {
    return str
        .replace(/(?<!%)%\(([A-Za-z_][A-Za-z0-9_]*)\)s/g, (match, key) => {
            return `<i>%(<b>${key}</b>)s</i>`;
        })
        .replace(/%%/g, '%');
}
