<template>
  <q-dialog
    v-model="dialog"
    persistent
  >
    <q-card
      class="rounded-2xl"
      style="width: 720px; max-width: 95vw"
    >
      <!-- Cabeçalho -->
      <q-card-section
        class="flex items-center justify-between border-b border-slate-100"
      >
        <div>
          <h3 class="font-bold text-slate-900 text-lg">
            {{ isEditing ? 'Editar Evento' : 'Novo Evento' }}
          </h3>

          <p class="text-xs text-slate-500 mt-0.5">
            {{
              isEditing
                ? 'Atualize as informações do evento.'
                : 'Preencha as informações para criar um novo evento.'
            }}
          </p>
        </div>

        <q-btn
          icon="close"
          flat
          round
          dense
          :disable="submitting"
          @click="close"
        />
      </q-card-section>

      <!-- Formulário -->
      <q-card-section class="space-y-5">
        <!-- Informações principais -->
        <div>
          <p
            class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3"
          >
            Informações do evento
          </p>

          <div class="space-y-3">
            <q-input
              v-model="form.titulo"
              outlined
              dense
              label="Título do evento *"
              placeholder="Ex: Workshop de Gestão Pública"
              hide-bottom-space
            />

            <q-input
              v-model="form.descricao"
              outlined
              type="textarea"
              label="Descrição"
              placeholder="Descreva o evento..."
              rows="4"
              hide-bottom-space
            />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <q-select
                v-model="form.categoria"
                :options="categoryOptions"
                outlined
                dense
                label="Categoria *"
                hide-bottom-space
              />

              <q-select
                v-model="form.modalidade"
                :options="modalityOptions"
                outlined
                dense
                emit-value
                map-options
                label="Modalidade *"
                hide-bottom-space
              />
            </div>
          </div>
        </div>

        <q-separator />

        <!-- Data -->
        <div>
          <p
            class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3"
          >
            Data e horário
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <q-input
              v-model="form.dataInicio"
              outlined
              dense
              type="datetime-local"
              label="Início *"
              hide-bottom-space
            />

            <q-input
              v-model="form.dataFim"
              outlined
              dense
              type="datetime-local"
              label="Término *"
              hide-bottom-space
            />
          </div>
        </div>

        <q-separator />

        <!-- Local -->
        <div>
          <p
            class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3"
          >
            Localização
          </p>

          <q-input
            v-model="form.local"
            outlined
            dense
            :disable="form.modalidade === 'ONLINE'"
            :label="
              form.modalidade === 'ONLINE'
                ? 'Local não necessário para evento online'
                : 'Local do evento'
            "
            placeholder="Ex: Auditório da Prefeitura"
            hide-bottom-space
          />

          <p
            v-if="form.modalidade === 'ONLINE'"
            class="text-[11px] text-slate-400 mt-2"
          >
            Para eventos online, o acesso poderá ser disponibilizado
            posteriormente pela área de detalhes do evento.
          </p>
        </div>

        <q-separator />

        <!-- Inscrições -->
        <div>
          <p
            class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3"
          >
            Inscrições
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <q-input
              v-model.number="form.vagas"
              outlined
              dense
              type="number"
              min="1"
              label="Limite de vagas"
              placeholder="Deixe vazio para ilimitado"
              hide-bottom-space
            />

            <q-file
              v-model="capaFile"
              outlined
              dense
              label="Capa do evento"
              accept="image/png,image/jpeg,image/webp"
              max-file-size="5242880"
              clearable
              use-chips
              hide-bottom-space
              @rejected="onFileRejected"
            >
              <template #prepend>
                <q-icon name="image" />
              </template>

              <template #hint>
                Selecione uma imagem do seu computador. Máximo de 5 MB.
              </template>
            </q-file>
          </div>

          <!-- Preview -->
          <div
            v-if="form.capaUrl && !imageError"
            class="mt-3 rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-50"
          >
            <img
              :src="form.capaUrl"
              alt="Pré-visualização da capa"
              class="w-full h-full object-cover"
              @error="imageError = true"
            />
          </div>

          <div
            v-if="imageError"
            class="mt-3 rounded-xl border border-slate-200 h-32 bg-slate-50 flex items-center justify-center text-xs text-slate-400"
          >
            Não foi possível carregar a imagem.
          </div>
        </div>

        <q-separator />

        <!-- Publicação -->
        <div>
          <p
            class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3"
          >
            Publicação
          </p>

          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-slate-700">
                Publicar evento
              </p>

              <p class="text-xs text-slate-500">
                Eventos publicados ficam disponíveis para os servidores.
              </p>
            </div>

            <q-toggle
              v-model="form.isPublished"
              color="primary"
              :disable="submitting"
            />
          </div>
        </div>
      </q-card-section>

      <!-- Ações -->
      <q-card-actions
        align="right"
        class="p-4 border-t border-slate-100"
      >
        <q-btn
          flat
          label="Cancelar"
          color="grey-7"
          no-caps
          :disable="submitting"
          @click="close"
        />

        <q-btn
          :label="
            isEditing
              ? 'SALVAR ALTERAÇÕES'
              : 'CRIAR EVENTO'
          "
          color="primary"
          class="bg-pmvc-blue font-bold px-5"
          unelevated
          no-caps
          :loading="submitting"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue'

