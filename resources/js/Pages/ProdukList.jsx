import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { BsFillGearFill, BsTrashFill, BsFillPlusSquareFill } from "react-icons/bs";
import EditProduk from "./EditProduk";
import { Card, Container, Alert, Pagination, Col, Form, Row, Button, Table } from "react-bootstrap";

export default function ProdukList(props) {
    const [name, setName] = useState("");
    const [merk, setMerk] = useState("");
    const [kategori_id, setKategori] = useState("");
    const [beli, setBeli] = useState("");
    const [jual, setJual] = useState("");
    const [stok, setStok] = useState("");
    const [satuan, setSatuan] = useState("");
    const [isNotif, setIsNotif] = useState(false);
    const [selectedProduk, setSelectedProduk] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
        const data = { name, merk, kategori_id, beli, jual, stok, satuan };

        const newErrors = {};
        if (!name) newErrors.name = "Nama Barang is required";
        if (!merk) newErrors.merk = "Merk is required";
        if (!kategori_id) newErrors.kategori_id = "Kategori is required";
        if (!beli) newErrors.beli = "Harga Beli is required";
        if (!jual) newErrors.jual = "Harga Jual is required";
        if (!stok) newErrors.stok = "Stok is required";
        if (!satuan) newErrors.satuan = "Satuan is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            Inertia.post("/produk", data);
            setIsNotif(true);
            setName("");
            setMerk("");
            setKategori("");
            setBeli("");
            setJual("");
            setStok("");
            setSatuan("");
            setErrors({});
        }
    };

    useEffect(() => {
        if (!props.myProduk) {
            Inertia.get("/produk");
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

    const filteredProducts = props.myProduk
        ? props.myProduk
              .filter((produk) =>
                  produk.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <AuthenticatedLayout user={props.auth.user}>
            <Head title="Produk" />
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
                            <Row>
                                <Col>
                                    <Form.Control
                                        placeholder="Nama Barang"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control
                                        placeholder="Merk"
                                        onChange={(e) => setMerk(e.target.value)}
                                        value={merk}
                                        isInvalid={!!errors.merk}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.merk}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Select
                                        aria-label="Default select example"
                                        onChange={(e) => setKategori(e.target.value)}
                                        value={kategori_id}
                                        isInvalid={!!errors.kategori_id}
                                    >
                                        <option value={""}>Pilih Kategori</option>
                                        {props.myKategori && props.myKategori.length > 0 ? (
                                            props.myKategori.map((data, i) => (
                                                <option key={i} value={data.id}>
                                                    {data.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>Anda belum memiliki Kategori</option>
                                        )}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.kategori_id}</Form.Control.Feedback>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Form.Control
                                        placeholder="Harga Beli"
                                        onChange={(e) => setBeli(e.target.value)}
                                        value={beli}
                                        isInvalid={!!errors.beli}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.beli}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control
                                        placeholder="Harga Jual"
                                        onChange={(e) => setJual(e.target.value)}
                                        value={jual}
                                        isInvalid={!!errors.jual}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.jual}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control
                                        placeholder="Stok"
                                        onChange={(e) => setStok(e.target.value)}
                                        value={stok}
                                        isInvalid={!!errors.stok}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.stok}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control
                                        placeholder="Satuan"
                                        onChange={(e) => setSatuan(e.target.value)}
                                        value={satuan}
                                        isInvalid={!!errors.satuan}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.satuan}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Button variant="info" onClick={handleSubmit}>
                                        <BsFillPlusSquareFill />
                                    </Button>
                                </Col>
                            </Row>
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
                                            <th onClick={() => handleSort("name")}>Nama Barang{sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                                            <th onClick={() => handleSort("merk")}>Merk{sortField === "merk" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                                            <th onClick={() => handleSort("kategori_name")}>Kategori{sortField === "kategori_name" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                                            <th onClick={() => handleSort("beli")}>Harga Beli{sortField === "beli" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                                            <th onClick={() => handleSort("jual")}>Harga Jual{sortField === "jual" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                                            <th onClick={() => handleSort("stok")}>Stok{sortField === "stok" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                                            <th onClick={() => handleSort("satuan")}>Satuan{sortField === "satuan" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.length > 0 ? (
                                            currentProducts.map((produk, i) => (
                                                <tr key={i}>
                                                    <td>{indexOfFirstProduct + i + 1}</td>
                                                    <td>{produk.name}</td>
                                                    <td>{produk.merk}</td>
                                                    <td>{produk.kategori_name}</td>
                                                    <td>{produk.beli}</td>
                                                    <td>{produk.jual}</td>
                                                    <td>{produk.stok}</td>
                                                    <td>{produk.satuan}</td>
                                                    <td>
                                                        <div>
                                                            <Button
                                                                variant="info"
                                                                onClick={() => {
                                                                    setSelectedProduk(produk);
                                                                    setShowEditModal(true);
                                                                }}
                                                            >
                                                                <BsFillGearFill />
                                                            </Button>{" "}
                                                            {"  "}
                                                            <Link
                                                                href={route("delete.produk")}
                                                                method="post"
                                                                data={{ id: produk.id }}
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
                                                <td colSpan="9" className="text-center">
                                                    Anda belum memiliki Produk
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
                {showEditModal && selectedProduk && (
                    <EditProduk
                        produk={selectedProduk}
                        onClose={() => setShowEditModal(false)}
                        kategori={props.myKategori}
                    />
                )}
            </Container>
        </AuthenticatedLayout>
    );
}
