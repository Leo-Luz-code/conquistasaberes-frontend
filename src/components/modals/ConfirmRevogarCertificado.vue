<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card class="rounded-xl" style="width: 420px; max-width: 95vw">
      <q-card-section class="flex flex-col items-center text-center px-6 py-6 gap-3">
        <div class="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center"><q-icon name="block" class="text-red-500" size="24px" /></div>
        <h2 class="text-base font-bold text-pmvc-dark m-0">Revogar certificado?</h2>
        <p class="text-sm text-pmvc-gray m-0">O certificado <span class="font-semibold text-pmvc-dark">{{ certificado?.codigoValidacao }}</span> de <span class="font-semibold text-pmvc-dark">{{ certificado?.userName }}</span> para o curso <span class="font-semibold text-pmvc-dark">{{ certificado?.courseTitle }}</span> será marcado como inválido e deixará de ser aceito na validação pública.</p>
      </q-card-section>
      <q-card-actions class="px-6 pb-6 flex justify-center gap-3">
        <q-btn flat no-caps label="Cancelar" class="text-pmvc-gray" v-close-popup @click="emit('update:modelValue', false)" />
        <q-btn unelevated no-caps label="Revogar certificado" class="bg-red-500 text-white rounded-lg px-5 font-semibold hover:bg-red-600 transition-colors" @click="emit('confirm')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue: Boolean, certificado: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'confirm'])
const modelValue = computed({ get: () => props.modelValue, set: (value) => emit('update:modelValue', value) })
</script>