import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  event: {
    type: Object,
    default: null,
  },

  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'save',
])

const submitting = ref(false)
const imageError = ref(false)

const dialog = computed({
  get: () => props.modelValue,

  set: (value) => {
    emit('update:modelValue', value)
  },
})

const categoryOptions = [
  'Palestra',
  'Workshop',
  'Reunião',
  'Curso',
  'Seminário',
  'Capacitação',
  'Conferência',
  'Outro',
]

const modalityOptions = [
  {
    label: 'Presencial',
    value: 'PRESENCIAL',
  },
  {
    label: 'Online',
    value: 'ONLINE',
  },
  {
    label: 'Híbrido',
    value: 'HIBRIDO',
  },
]

const form = ref(createEmptyForm())

watch(
  () => props.event,
  (event) => {
    imageError.value = false

    if (event) {
      form.value = {
        titulo: event.titulo || '',
        descricao: event.descricao || '',
        categoria: event.categoria || 'Palestra',

        dataInicio: toDatetimeLocal(
          event.dataInicio,
        ),

        dataFim: toDatetimeLocal(
          event.dataFim,
        ),

        local: event.local || '',

        modalidade:
          event.modalidade || 'PRESENCIAL',

        vagas:
          event.vagas ?? null,

        capaUrl:
          event.capaUrl || '',

        secretariaId:
          event.secretariaId || null,

        isPublished:
          event.isPublished ?? true,
      }
    } else {
      form.value = createEmptyForm()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.modelValue,
  (value) => {
    if (value && !props.event) {
      form.value = createEmptyForm()
      imageError.value = false
    }
  },
)

watch(
  () => form.value.modalidade,
  (value) => {
    if (value === 'ONLINE') {
      form.value.local = ''
    }
  },
)

watch(
  () => form.value.capaUrl,
  () => {
    imageError.value = false
  },
)

function createEmptyForm() {
  return {
    titulo: '',
    descricao: '',
    categoria: 'Palestra',
    dataInicio: '',
    dataFim: '',
    local: '',
    modalidade: 'PRESENCIAL',
    vagas: null,
    capaUrl: '',
    secretariaId: null,
    isPublished: true,
  }
}

async function submit() {
  console.log('🔥 SUBMIT FOI CHAMADO')
  console.log('📦 FORM:', form.value)

  if (!form.value.titulo?.trim()) {
    console.log('❌ Sem título')
    notifyError('Informe o título do evento.')
    return
  }

  if (!form.value.dataInicio) {
    console.log('❌ Sem data início')
    notifyError('Informe a data e horário de início.')
    return
  }

  if (!form.value.dataFim) {
    console.log('❌ Sem data fim')
    notifyError('Informe a data e horário de término.')
    return
  }

  const inicio = new Date(form.value.dataInicio)
  const fim = new Date(form.value.dataFim)

  console.log('📅 INÍCIO:', inicio)
  console.log('📅 FIM:', fim)

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    console.log('❌ Datas inválidas')
    notifyError('Informe datas válidas.')
    return
  }

  if (fim <= inicio) {
    console.log('❌ Fim <= início')
    notifyError(
      'A data de término deve ser posterior à data de início.',
    )
    return
  }

  if (
    form.value.modalidade !== 'ONLINE' &&
    !form.value.local?.trim()
  ) {
    console.log('❌ Sem local')
    notifyError('Informe o local do evento.')
    return
  }

  if (
    form.value.vagas !== null &&
    form.value.vagas !== '' &&
    Number(form.value.vagas) < 1
  ) {
    console.log('❌ Vagas inválidas')
    notifyError(
      'O número de vagas deve ser maior que zero.',
    )
    return
  }

  submitting.value = true

  try {
    const payload = {
      titulo: form.value.titulo.trim(),

      descricao:
        form.value.descricao?.trim() || null,

      categoria:
        form.value.categoria || 'Palestra',

      dataInicio:
        inicio.toISOString(),

      dataFim:
        fim.toISOString(),

      local:
        form.value.modalidade === 'ONLINE'
          ? null
          : form.value.local?.trim() || null,

      modalidade:
        form.value.modalidade,

      vagas:
        form.value.vagas === '' ||
        form.value.vagas === null
          ? null
          : Number(form.value.vagas),

      capaUrl:
        form.value.capaUrl?.trim() || null,

      secretariaId:
        form.value.secretariaId || null,

      isPublished:
        form.value.isPublished,
    }

    console.log('🚀 PAYLOAD DO EVENTO:', payload)
    console.log('📤 Emitindo save...')

    await emitSave(payload)

    console.log('✅ SAVE FINALIZADO')
  } catch (error) {
    console.error('💥 ERRO AO SALVAR:', error)
  } finally {
    submitting.value = false
  }
}

function emitSave(payload) {
  return new Promise((resolve, reject) => {
    emit('save', payload, {
      resolve,
      reject,
    })
  })
}

function close() {
  if (submitting.value) return

  dialog.value = false
}

function notifyError(message) {
  $q.notify({
    type: 'negative',
    message,
    position: 'top',
  })
}

function toDatetimeLocal(date) {
  if (!date) return ''

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  const offset = parsed.getTimezoneOffset()

  const localDate = new Date(
    parsed.getTime() -
      offset * 60000,
  )

  return localDate
    .toISOString()
    .slice(0, 16)
}
</script>