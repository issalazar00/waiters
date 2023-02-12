<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

</script>

<template>
	<TransitionRoot as="template" :show="open">
		<Dialog as="div" class="relative z-10" @close="!open">
			<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
				leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<TransitionChild as="template" enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
							<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div class="sm:flex sm:items-start">
									<div
										class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
										<ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
									</div>
									<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
											Seleccionar caja
										</DialogTitle>
										<div class="mt-2">
											<div class="form-row">
												<div class="form-group col-md-6">
													<select id="" class="form-select w-full" v-model="boxUser">
														<option value="" disabled>Seleccione una caja</option>
														<option v-for="item in $root.listBoxes" :value="item"
															:key="item.id">
															{{ item.name + " - " + item.prefix }}
														</option>
													</select>
												</div>
												<div class="form-group col-md-6">
													<input type="number" step="any" class="form-control w-full"
														v-model="boxUser.base" :disabled="boxUser.id ? false : true">
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6">
								<button type="button"
									class="btn btn-secondary btn-block"
									@click="closeModal()">Cancelar</button>
								<button type="button"
									class="btn btn-success btn-block"
									@click="saveBox()" ref="cancelButtonRef">Aceptar</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>


<script>

export default {

	name: "ModalBox",
	data() {
		return {
			open: {
				type: Boolean,
				default: false
			},
			boxUser: {}
		};
	},
	created() {
		this.open = false;
		this.selectedBox()
	},
	methods: {
		selectedBox() {
			console.log('si guarda');
			this.axios
				.get("api/boxes/byUser", this.$root.config)
				.then(response => {
					this.$root.listBoxes = response.data.boxes;
				})
				.catch(() => {
					this.$root.listBoxes = [];
				});

			let box = localStorage.getItem("box_worker");
			if (box > 0) {
				this.$root.box = box ?? this.boxUser.id;
			} else {
				this.open = true;
			}
		},
		saveBox() {
			localStorage.setItem("box_worker", this.boxUser.id);
			this.closeModal()

			let data = {
				'id': this.boxUser.id,
				'base': this.boxUser.base
			}
			this.axios.post(`api/boxes/base/${this.boxUser.id}`, data, this.$root.config)

		},
		resetBox() {
			this.$root.box = "";
			localStorage.removeItem("box_worker");
		},
		closeModal(){
			this.open=false
		}
	}
};
</script>
