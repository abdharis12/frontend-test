import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const [products, setProducts] = useState([]);
	const [newProduct, setNewProduct] = useState({
		nama_barang: "",
		stok: "",
		jumlah_terjual: "",
		tgl_transaksi: "",
		jenis_barang: "",
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = () => {
		axios
			.get("http://127.0.0.1:8000/api/products")
			.then((response) => {
				setProducts(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewProduct({
			...newProduct,
			[name]: value,
		});
	};

	// add product
	const addProduct = () => {
		const formattedProduct = {
			...newProduct,
			tgl_transaksi: moment(newProduct.tgl_transaksi, "YYYY-MM-DD").format(
				"DD/MM/YYYY"
			),
		};

		axios
			.post("http://127.0.0.1:8000/api/products", formattedProduct)
			.then((response) => {
				setProducts([...products, response.data]);
				setNewProduct({
					nama_barang: "",
					stok: "",
					jumlah_terjual: "",
					tgl_transaksi: "",
					jenis_barang: "",
				});
				document.getElementById("addProductModal").close();
				toast.success("Product added successfully!");
			})
			.catch((error) => {
				console.log(error);
				toast.error("Failed to add product.");
			});
	};

	// delete product
	const deleteProduct = (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			axios
				.delete(`http://127.0.0.1:8000/api/products/${id}`)
				.then((response) => {
					setProducts(products.filter((product) => product.id !== id));
					toast.error("Product deleted successfully!");
				})
				.catch((error) => {
					console.log(error);
					toast.error("Failed to delete product.");
				});
		}
	};

	// edit product
	const [editingProduct, setEditingProduct] = useState({});
	const handleEdit = (product) => {
		setEditingProduct(product);
		document.getElementById("editProductModal").showModal();
	};

	const updateProduct = () => {
		// Ubah format tgl_transaksi ke bentuk yang sesuai dengan format MySQL
		const formattedProduct = {
			...editingProduct,
			tgl_transaksi: moment(editingProduct.tgl_transaksi, "DD/MM/YYYY").format(
				"d/m/YYYY"
			),
		};

		axios
			.put(
				`http://127.0.0.1:8000/api/products/${editingProduct.id}`,
				formattedProduct
			)
			.then((response) => {
				const updatedProducts = products.map((product) =>
					product.id === editingProduct.id ? response.data : product
				);
				setProducts(updatedProducts);
				toast.success("Product updated successfully!");
				document.getElementById("editProductModal").close();
			})
			.catch((error) => {
				console.log(error);
				toast.error("Failed to update product.");
			});
	};

	// search product
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};
	const searchProducts = (searchTerm = "") => {
		let url = `http://127.0.0.1:8000/api/products?search=${searchTerm}`;
		axios
			.get(url)
			.then((response) => {
				setProducts(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<ToastContainer />
			<div className='w-full flex justify-center items-center p-10'>
				<div className='flex w-2/3 justify-center items-center gap-2'>
					<div className='overflow-x-auto'>
						{/* search */}
						<div className='flex py-5 px-1 gap-2'>
							<label className='input input-bordered flex items-center gap-2'>
								<input
									type='text'
									className='grow'
									placeholder='Search by product name'
									value={searchTerm}
									onChange={handleSearchChange}
								/>
							</label>
							<button
								className='btn btn-primary'
								onClick={() => searchProducts(searchTerm)}
							>
								Search
							</button>
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
								{products.map((product, index) => (
									<tr key={product.id}>
										<th>{index + 1}</th>
										<td>{product.nama_barang}</td>
										<td>{product.stok}</td>
										<td>{product.jumlah_terjual}</td>
										<td>{moment(product.tgl_transaksi).format("D/M/YYYY")}</td>
										<td>{product.jenis_barang}</td>
										<td>
											<div className='flex gap-2'>
												<div
													className='btn btn-secondary btn-xs'
													onClick={() => handleEdit(product)}
												>
													Edit
												</div>
												<div
													className='btn btn-error btn-xs'
													onClick={() => deleteProduct(product.id)}
												>
													Hapus
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{/* button add */}
						<div className='flex pt-10 gap-2'>
							<button
								className='btn btn-info'
								onClick={() => {
									setNewProduct({
										nama_barang: "",
										stok: "",
										jumlah_terjual: "",
										tgl_transaksi: "",
										jenis_barang: "",
									});
									document.getElementById("addProductModal").showModal();
								}}
							>
								Add Product
							</button>
						</div>

						{/* modal add product */}
						<dialog id='addProductModal' className='modal'>
							<form method='dialog' className='modal-box'>
								<h3 className='font-bold text-lg'>
									{newProduct.id ? "Edit Product" : "Add Product"}
								</h3>
								<div className='py-4'>
									<input
										type='text'
										name='nama_barang'
										value={newProduct.nama_barang}
										onChange={handleInputChange}
										placeholder='Nama Barang'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='number'
										name='stok'
										value={newProduct.stok}
										onChange={handleInputChange}
										placeholder='Stok'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='number'
										name='jumlah_terjual'
										value={newProduct.jumlah_terjual}
										onChange={handleInputChange}
										placeholder='Jumlah Terjual'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='date'
										name='tgl_transaksi'
										value={newProduct.tgl_transaksi}
										onChange={handleInputChange}
										placeholder='Tanggal Transaksi'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='text'
										name='jenis_barang'
										value={newProduct.jenis_barang}
										onChange={handleInputChange}
										placeholder='Jenis Barang'
										className='input input-bordered w-full mb-2'
									/>
								</div>
								<div className='modal-action'>
									<button className='btn' type='button' onClick={addProduct}>
										{newProduct.id ? "Update" : "Add"}
									</button>
									<button
										className='btn'
										type='button'
										onClick={() =>
											document.getElementById("addProductModal").close()
										}
									>
										Close
									</button>
								</div>
							</form>
						</dialog>

						{/* modal edit product */}
						<dialog id='editProductModal' className='modal'>
							<form method='dialog' className='modal-box'>
								<h3 className='font-bold text-lg'>Edit Product</h3>
								<div className='py-4'>
									<input
										type='text'
										name='nama_barang'
										value={editingProduct.nama_barang || ""}
										onChange={(e) =>
											setEditingProduct({
												...editingProduct,
												nama_barang: e.target.value,
											})
										}
										placeholder='Nama Barang'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='number'
										name='stok'
										value={editingProduct.stok || ""}
										onChange={(e) =>
											setEditingProduct({
												...editingProduct,
												stok: e.target.value,
											})
										}
										placeholder='Stok'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='number'
										name='jumlah_terjual'
										value={editingProduct.jumlah_terjual || ""}
										onChange={(e) =>
											setEditingProduct({
												...editingProduct,
												jumlah_terjual: e.target.value,
											})
										}
										placeholder='Jumlah Terjual'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='date'
										name='tgl_transaksi'
										value={editingProduct.tgl_transaksi || ""}
										onChange={(e) =>
											setEditingProduct({
												...editingProduct,
												tgl_transaksi: e.target.value,
											})
										}
										placeholder='Tanggal Transaksi'
										className='input input-bordered w-full mb-2'
									/>
									<input
										type='text'
										name='jenis_barang'
										value={editingProduct.jenis_barang || ""}
										onChange={(e) =>
											setEditingProduct({
												...editingProduct,
												jenis_barang: e.target.value,
											})
										}
										placeholder='Jenis Barang'
										className='input input-bordered w-full mb-2'
									/>
								</div>
								<div className='modal-action'>
									<button className='btn' type='button' onClick={updateProduct}>
										Update
									</button>
									<button
										className='btn'
										type='button'
										onClick={() =>
											document.getElementById("editProductModal").close()
										}
									>
										Close
									</button>
								</div>
							</form>
						</dialog>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
