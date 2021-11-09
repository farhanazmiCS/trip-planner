import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import {useState} from 'react';

export default function Todo() {
    // State of input field
    const [todo, setTodo] = useState('');

    return (
        <>  
            <InputGroup>
                <Form.Control className="mb-3" type="text" placeholder="Any plans here?" value={todo} onChange={(e) => setTodo(e.target.value)} />
            </InputGroup>
        </>
    )
}