import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Todo(props) {
    const id = props.id;
    return (
        <>  
            <InputGroup id={id}>
                <Form.Control id={"todo-" + id} className="mb-3" type="text" placeholder="Enter Plan..." value={props.value} onChange={props.onChange} />
                <Button id={"delete-todo-" + id} className="mb-3" variant="outline-danger" onClick={() => props.removeTodo(id)}><FontAwesomeIcon icon={faTimes} /></Button>
            </InputGroup>
        </>
    )
}