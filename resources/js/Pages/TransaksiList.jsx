import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Table from "react-bootstrap/Table";
import { BsTrashFill } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import * as XLSX from 'xlsx';

export default function TransaksiList(props) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filterToday, setFilterToday] = useState("");
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        if (!props.myTransaksi) {
            Inertia.get("/produk");
        }
    }, []);

    const totalModal = props.myTransaksi?.reduce((acc, transaksi) => acc + (transaksi.jumlah * transaksi.beli), 0) || 0;
    const totalPenjualan = props.myTransaksi?.reduce((acc, transaksi) => acc + (transaksi.jumlah * transaksi.jual), 0) || 0;
    const totalBarang = props.myTransaksi?.reduce((acc, transaksi) => acc + (transaksi.jumlah * 1), 0) || 0;
    const totalLaba = totalPenjualan - totalModal;

    const sortedTransaksi = () => {
        let sortableItems = [...props.myTransaksi];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const isToday = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const filteredTransaksi = sortedTransaksi().filter((transaksi) => {
        const matchToday = filterToday ? isToday(transaksi.created_at) : true;
        const matchMonthYear = month && year ? (new Date(transaksi.created_at).getMonth() + 1 === parseInt(month) && new Date(transaksi.created_at).getFullYear() === parseInt(year)) : true;
        return matchToday && matchMonthYear;
    });

    const paginatedTransaksi = filteredTransaksi.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredTransaksi.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet([]);
        const workbook = XLSX.utils.book_new();

        // Add title
        XLSX.utils.sheet_add_aoa(worksheet, [["Laporan Penjualan"]], { origin: "A1" });
        worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];
        worksheet["A1"].s = {
            font: {
                name: 'Arial',
                sz: 16,
                bold: true,
                color: { rgb: "000000" },
                center: true
            },
            alignment: {
                horizontal: "center",
                vertical: "center"
            }
        };

        // Add headers
        const headers = [["No", "ID Barang", "Nama Barang", "Jumlah", "Modal", "Total", "Kasir", "Tanggal Input"]];
        XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A3" });

        // Add data
        XLSX.utils.sheet_add_json(worksheet, data, { origin: "A4", skipHeader: true });

        // Add summary row
        const summaryRow = [
            "Total",
            "",
            "",
            totalBarang,
            totalModal,
            totalPenjualan,
            "Keuntungan",
            totalLaba
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [summaryRow], { origin: -1 });
        worksheet['!cols'] = [
            { wpx: 40 },  // No
            { wpx: 100 }, // ID Barang
            { wpx: 150 }, // Nama Barang
            { wpx: 60 },  // Jumlah
            { wpx: 100 }, // Modal
            { wpx: 100 }, // Total
            { wpx: 100 }, // Kasir
            { wpx: 150 }  // Tanggal Input
        ];
        // Style header row
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: 2, c: C })];
            if (cell) {
                cell.s = {
                    font: {
                        name: 'Arial',
                        sz: 12,
                        bold: true,
                        color: { rgb: "FFFFFF" }
                    },
                    fill: {
                        fgColor: { rgb: "4F81BD" }
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: "center"
                    }
                };
            }
        }

        // Style data rows
        for (let R = 3; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell) {
                    cell.s = {
                        font: {
                            name: 'Arial',
                            sz: 10,
                            color: { rgb: "000000" }
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center"
                        }
                    };
                }
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");
        XLSX.writeFile(workbook, fileName);
    };

    const exportFilteredData = () => {
        const data = filteredTransaksi.map(({ id, produk_id, produk_name, jumlah, beli, jual, user_name, created_at }, index) => ({
            No: index + 1,
            ID_Barang: produk_id,
            Nama_Barang: produk_name,
            Jumlah: jumlah,
            Modal: jumlah * beli,
            Total: jumlah * jual,
            Kasir: user_name,
            Tanggal_Input: formatDate(created_at),
        }));

        exportToExcel(data, 'Transaksi_Filtered.xlsx');
    };

    return (
        <AuthenticatedLayout user={props.auth.user}>
            <Head title="Laporan" />
            <div className="py-4">
                <div className="p-4">
                    <Form.Control
                        type="date"
                        label="Hanya hari ini"
                        value={filterToday}
                        onChange={() => setFilterToday(!filterToday)}
                        className="mb-3"
                    />
                    <Form.Control
                        type="number"
                        placeholder="Bulan"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="mb-3"
                    />
                    <Form.Control
                        type="number"
                        placeholder="Tahun"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="mb-3"
                    />
                    <Button onClick={exportFilteredData} className="mb-3">Export to Excel</Button>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th onClick={() => requestSort('produk_id')}>ID Barang</th>
                                <th onClick={() => requestSort('produk_name')}>Nama Barang</th>
                                <th onClick={() => requestSort('jumlah')}>Jumlah</th>
                                <th onClick={() => requestSort('beli')}>Modal</th>
                                <th onClick={() => requestSort('jual')}>Total</th>
                                <th>Kasir</th>
                                <th onClick={() => requestSort('created_at')}>Tanggal Input</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransaksi && paginatedTransaksi.length > 0 ? (
                                paginatedTransaksi.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                            <td>{e.produk_id}</td>
                                            <td>{e.produk_name}</td>
                                            <td>{e.jumlah}</td>
                                            <td>{(e.jumlah) * (e.beli)}</td>
                                            <td>{(e.jumlah) * (e.jual)}</td>
                                            <td>{e.user_name}</td>
                                            <td>{formatDate(e.created_at)}</td>
                                            <td>
                                                <div>
                                                    <Link
                                                        href={route("delete.transaksi")}
                                                        method="post"
                                                        data={{ id: e.id }}
                                                        as="button"
                                                    >
                                                        <Button variant="danger">
                                                            <BsTrashFill />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9">Anda belum memiliki Produk</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={3}>Total Penjualan</th>
                                <th>{totalBarang}</th>
                                <th>{totalModal}</th>
                                <th>{totalPenjualan}</th>
                                <th>Keuntungan</th>
                                <th colSpan={2}>{totalLaba}</th>
                            </tr>
                        </tfoot>
                    </Table>
                    <Pagination>
                        {pageNumbers.map(number => (
                            <Pagination.Item
                                key={number}
                                active={number === currentPage}
                                onClick={() => setCurrentPage(number)}
                            >
                                {number}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
