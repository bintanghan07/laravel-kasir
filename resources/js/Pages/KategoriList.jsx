import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { BsFillGearFill, BsTrashFill, BsFillPlusSquareFill } from "react-icons/bs";
import EditKategori from "./EditKategori";
import { Card, Container, Alert, Pagination, Row, Col, Button, Table, Form } from "react-bootstrap";

export default function KategoriList(props) {
    const [name, setName] = useState("");
    const [isNotif, setIsNotif] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
        const data = { name };

        const newErrors = {};
        if (!name) newErrors.name = "Kategori Baru is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            Inertia.post("/kategori", data);
            setIsNotif(true);
            setName("");
            setErrors({});
        }
    };

    useEffect(() => {
        if (!props.myKategori) {
            Inertia.get("/kategori");
        }
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const filteredKategori = props.myKategori
        ? props.myKategori
              .filter((kategori) =>
                  kategori.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => {
                  if (sortField) {
                      if (a[sortField] < b[sortField]) {
                          return sortOrder === "asc" ? -1 : 1;
                      }
                      if (a[sortField] > b[sortField]) {
                          return sortOrder === "asc" ? 1 : -1;
                      }
                  }
                  return 0;
              })
        : [];

    const indexOfLastKategori = currentPage * itemsPerPage;
    const indexOfFirstKategori = indexOfLastKategori - itemsPerPage;
    const currentKategori = filteredKategori.slice(indexOfFirstKategori, indexOfLastKategori);

    const totalPages = Math.ceil(filteredKategori.length / itemsPerPage);

    return (
        <AuthenticatedLayout user={props.auth.user}>
            <Head title="Kategori" />
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
                                    <Form.Control
                                        placeholder="Kategori Baru"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Button variant="info" onClick={handleSubmit}>
                                        <BsFillPlusSquareFill />
                                    </Button>
                                </Col>
                            </Row>
                            </Form>
                        </div>
                    </div>
                    <div className="p-4">
                        <Card>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </Col>
                                </Row>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th onClick={() => handleSort("name")}>
                                                Kategori {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentKategori.length > 0 ? (
                                            currentKategori.map((kategori, i) => (
                                                <tr key={i}>
                                                    <td>{indexOfFirstKategori + i + 1}</td>
                                                    <td>{kategori.name}</td>
                                                    <td>
                                                        <div>
                                                            <Button
                                                                variant="info"
                                                                onClick={() => {
                                                                    setSelectedKategori(kategori);
                                                                    setShowEditModal(true);
                                                                }}
                                                            >
                                                                <BsFillGearFill />
                                                            </Button>{" "}
                                                            {"  "}
                                                            <Link
                                                                href={route("delete.kategori")}
                                                                method="post"
                                                                data={{ id: kategori.id }}
                                                                as="button"
                                                            >
                                                                <Button variant="danger">
                                                                    <BsTrashFill />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center">
                                                    Anda belum memiliki kategori
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Pagination>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Pagination.Item
                                            key={i + 1}
                                            active={i + 1 === currentPage}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                {showEditModal && selectedKategori && (
                    <EditKategori
                        kategori={selectedKategori}
                        onClose={() => setShowEditModal(false)}
                    />
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
