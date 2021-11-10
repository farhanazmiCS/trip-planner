import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {useState} from 'react';

export default function Todo(props) {
    // State of input field
    const [todo, setTodo] = useState('');
    return (
        <>  
            <InputGroup>
                <Form.Control id={props.id} className="mb-3" type="text" placeholder="Any plans here?" value={todo} onChange={(e) => setTodo(e.target.value)} />
                <Button id={"delete-todo-" + props.id} className="mb-3" variant="outline-secondary" onClick={props.removeTodo}><FontAwesomeIcon icon={faTimes} /></Button>
            </InputGroup>
        </>
    )
}