<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\transaksi;
use App\Models\Produk;
use App\Models\toko;
use Illuminate\Http\Request;

class TransaksiController extends Controller
{
    public function index()
    {
         $myProduk = Produk::all();
         $myToko = toko::first();
        return Inertia::render('AddTransaksi', [
            'myProduk' => $myProduk,
            'myToko' => $myToko,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    $transaksiData = $request->dataTransaksi;
    $produkUpdateData = $request->produkUpdate;

    // Save multiple transaksi records
    foreach ($transaksiData as $transaksiItem) {
        $transaksi = new Transaksi();
        $transaksi->produk_id = $transaksiItem['produk_id'];
        $transaksi->jumlah = $transaksiItem['jumlah'];
        $transaksi->user_id = $transaksiItem['user_id'];
        $transaksi->created_at = $transaksiItem['tanggal'];
        $transaksi->save();
    }

    // Update multiple produk records
    foreach ($produkUpdateData as $produkItem) {
        Produk::where('id', $produkItem['produk_id'])->update([
            'stok' => $produkItem['jumlah'],
        ]);
    }
}


    public function show(transaksi $transaksi)
    {
        $myTransaksi = $transaksi::join('produks', 'transaksis.produk_id', '=', 'produks.id')->join('users', 'transaksis.user_id', '=', 'users.id')->select('transaksis.*', 'produks.name as produk_name', 'users.name as user_name', 'produks.beli as beli', 'produks.jual as jual')->get();
        $myProduk = produk::all();
        return Inertia::render('TransaksiList', [
            'myProduk' => $myProduk,
            'myTransaksi' => $myTransaksi,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Produk  $transaksi
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $transaksi = transaksi::find($request->id);
        $transaksi->delete();
        return redirect()->back()->with('message', 'berita berhasil dihapus');
    }
}
