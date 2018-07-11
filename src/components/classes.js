import styled from 'styled-components';

export const Row = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 10px;

    &:nth-child(even) {
        background: azure;
    }
`;

export const Name = styled.div`
    width: 400px;
    word-wrap: break-word;
`;

export const Translate = styled.div`
    flex-basis: 400px;
    flex-grow: 1;
    padding: 0 4px;
`;

export const Button = styled.button.attrs({ type: 'button' })``;
