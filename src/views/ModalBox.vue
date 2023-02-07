<template>
	<div>
		<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1"
			aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Seleccionar Caja</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="resetBox">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div class="form-row">
							<div class="form-group col-md-6">
								<select id="" class="form-control custom-select" v-model="boxUser">
									<option value="" disabled>Seleccione una caja</option>
									<option v-for="item in $root.listBoxes" :value="item" :key="item.id">
										{{ item.name + " - " + item.prefix }}
									</option>
								</select>
							</div>
							<div class="form-group col-md-6">
								<input type="number" step="any" class="form-control" v-model="boxUser.base"
									:disabled="boxUser.id ? false : true">
							</div>
						</div>

					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal" @click="resetBox">
							Cancelar
						</button>
						<button type="button" class="btn btn-primary" @click="saveBox">
							Guardar
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: "ModalBox",
	data() {
		return {
			boxUser: {}
		};
	},
	created() {
		//this.$root.validateToken();
	},
	methods: {
		selectedBox() {
			this.axios
				.get("api/boxes/byUser", this.$root.config)
				.then(response => {
					this.$root.listBoxes = response.data.boxes;
				})
				.catch(response => {
					this.$root.listBoxes = [];
				});

			let box = localStorage.getItem("box_worker");
			if (box > 0) {
				this.$root.box = box ?? this.boxUser.id;
			} else {
				$("#staticBackdrop").modal("show");
			}
		},
		saveBox() {
			localStorage.setItem("box_worker", this.boxUser.id);
			$("#staticBackdrop").modal("hide");

			let data = {
				'id': this.boxUser.id,
				'base': this.boxUser.base
			}
			this.axios.post(`api/boxes/base/${this.boxUser.id}`, data, this.$root.config)

		},
		resetBox() {
			this.$root.box = "";
			localStorage.removeItem("box_worker");
		}
	}
};
</script>
