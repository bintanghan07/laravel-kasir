<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\TokoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [TransaksiController::class, 'index'])->middleware(['auth', 'verified'])->name('transaksi.add');
Route::post('/kategori', [KategoriController::class, 'store'])->middleware(['auth', 'verified'])->name('create.kategori');
Route::get('/kategori', [KategoriController::class, 'index'])->middleware(['auth', 'verified'])->name('my.kategori');
Route::post('/kategori/update', [KategoriController::class, 'update'])->middleware(['auth', 'verified'])->name('update.kategori');
Route::post('/kategori/delete', [KategoriController::class, 'destroy'])->middleware(['auth', 'verified'])->name('delete.kategori');

Route::post('/produk', [ProdukController::class, 'store'])->middleware(['auth', 'verified'])->name('create.produk');
Route::get('/produk', [ProdukController::class, 'index'])->middleware(['auth', 'verified'])->name('my.produk');
Route::post('/produk/update', [ProdukController::class, 'update'])->middleware(['auth', 'verified'])->name('update.produk');
Route::post('/produk/delete', [ProdukController::class, 'destroy'])->middleware(['auth', 'verified'])->name('delete.produk');

Route::post('/transaksi', [TransaksiController::class, 'store'])->middleware(['auth', 'verified'])->name('create.transaksi');
Route::get('/transaksi', [TransaksiController::class, 'show'])->middleware(['auth', 'verified'])->name('my.transaksi');
Route::post('/transaksi/delete', [TransaksiController::class, 'destroy'])->middleware(['auth', 'verified'])->name('delete.transaksi');

Route::get('/toko', [TokoController::class, 'index'])->middleware(['auth', 'verified'])->name('my.toko');
Route::post('/toko/update', [TokoController::class, 'update'])->middleware(['auth', 'verified'])->name('update.toko');

Route::get('/dashboard', [TokoController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
