import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Card from 'react-bootstrap/Card';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const EditKategori=({kategori, onClose}) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    console.log({name, kategori});
    const data = {
      id: kategori.id,
      name,
    }
    Inertia.post('/kategori/update', data)
    setName('')
  }

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
                <Modal.Title>Edit Kategori</Modal.Title>
            </Modal.Header>
            <Card>
      <Card.Body>
      <Form onSubmit={() => handleSubmit()}>
      <Form.Group className="mb-3">
        <Form.Label>Nama Kategori</Form.Label>
        <Form.Control type="text" placeholder="kategori" className="input" onChange={(title) => setName(title.target.value)} defaultValue={kategori.name} />
      </Form.Group>
    </Form>
</Card.Body>
    </Card> 
    <Modal.Footer>
    <Button className='btn btn-info' onClick={() => handleSubmit()}>UPDATE</Button>
      <Button variant="secondary" onClick={onClose}>Close</Button>
                </Modal.Footer>
    </Modal>
     
  )
}
export default EditKategori;