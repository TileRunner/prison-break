import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const GetOptions = ({submitOptions, cancelOptions}) => {
    const [isJumbleMode, setIsJumbleMode] = useState(false);
    const [rackSize, setRackSize] = useState(7);
    const handleChangeIsJumbleMode = () => {
        setIsJumbleMode(!isJumbleMode);
    }
    function mysubmit(event) {
        event.preventDefault();
        let options = {rackSize: rackSize, isJumbleMode: isJumbleMode};
        submitOptions(options);
    }
    return(
        <Form onSubmit={mysubmit}>
            <Form.Label as={'h1'}>Options</Form.Label>
            <Row>
                <Col>
                    <Form.Check
                    type='switch'
                    label={<><span className='cb1'>Jumble Mode</span><span className='cb2'>When selected, letters in words can be in any order.</span></>}
                    id='JumbleMode'
                    onChange={handleChangeIsJumbleMode}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label as={'h1'}>Rack Size:</Form.Label>
                </Col>
                <Col>
                    <Button
                    variant={rackSize === 4 ? 'success' : 'primary'}
                    type='button'
                    onClick={() => {setRackSize(4);}}
                    >
                        <h1>4</h1>
                    </Button>
                </Col>
                <Col>
                    <Button
                    variant={rackSize === 5 ? 'success' : 'primary'}
                    type='button'
                    onClick={() => {setRackSize(5);}}
                    >
                        <h1>5</h1>
                    </Button>
                </Col>
                <Col>
                    <Button
                    variant={rackSize === 6 ? 'success' : 'primary'}
                    type='button'
                    onClick={() => {setRackSize(6);}}
                    >
                        <h1>6</h1>
                    </Button>
                </Col>
                <Col>
                    <Button
                    variant={rackSize === 7 ? 'success' : 'primary'}
                    type='button'
                    onClick={() => {setRackSize(7);}}
                    >
                        <h1>7</h1>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col xs='auto'>
                    <Button
                    variant='danger'
                    type='button'
                    onClick={cancelOptions}
                    >
                        Cancel
                    </Button>
                </Col>
                <Col xs='auto'>
                    <Button
                    variant='primary'
                    type='submit'
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default GetOptions;