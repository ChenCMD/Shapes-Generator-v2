import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import { IndexedPoint } from '../types/Point';
import { StateDispatcher } from '../types/StateDispatcher';
import Inspector from './Inspector';
import ShapeList from './ShapeList';

interface UserInterfaceProps {
    shapes: Shape[]
    latestSelect: number[]
    shapesDispatch: ShapesDispatch
    setContextTarget: StateDispatcher<IndexedPoint | undefined>
}

const UserInterface = ({ shapes, latestSelect, shapesDispatch, setContextTarget }: UserInterfaceProps): JSX.Element => (
    <Container fluid>
        <Row noGutters>
            <Col xl={5} lg={5} md={12} sm={12} xs={12}>
                <Container fluid>
                    <Row>
                        <Col>
                            <ShapeList
                                shapes={shapes.map(shape => ({ name: shape.name, uuid: shape.uuid, isSelected: shape.isSelected }))}
                                {...{ latestSelect, shapesDispatch, setContextTarget }}
                            />
                        </ Col>
                    </ Row>
                    <Row>
                        <Col>
                            <ShapeList
                                shapes={shapes.map(shape => ({ name: shape.name, uuid: shape.uuid, isSelected: shape.isSelected }))}
                                {...{ latestSelect, shapesDispatch, setContextTarget }}
                            />
                        </ Col>
                    </ Row>
                </Container>
            </ Col>
            <Col xl={7} lg={7} md={12} sm={12} xs={12}>
                <Inspector {...{ shapes, shapesDispatch }} />
            </Col>
        </ Row>
    </Container>
);

export default React.memo(UserInterface);
