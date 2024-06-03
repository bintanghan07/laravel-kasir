import React, { forwardRef } from "react";
import { Table } from "react-bootstrap";
import dayjs from "dayjs";

const PrintableReceipt = forwardRef(({ dataTransaksi, totalPenjualan, bayar, kembali, user, myToko }, ref) => {
    return (
        <div ref={ref} className="receipt" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center" }}>{myToko.name}</h2>
            <p style={{ textAlign: "center" }}>{myToko.alamat}</p>
            <p>Tanggal: {dayjs().format("DD MMM YYYY, HH:mm")}</p>
            <p>Kasir: {user.name}</p>
            <Table size="sm">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Barang</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {dataTransaksi.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.jumlah}</td>
                            <td>{item.jumlah * item.jual}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3" style={{ textAlign: "right" }}>Total:</td>
                        <td>Rp. {totalPenjualan.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ textAlign: "right" }}>Bayar:</td>
                        <td>Rp. {bayar.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" style={{ textAlign: "right" }}>Kembali:</td>
                        <td>Rp. {kembali.toLocaleString('id-ID')}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
});

export default PrintableReceipt;
