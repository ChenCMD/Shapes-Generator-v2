import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/Inspector.module.scss';
import NormalParameterBox from './ParameterBox/Normal';
import PosParameterBox from './ParameterBox/Pos';
import RangeParameterBox from './ParameterBox/Range';
import TargetParameterBox from './ParameterBox/Target';
import BoolParameterBox from './ParameterBox/Bool';

interface InspectorProps {
    shapes: Shape[]
    shapesDispatch: ShapesDispatch
}

const Inspector = ({ shapes, shapesDispatch }: InspectorProps): JSX.Element => {
    // TODO 複数選択時の挙動
    const paramBoxes = shapes.map((s, i) => ({ s, i }))
        .filter(v => v.s.isSelected)
        .flatMap(({ s: shape, i: index }) =>
            shape.getParameterMap().map(([arg, param]) => {
                const colWrap = (elem: JSX.Element) => (<Col key={`${shape.uuid}-${arg}`} xs={12}>{elem}</Col>);
                const props = { type: shape.type, arg, index, shapesDispatch };
                switch (param.type) {
                    case 'pos':
                        return colWrap(<PosParameterBox {...props} data={param} indexMap={shapes.map(v => v.uuid)} />);
                    case 'range':
                        return colWrap(<RangeParameterBox {...props} data={param} />);
                    case 'target':
                        return colWrap(<TargetParameterBox {...props} data={param} shapes={shapes} />);
                    case 'boolean':
                        return colWrap(<BoolParameterBox {...props} data={param} />);
                    case 'normal':
                    default:
                        return colWrap(<NormalParameterBox {...props} data={param} />);
                }
            })
        );

    return (
        <div className={styles['window']}>
            <Container fluid className={styles['container']}>
                <Row>
                    {paramBoxes}
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(Inspector);
