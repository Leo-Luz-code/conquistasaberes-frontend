<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card class="rounded-xl" style="width: 480px; max-width: 95vw">
      <q-card-section class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div><h2 class="text-lg font-bold text-pmvc-dark m-0">{{ isEdicao ? 'Editar material' : 'Novo material' }}</h2><p class="text-xs text-pmvc-gray m-0 mt-1">{{ isEdicao ? 'Atualize as informações do item da biblioteca.' : 'Cadastre um novo item na biblioteca.' }}</p></div>
        <q-btn flat round dense icon="close" class="text-pmvc-gray" v-close-popup @click="fechar" />
      </q-card-section>

      <q-card-section class="px-6 py-5">
        <q-form ref="formRef" class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <q-input v-model="form.titulo" outlined dense label="Título" :rules="[(value) => !!value?.trim() || 'Informe o título do material']" />
          <q-select v-model="form.categoria" outlined dense use-input new-value-mode="add-unique" :options="opcoesCategoria" label="Categoria" hint="Selecione uma categoria existente ou digite para criar uma nova" :rules="[(value) => !!value || 'Selecione ou crie uma categoria']" @filter="filtrarCategorias" />
          <div>
            <q-file v-model="arquivo" outlined dense label="Arquivo (PDF, DOC, DOCX, XLS ou XLSX)" accept=".pdf,.doc,.docx,.xls,.xlsx" @update:model-value="onArquivoSelecionado"><template #prepend><q-icon name="attach_file" /></template></q-file>
            <p class="text-xs text-pmvc-gray mt-1 mb-0">Envie um arquivo ou informe uma URL. Ao selecionar um arquivo, ele será enviado diretamente ao backend.</p>
          </div>
          <q-input v-model="form.documentoUrl" outlined dense label="URL do documento" hint="Opcional quando houver um arquivo selecionado." :rules="[validarDocumento]" />
        </q-form>
      </q-card-section>

      <q-card-actions class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2"><q-btn flat no-caps label="Cancelar" class="text-pmvc-gray" v-close-popup @click="fechar" /><q-btn unelevated no-caps :label="isEdicao ? 'Salvar alterações' : 'Cadastrar material'" class="bg-pmvc-blue text-white rounded-lg px-4 font-semibold hover:bg-pmvc-lightBlue transition-colors" @click="onSubmit" /></q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({ modelValue: Boolean, material: { type: Object, default: null }, categorias: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue', 'salvar'])
const modelValue = computed({ get: () => props.modelValue, set: (value) => emit('update:modelValue', value) })
const isEdicao = computed(() => !!props.material?.id)
const formRef = ref(null)
const arquivo = ref(null)
const opcoesCategoria = ref([])
const formPadrao = () => ({ id: null, titulo: '', categoria: '', documentoUrl: '' })
const form = ref(formPadrao())

watch(() => props.modelValue, (aberto) => {
  if (!aberto) return
  form.value = props.material ? { id: props.material.id, titulo: props.material.titulo, categoria: props.material.categoria, documentoUrl: props.material.documentoUrl } : formPadrao()
  arquivo.value = null
  opcoesCategoria.value = [...props.categorias]
})

function filtrarCategorias(valor, update) { update(() => { const termo = valor.toLowerCase(); opcoesCategoria.value = termo ? props.categorias.filter((categoria) => categoria.toLowerCase().includes(termo)) : [...props.categorias] }) }
function onArquivoSelecionado(file) { arquivo.value = file || null }
function validarDocumento(valor) { return arquivo.value || valor?.trim() || (isEdicao.value && form.value.documentoUrl) || 'Selecione um arquivo ou informe a URL do documento' }
function fechar() { emit('update:modelValue', false) }
async function onSubmit() { const valido = await formRef.value?.validate(); if (valido) emit('salvar', { ...form.value, file: arquivo.value }) }
</script>