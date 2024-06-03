<?php

namespace App\Http\Controllers;


use Inertia\Inertia;
use App\Models\Kategori;
use App\Models\produk;
use Illuminate\Http\Request;

class ProdukController extends Controller
{
    public function index()
    {
        $myProduk = produk::join('kategoris', 'produks.kategori_id', '=', 'kategoris.id')->select('produks.*', 'kategoris.name as kategori_name')->get();
        $myKategori = Kategori::all();
        return Inertia::render('ProdukList', [
            'myProduk' => $myProduk,
            'myKategori' => $myKategori,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $produk = new Produk();
        $produk->name = $request->name;
        $produk->merk = $request->merk;
        $produk->kategori_id = $request->kategori_id;
        $produk->beli = $request->beli;
        $produk->jual = $request->jual;
        $produk->stok = $request->stok;
        $produk->satuan = $request->satuan;
        $produk->save();
        return redirect()->back()->with('message', 'berita berhasil dibuat');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Produk  $produk
     * @return \Illuminate\Http\Response
     */

    public function show(Produk $produk)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Produk  $produk
     * @return \Illuminate\Http\Response
     */
    public function edit(Produk $produk, Request $request)
    {
        return Inertia::render('EditProduk', [
            'myProduk' => $produk->find($request->id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Produk  $produk
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        Produk::where('id', $request->id)->update([
            'name' => $request->name,
            'merk' => $request->merk,
            'kategori_id' => $request->kategori_id,
            'beli' => $request->beli,
            'jual' => $request->jual,
            'stok' => $request->stok,
            'satuan' => $request->satuan,
        ]);
        return redirect()->back()->with('message', 'berita berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Produk  $produk
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $produk = Produk::find($request->id);
        $produk->transaksis()->delete();
        $produk->delete();
        return redirect()->back()->with('message', 'berita berhasil dihapus');
    }
}
