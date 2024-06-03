import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { Container, Alert, Row, Col, Button, Form } from "react-bootstrap";

export default function SettingToko(props) {
    const [name, setName] = useState(props.myToko.name || '');
    const [alamat, setAlamat] = useState(props.myToko.alamat || '');
    const [no_telp, setTelp] = useState(props.myToko.no_telp || '');
    const [nama_pemilik, setPemilik] = useState(props.myToko.nama_pemilik || '');
    const [id, setId] = useState(props.myToko.id);
    const [errors, setErrors] = useState({});
    const [isNotif, setIsNotif] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = { id, name, alamat, no_telp, nama_pemilik };

        const newErrors = {};
        if (!name) newErrors.name = "Nama toko is required";
        if (!alamat) newErrors.alamat = "Alamat is required";
        if (!no_telp) newErrors.no_telp = "No telp is required";
        if (!nama_pemilik) newErrors.nama_pemilik = "Nama pemilik is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            Inertia.post("/toko/update", data, {
                onSuccess: () => {
                    setIsNotif(true);
                }
            });
            setErrors({});
        }
    };

    return (
        <AuthenticatedLayout user={props.auth.user}>
            <Head title="Pengaturan Toko" />
            <Container fluid>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {isNotif && (
                                <Alert variant="info" onClose={() => setIsNotif(false)} dismissible>
                                    <Alert.Heading>Notification</Alert.Heading>
                                    <p>{props.flash.message}</p>
                                </Alert>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="formNamaToko">
                                            <Form.Label>Nama Toko</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                isInvalid={!!errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formNoTelp">
                                            <Form.Label>No Telp</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={no_telp}
                                                onChange={(e) => setTelp(e.target.value)}
                                                isInvalid={!!errors.no_telp}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.no_telp}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="formAlamat">
                                            <Form.Label>Alamat</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={alamat}
                                                onChange={(e) => setAlamat(e.target.value)}
                                                isInvalid={!!errors.alamat}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.alamat}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formNamaPemilik">
                                            <Form.Label>Nama Pemilik</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={nama_pemilik}
                                                onChange={(e) => setPemilik(e.target.value)}
                                                isInvalid={!!errors.nama_pemilik}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.nama_pemilik}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    
                                    <Col>
                                        <Button type="submit" variant="info">
                                            Update Data Toko
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}
