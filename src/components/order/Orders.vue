<template>
	<div class="w-100">
		<header class="bg-white">
			<div class="mx-auto w-full text-center py-6 px-4 sm:px-6 lg:px-8">
				<h1 class="text-3xl font-bold tracking-tight text-gray-900">Ordenes</h1>
			</div>
		</header>
		<section>
			<!-- <load-pdf :loading="load_pdf" /> -->
			<div class="card-body overflow-hidden shadow sm:rounded-md">
				<div class="form-row grid grid-cols-12 gap-6 justify-end">
					<div class="form-group col-3 col-span-6 sm:col-span-4">
						<v-select :options="tableList" placeholder="Seleccionar mesa" class="w-100" label="table"  @search="onSearchTable"
							:reduce="(table) => table.id" v-model="filter.table_id" />
					</div>
					
					<div class="form-group offset-9 col-md-3 col-span-6 sm:col-span-4">
						<button class="btn btn-primary btn-block" @click="getOrders(1)">
							Buscar
						</button>
					</div>
				</div>
				<div class="flex flex-col">
					<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
							<div class="overflow-hidden">
								<table>
									<thead>
										<tr>
											<th>#</th>

											<th>Mesa</th>
											<th>Responsable</th>
											<th v-if="$root.validatePermission('order.update')">Editar</th>
											<th v-if="$root.validatePermission('order.delete')">Eliminar</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="o in OrderList.data" :key="o.id">
											<th scope="row">{{ o.id }} - {{ o.bill_number }}</th>
											<td>
												{{ o.user.name }}
											</td>

											<td>
												<template v-if="o.table">
													{{ o.table.table }}
												</template>
											</td>

											<td v-if="$root.validatePermission('order.update')">
												<router-link class="btn" :to="{
													name: 'create-edit-order',
													params: { order_id: o.id },
												}">
													<i class="bi bi-pencil-square"></i>
												</router-link>
											</td>
											<td v-if="$root.validatePermission('order.delete')">
												<button class="btn text-danger" @click="deleteOrder(o.id)">
													<i class="bi bi-trash"></i>
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<TailwindPagination :align="'center'" :data="OrderList" :limit="8" @pagination-change-page="getOrders">
				<slot name="prev-nav"><i class="bi bi-chevron-double-left"></i></slot>
				<slot name="next-nav"><i class="bi bi-chevron-double-right"></i></slot>
			</TailwindPagination>
		</section>
		<div class="footer"></div>
	</div>
</template>
<script>
import moment from 'moment'

export default {
	name: 'app-orders',
	data() {
		return {
			load_pdf: false,
			OrderList: {},
			TotalOrderList: [],
			tableList: [],
			userList: [],
			filter: {
				client: "",
				no_invoice: "",
				from: "",
				to: "",
				user_id: "",
				table_id: "",
				status: `1,2`,
			},
			statusOrders: [
				{ id: 0, status: "Desechada" },
				{ id: 1, status: "Pedido" },
				{ id: 2, status: "Facturado" },
				{ id: 3, status: "Cotizado" },
				{ id: 4, status: "Facturar e imprimir" },
				{ id: 5, status: "Credito" },
				{ id: 6, status: "Credito e imprimir" },
			],
		};
	},
	created() {
		// this.$root.validateToken();
		this.listUsers();
		this.getOrders(1);
		this.moment = moment
	},
	methods: {
		getOrders(page = 1) {
			let me = this;

			let data = {
				page: page,
				client: me.filter.client,
				no_invoice: me.filter.no_invoice,
				from: me.filter.from,
				to: me.filter.to,
				user_id: me.filter.user_id,
				status: me.filter.status,
				table_id: me.filter.table_id
			};

			this.axios
				.get(`api/orders`, { params: data, headers: this.$root.config.headers })
				.then(function (response) {
					me.OrderList = response.data.orders;
					me.TotalOrderList = response.data.totalOrders;
				});
		},
		deleteOrder(order_id) {
			this.axios
				.delete(`api/orders/${order_id}`, this.$root.config)
				.then(() => {
					this.getOrders(1);
					this.$swal.fire({
						icon: "success",
						title: "Excelente",
						text: "Los datos se han eliminado correctamente",
					});
				})
				.catch(function (error) {
					// handle error
					if (error) {
						this.$swal.fire({
							icon: "error",
							title: "Oops...",
							text: "Hubo un error al eliminar la orden",
						});
					}
				});
		},
		generatePdf(id) {
			this.load_pdf = true;
			this.axios
				.get("api/orders/generatePdf/" + id, this.$root.config)
				.then((response) => {
					console.log(response);

					const pdf = response.data.pdf;
					var a = document.createElement("a");
					a.href = "data:application/pdf;base64," + pdf;
					a.download = `Order-${id}.pdf`;
					a.click();
				})
				.finally(() => {
					this.load_pdf = false;
				});
		},
		printTicket(order_id) {
			this.axios.get(`api/print-order/${order_id}`, this.$root.config);
		},
		listUsers() {
			let me = this;
			this.axios
				.get(`api/users/user-list`, this.$root.config)
				.then(function (response) {
					me.userList = response.data.users;
				});
		},
		onSearchTable(search, loading) {
			let params = {
                table: search,
                page: 1
            }
            if (search.length) {
                loading(true);
				this.axios
				.get("api/tables", { params, headers: this.$root.config.headers })
                    .then((response) => {
                        this.tableList = (response.data.tables.data);
						loading(false)
                        console.log(response)
                    })
                    .catch(e => console.log(e))
            }
			
		},
	},
};
</script>
