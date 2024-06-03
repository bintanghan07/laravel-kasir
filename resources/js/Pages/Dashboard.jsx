import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Row, Col } from 'react-bootstrap';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            user={props.auth.user}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <Row>
                            <Col>
                            <Card>
                            <Card.Header className='bg-info font-bold text-xl text-center'>
                                Jumlah Kategori
                            </Card.Header>
                            <Card.Body className='font-bold text-xl text-center'>
                                {props.myKategori}
                            </Card.Body>
                        </Card>
                            </Col>
                            <Col>
                            <Card>
                            <Card.Header className='bg-info font-bold text-xl text-center'>
                                Jumlah Produk
                            </Card.Header>
                            <Card.Body className='font-bold text-xl text-center'>
                                {props.myProduk}
                            </Card.Body>
                        </Card>
                            </Col>
                            <Col>
                            <Card>
                            <Card.Header className='bg-info font-bold text-xl text-center'>
                                Jumlah Transaksi
                            </Card.Header>
                            <Card.Body className='font-bold text-xl text-center'>
                                {props.myTransaksi}
                            </Card.Body>
                        </Card>
                            </Col>
                        </Row>
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
