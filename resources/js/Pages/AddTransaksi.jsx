import React, { useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import { BsTrashFill, BsCartPlus } from "react-icons/bs";
import {
    Container,
    Button,
    Form,
    Row,
    Table,
    Card,
    Pagination,
} from "react-bootstrap";
import dayjs from "dayjs";  // Importing dayjs for date handling
import PrintableReceipt from "@/Components/PrintableReceipt";
import { useReactToPrint } from 'react-to-print';

export default function AddTransaksi(props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [dataTransaksi, setDataTransaksi] = useState([]);
    const [bayar, setBayar] = useState("");
    const receiptRef = useRef();

    const handlePrintReceipt = useReactToPrint({
        content: () => receiptRef.current,
        documentTitle: 'Receipt',
    });

    const handleSubmit = () => {
        const transaksiData = dataTransaksi.map((item) => ({
            tanggal: item.tanggal,
            produk_id: item.id,
            jumlah: item.jumlah,
            user_id: item.user_id,
        }));

        const produkUpdateData = dataTransaksi.map((item) => {
            const product = props.myProduk.find((p) => p.id === item.id);
            return {
                produk_id: item.id,
                jumlah: product.stok - item.jumlah,
            };
        });
        Inertia.post("/transaksi", { dataTransaksi: transaksiData, produkUpdate: produkUpdateData });
        setDataTransaksi([]);
        setSearchTerm("");
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectProduct = (product) => {
        const existingProduct = dataTransaksi.find((item) => item.id === product.id);
        if (existingProduct) {
            setDataTransaksi(
                dataTransaksi.map((item) =>
                    item.id === product.id ? { ...item, jumlah: item.jumlah + 1 } : item
                )
            );
        } else {
            setDataTransaksi([
                ...dataTransaksi,
                {
                    ...product,
                    jumlah: 1,
                    tanggal: dayjs(),
                    user_id: props.auth.user.id,
                    user_name: props.auth.user.name,
                },
            ]);
        }
    };

    const handleRemoveProduct = (productId) => {
        setDataTransaksi(dataTransaksi.filter((item) => item.id !== productId));
    };

    const handleChangeJumlah = (productId, jumlah) => {
        setDataTransaksi(
            dataTransaksi.map((item) =>
                item.id === productId ? { ...item, jumlah: parseInt(jumlah) } : item
            )
        );
    };

    const sortedProduk = () => {
        let sortableItems = [...props.myProduk];
        return sortableItems;
    };

    const totalPenjualan = dataTransaksi?.reduce(
        (acc, transaksi) => acc + transaksi.jumlah * transaksi.jual,
        0
    ) || 0;
    const kembali = bayar - totalPenjualan;
    const filteredTransaksi = sortedProduk().filter((produk) => {
        const matchSearchTerm = produk.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchSearchTerm;
    });

    const paginatedTransaksi = filteredTransaksi.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredTransaksi.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <AuthenticatedLayout user={props.auth.user}>
            <Head title="Transaksi" />
            <Container fluid>
                <Row className="py-12">
                    <div className="col-sm-4">
                        <div className="card card-primary mb-3">
                            <div className="card-header bg-primary text-white">
                                <h5>
                                    <i className="fa fa-search"></i> Cari Barang
                                </h5>
                            </div>
                            <div className="card-body">
                                <Form.Control
                                    type="text"
                                    placeholder="Cari Nama Produk"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="mb-3"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="card card-primary mb-3">
                            <div className="card-header bg-primary text-white">
                                <h5>
                                    <i className="fa fa-list"></i> Hasil Pencarian
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    {searchTerm !== "" && paginatedTransaksi && paginatedTransaksi.length > 0 ? (
                                        <Table size="sm">
                                            <thead>
                                                <tr>
                                                    <th>ID Barang</th>
                                                    <th>Nama Barang</th>
                                                    <th>Merk</th>
                                                    <th>Harga Jual</th>
                                                    <th>Stok</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedTransaksi.map((e, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{e.id}</td>
                                                            <td>{e.name}</td>
                                                            <td>{e.merk}</td>
                                                            <td>{e.jual}</td>
                                                            <td>{e.stok}</td>
                                                            <td>
                                                                <div>
                                                                    <Button
                                                                        variant="info"
                                                                        onClick={() => handleSelectProduct(e)}
                                                                    >
                                                                        <BsCartPlus />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="6">Anda belum memiliki Produk</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <Card >
                            <Card.Header className="card-header bg-primary text-white">
                                <h5>
                                    KASIR
                                    <Button
                                        variant="danger"
                                        className="float-right"
                                        onClick={() => setDataTransaksi([])}
                                    >
                                        <b>RESET KERANJANG</b>
                                    </Button>
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Form.Label>Tanggal</Form.Label>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        disabled={true}
                                                        value={dayjs().format("DD/MM/YYYY hh:mm")}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="dataTables_wrapper dt-bootstrap4 no-footer">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <td>No</td>
                                                            <td>Nama Barang</td>
                                                            <td>Jumlah</td>
                                                            <td>Total</td>
                                                            <td>Kasir</td>
                                                            <td>Action</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataTransaksi && dataTransaksi.length > 0 ? (
                                                            dataTransaksi.map((e, i) => (
                                                                <tr key={i}>
                                                                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                                                    <td>{e.name}</td>
                                                                    <td>
                                                                        <Form.Control
                                                                        type="number"
                                                                            name="jumlah"
                                                                            value={e.jumlah}
                                                                            onChange={(event) =>
                                                                                handleChangeJumlah(
                                                                                    e.id,
                                                                                    event.target.value
                                                                                )
                                                                            }
                                                                        ></Form.Control>
                                                                    </td>
                                                                    <td>{e.jumlah * e.jual}</td>
                                                                    <td>{e.user_name}</td>
                                                                    <td>
                                                                        <div>
                                                                            <Button
                                                                                variant="danger"
                                                                                onClick={() =>
                                                                                    handleRemoveProduct(e.id)
                                                                                }
                                                                            >
                                                                                <BsTrashFill />
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6">
                                                                    Belum ada barang yang di masukkan
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td>Total Semua</td>
                                                    <td>
                                                        <div className="input-group">
                                                            <span className="input-group-text">Rp</span>
                                                            <Form.Control
                                                                type="text"
                                                                disabled={true}
                                                                name="total"
                                                                value={totalPenjualan}
                                                            />
                                                        </div>
                                                    </td>

                                                    <td>Bayar</td>
                                                    <td>
                                                        <div className="input-group">
                                                            <span className="input-group-text">Rp</span>
                                                            <Form.Control
                                                                type="text"
                                                                name="bayar"
                                                                value={bayar}
                                                                onChange={(e) =>
                                                                    setBayar(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    
                                                    <td></td>
                                                </tr>

                                                <tr>
                                                    <td>Kembali</td>
                                                    <td>
                                                        <div className="input-group">
                                                            <span className="input-group-text">Rp</span>
                                                            <Form.Control
                                                                type="text"
                                                                disabled={true}
                                                                value={kembali}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                        <Button variant="secondary" onClick={handlePrintReceipt} >
                                                            Print Untuk Bukti Pembayaran
                                                        </Button>{" "}
                                                        <Button
                                                            variant="success"
                                                            onClick={handleSubmit}
                                                        >
                                                            Simpan Transaksi
                                                        </Button>
                                                    </td>
                                                    <td>
                                                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <br />
                                        <br />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </Container>

            {/* Hidden printable receipt */}
            <div style={{ display: "none" }}>
                <PrintableReceipt
                    ref={receiptRef}
                    dataTransaksi={dataTransaksi}
                    totalPenjualan={totalPenjualan}
                    bayar={bayar}
                    kembali={kembali}
                    user={props.auth.user}
                    myToko={props.myToko}
                />
            </div>
        </AuthenticatedLayout>
    );
}
