import { useEffect, useState } from "react";
import axios from "axios";

function App() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/api/products")
			.then((response) => {
				setProducts(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<>
			<div className='w-full flex justify-center items-center p-10'>
				<div className='flex w-2/3 justify-center items-center gap-2'>
					<div className='overflow-x-auto'>
						<div className='flex py-5 px-1'>
							<label className='input input-bordered flex items-center gap-2'>
								<input type='text' className='grow' placeholder='Search' />
								<kbd className='kbd kbd-sm'>⌘</kbd>
								<kbd className='kbd kbd-sm'>K</kbd>
							</label>
						</div>
						<table className='table'>
							{/* head */}
							<thead className='bg-base-300'>
								<tr>
									<th>No</th>
									<th>Nama Barang</th>
									<th>Stok</th>
									<th>Jumlah Terjual</th>
									<th>Tanggal Transaksi</th>
									<th>Jenis Barang</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{/* row 1 */}
								{products.map((product, index) => (
									<tr key={product.id}>
										<th>{index + 1}</th>
										<td>{product.nama_barang}</td>
										<td>{product.stok}</td>
										<td>{product.jumlah_terjual}</td>
										<td>
											{new Date(product.tgl_transaksi).toLocaleDateString()}
										</td>
										<td>{product.jenis_barang}</td>
										<td>
											<div className='flex gap-2'>
												<div className='btn btn-secondary btn-xs'>Edit</div>
												<div className='btn btn-error btn-xs'>Hapus</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{/* foot */}
						<div className='flex pt-10 gap-2'>
							<div className='btn btn-info'>Add Product</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
