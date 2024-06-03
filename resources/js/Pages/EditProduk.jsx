import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import Card from "react-bootstrap/Card";
import { Modal, Button, Form } from "react-bootstrap";

const EditProduk = ({ produk, onClose, kategori }) => {
    const [name, setName] = useState(produk.name);
    const [merk, setMerk] = useState(produk.merk);
    const [kategori_id, setKategori] = useState(produk.kategori_id);
    const [beli, setBeli] = useState(produk.beli);
    const [jual, setJual] = useState(produk.jual);
    const [stok, setStok] = useState(produk.stok);
    const [satuan, setSatuan] = useState(produk.satuan);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formErrors = {};
        if (!name) formErrors.name = "Nama Barang is required";
        if (!merk) formErrors.merk = "Merk is required";
        if (!kategori_id) formErrors.kategori_id = "Kategori is required";
        if (!beli || beli <= 0) formErrors.beli = "Harga Beli is required and must be greater than 0";
        if (!jual || jual <= 0) formErrors.jual = "Harga Jual is required and must be greater than 0";
        if (!stok || stok < 0) formErrors.stok = "Stok is required and must be 0 or more";
        if (!satuan) formErrors.satuan = "Satuan is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            const data = {
                id: produk.id,
                name,
                merk,
                kategori_id,
                beli,
                jual,
                stok,
                satuan,
            };
            Inertia.post("/produk/update", data);
            onClose(); // Close modal after submission
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Produk</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Card>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Barang</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nama Barang"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Merk</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Merk"
                                value={merk}
                                onChange={(e) => setMerk(e.target.value)}
                                isInvalid={!!errors.merk}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.merk}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Kategori</Form.Label>
                            <Form.Select
                                value={kategori_id}
                                onChange={(e) => setKategori(e.target.value)}
                                isInvalid={!!errors.kategori_id}
                            >
                                <option value={""}>Pilih Kategori</option>
                                {kategori.map((data) => (
                                    <option key={data.id} value={data.id}>
                                        {data.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.kategori_id}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Harga Beli</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Beli"
                                value={beli}
                                onChange={(e) => setBeli(e.target.value)}
                                isInvalid={!!errors.beli}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.beli}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Harga Jual</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Jual"
                                value={jual}
                                onChange={(e) => setJual(e.target.value)}
                                isInvalid={!!errors.jual}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.jual}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stok</Form.Label>
                            <Form.Control
                                type="number"
                                value={stok}
                                onChange={(e) => setStok(e.target.value)}
                                isInvalid={!!errors.stok}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.stok}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Satuan</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Satuan"
                                value={satuan}
                                onChange={(e) => setSatuan(e.target.value)}
                                isInvalid={!!errors.satuan}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.satuan}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Card.Body>
                </Card>
                <Modal.Footer>
                    <Button type="submit" className="btn btn-info">
                        UPDATE
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditProduk;
