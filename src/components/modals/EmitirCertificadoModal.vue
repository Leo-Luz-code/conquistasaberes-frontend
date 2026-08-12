<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card class="rounded-xl" style="width: 480px; max-width: 95vw">
      <q-card-section class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div><h2 class="text-lg font-bold text-pmvc-dark m-0">Emitir certificado</h2><p class="text-xs text-pmvc-gray m-0 mt-1">Selecione o servidor e o curso para gerar um certificado manualmente.</p></div>
        <q-btn flat round dense icon="close" class="text-pmvc-gray" v-close-popup @click="fechar" />
      </q-card-section>

      <q-card-section class="px-6 py-5">
        <q-form ref="formRef" class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <q-select v-model="form.user" outlined dense use-input hide-selected fill-input input-debounce="0" label="Servidor" placeholder="Digite o nome, matrícula ou CPF..." :options="opcoesUsuarios" option-value="id" option-label="label" :loading="buscandoUsuarios" :rules="[(value) => !!value || 'Selecione o servidor']" @filter="filtrarUsuarios">
            <template #prepend><q-icon name="person_search" class="text-pmvc-gray" /></template>
            <template #option="scope"><q-item v-bind="scope.itemProps"><q-item-section><q-item-label>{{ scope.opt.nome || scope.opt.name }}</q-item-label><q-item-label caption>{{ scope.opt.matricula }}{{ scope.opt.cpf ? ` · ${scope.opt.cpf}` : '' }}</q-item-label></q-item-section></q-item></template>
            <template #no-option="{ inputValue }"><q-item><q-item-section class="text-pmvc-gray text-sm">{{ inputValue.length < MIN_CHARS ? `Digite ao menos ${MIN_CHARS} caracteres para buscar` : 'Nenhum servidor encontrado' }}</q-item-section></q-item></template>
          </q-select>

          <q-select v-model="form.course" outlined dense use-input hide-selected fill-input input-debounce="0" label="Curso" placeholder="Digite o nome do curso..." :options="opcoesCursos" option-value="id" option-label="label" :loading="buscandoCursos" :rules="[(value) => !!value || 'Selecione o curso']" @filter="filtrarCursos">
            <template #prepend><q-icon name="school" class="text-pmvc-gray" /></template>
            <template #option="scope"><q-item v-bind="scope.itemProps"><q-item-section><q-item-label>{{ scope.opt.titulo || scope.opt.title }}</q-item-label><q-item-label v-if="scope.opt.cargaHoraria" caption>{{ scope.opt.cargaHoraria }} horas</q-item-label></q-item-section></q-item></template>
            <template #no-option="{ inputValue }"><q-item><q-item-section class="text-pmvc-gray text-sm">{{ inputValue.length < MIN_CHARS ? `Digite ao menos ${MIN_CHARS} caracteres para buscar` : 'Nenhum curso encontrado' }}</q-item-section></q-item></template>
          </q-select>

          <div class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 flex gap-2 items-start"><q-icon name="info" class="text-pmvc-blue mt-0.5" size="16px" /><p class="text-xs text-pmvc-gray m-0">O código de validação e a data de emissão serão gerados automaticamente pelo sistema.</p></div>
        </q-form>
      </q-card-section>

      <q-card-actions class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2"><q-btn flat no-caps label="Cancelar" class="text-pmvc-gray" v-close-popup @click="fechar" /><q-btn unelevated no-caps label="Emitir certificado" class="bg-pmvc-blue text-white rounded-lg px-4 font-semibold hover:bg-pmvc-lightBlue transition-colors" @click="onSubmit" /></q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  usuarios: { type: Array, default: () => [] },
  cursos: { type: Array, default: () => [] },
  buscandoUsuarios: Boolean,
  buscandoCursos: Boolean,
})
const emit = defineEmits(['update:modelValue', 'emitir', 'buscar-usuarios', 'buscar-cursos'])

const MIN_CHARS = 2
const DEBOUNCE_MS = 350
const formRef = ref(null)
const form = ref({ user: null, course: null })
let timeoutUsuarios
let timeoutCursos

const modelValue = computed({ get: () => props.modelValue, set: (value) => emit('update:modelValue', value) })
const opcoesUsuarios = computed(() => props.usuarios.map((user) => ({ ...user, label: user.label || `${user.nome || user.name} (${user.matricula})` })))
const opcoesCursos = computed(() => props.cursos.map((course) => ({ ...course, label: course.label || course.titulo || course.title })))

function filtrarUsuarios(termo, update, abort) {
  clearTimeout(timeoutUsuarios)
  if (termo.trim().length < MIN_CHARS) { abort(); return }
  timeoutUsuarios = setTimeout(() => { emit('buscar-usuarios', termo.trim()); update(() => {}) }, DEBOUNCE_MS)
}

function filtrarCursos(termo, update, abort) {
  clearTimeout(timeoutCursos)
  if (termo.trim().length < MIN_CHARS) { abort(); return }
  timeoutCursos = setTimeout(() => { emit('buscar-cursos', termo.trim()); update(() => {}) }, DEBOUNCE_MS)
}

watch(() => props.modelValue, (aberto) => {
  if (aberto) form.value = { user: null, course: null }
  else { clearTimeout(timeoutUsuarios); clearTimeout(timeoutCursos) }
})

function fechar() { emit('update:modelValue', false) }
async function onSubmit() { const valido = await formRef.value?.validate(); if (valido) emit('emitir', { userId: form.value.user.id, courseId: form.value.course.id }) }
</script>