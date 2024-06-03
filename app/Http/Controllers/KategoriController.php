<?php

namespace App\Http\Controllers;

use App\Http\Resources\KategoriCollection;
use Inertia\Inertia;
use App\Models\kategori;
use App\Models\User;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $myKategori = kategori::all();
        return Inertia::render('KategoriList', [
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
        $kategori = new Kategori();
        $kategori->name = $request->name;
        $kategori->save();
        return redirect()->back()->with('message', 'berita berhasil dibuat');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Kategori  $kategori
     * @return \Illuminate\Http\Response
     */

    public function show(Kategori $kategori)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Kategori  $kategori
     * @return \Illuminate\Http\Response
     */
    public function edit(Kategori $kategori, Request $request)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Kategori  $kategori
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        Kategori::where('id', $request->id)->update([
            'name' => $request->name,
        ]);
        
        return redirect()->back()->with('message', 'berita berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Kategori  $kategori
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        // Validate the request data
        $request->validate([
            'id' => 'required|exists:kategoris,id',
        ]);
    
        // Find the category by ID
        $kategori = Kategori::findOrFail($request->id);
    
        // Loop through each product related to the category
        foreach ($kategori->produks as $produk) {
            // Delete each transaction related to the product
            $produk->transaksis()->delete();
        }
    
        // Delete the products related to the category
        $kategori->produks()->delete();
    
        // Delete the category itself
        $kategori->delete();
    
        // Redirect back with a success message
        return redirect()->back()->with('message', 'Kategori dan data terkait berhasil dihapus');
    }
    
}
