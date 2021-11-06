import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// FontAwesome Icon
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

export default function Todo() {
    return (
        <>  
            <Form.Control type="text" />
            <Button variant="primary"><FontAwesomeIcon icon={faPlus} /></Button>
        </>
    )
}