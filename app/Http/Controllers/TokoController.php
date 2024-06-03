<?php

namespace App\Http\Controllers;

use App\Models\toko;
use App\Models\produk;
use App\Models\kategori;
use App\Models\transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TokoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $myToko = toko::all()->first();
        return Inertia::render('SettingToko', [
            'myToko' => $myToko,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function dashboard()
    {
        $myTransaksi = transaksi::count();
        $myProduk = Produk::count();
        $myKategori = Kategori::count();
        return Inertia::render('Dashboard', [
            'myTransaksi' => $myTransaksi,
            'myProduk' => $myProduk,
            'myKategori' => $myKategori,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(toko $toko)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        toko::where('id', $request->id)->update([
            'name' => $request->name,
            'alamat' => $request->alamat,
            'no_telp' => $request->no_telp,
            'nama_pemilik' => $request->nama_pemilik,
        ]);
        return redirect()->back()->with('message', 'berita berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(toko $toko)
    {
        //
    }
}
