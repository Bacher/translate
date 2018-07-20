import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Row, Name, Translate, Button } from './classes';
import Node from './Node';

const Root = styled.div`
    padding-top: 46px;
`;

const Header = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: #fff;
    z-index: 1;
`;

const FilterInput = styled.input.attrs({ type: 'search' })`
    height: 28px;
    border: none;
    padding: 0 10px;
    font-size: 16px;
    flex-grow: 1;
`;

const Buttons = styled.div`
    margin-right: 10px;
`;

const Locales = styled.div`
    margin: 0 10px;
`;

const Label = styled.label`
    margin-right: 10px;
`;

const LOCALES = ['en', 'ru', 'ro', 'sr', 'ua'];

let ren = 0;

export default class App extends PureComponent {
    state = {
        activeLocales: ['en', 'ru'],
        filter: decodeURIComponent(window.location.hash.substr(1)),
    };

    async componentDidMount() {
        window.addEventListener('hashchange', this._onHashChange);

        const { locales } = await callApi('getLocales');

        this.store = locales;
        this.forceUpdate();
    }

    render() {
        ren++;

        if (ren === 10000) {
            throw new Error('OVER'); // TODO
        }

        const { filter, activeLocales } = this.state;

        return (
            <Root>
                <Header>
                    <FilterInput
                        placeholder="Filter..."
                        value={filter}
                        onChange={this._onFilterChange}
                    />
                    <Locales>
                        {LOCALES.map(locale => (
                            <Label key={locale}>
                                <input
                                    type="checkbox"
                                    checked={activeLocales.includes(locale)}
                                    onChange={() => this._onToggleLocale(locale)}
                                />{' '}
                                {locale}
                            </Label>
                        ))}
                    </Locales>
                    <Buttons>
                        <Button onClick={this._onSaveClick}>Сохранить</Button>
                    </Buttons>
                </Header>
                <Row>
                    <Name>Name</Name>
                    {activeLocales.map(locale => (
                        <Translate key={locale}>{locale}</Translate>
                    ))}
                </Row>
                {this.store ? (
                    <Node
                        data={this.store}
                        filter={filter.toLowerCase()}
                        locales={activeLocales}
                    />
                ) : null}
            </Root>
        );
    }

    _onFilterChange = e => {
        this.setState({
            filter: e.target.value,
        });

        const filter = e.target.value.trim();

        if (filter) {
            window.history.replaceState(
                null,
                `Filter: ${filter}`,
                `#${filter}`,
            );
        } else {
            window.history.replaceState(null, 'Translate', '#');
        }
    };

    _onHashChange = () => {
        this.setState({
            filter: decodeURIComponent(window.location.hash.substr(1)),
        });
    };

    _onToggleLocale = locale => {
        let newLocales;

        if (this.state.activeLocales.includes(locale)) {
            newLocales = this.state.activeLocales.filter(l => l !== locale);
        } else {
            newLocales = [...this.state.activeLocales, locale];
        }

        this.setState({
            activeLocales: newLocales,
        });
    };

    _onSaveClick = async () => {
        const res = await callApi('saveLocales', this.store);
    };
}

// function mapToObj(map) {
//     const data = {};
//
//     stepMap(map, data);
//
//     return data;
// }
//
// function stepMap(map, data) {
//     for (let key of map) {
//         if (value instanceof Map) {
//             data[key] = {};
//             stepMap(value, data[key]);
//         } else {
//             data[key] = value;
//         }
//     }
// }

async function callApi(apiName, data) {
    const res = await fetch(`//localhost:3001/api/${apiName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: data ? JSON.stringify(data) : null,
    });

    if (!res.ok) {
        throw new Error('Bad response');
    }

    return await res.json();
}
