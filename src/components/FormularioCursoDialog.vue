<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    persistent
    max-width="760px"
  >
    <q-card style="width: 760px; max-width: 95vw" class="rounded-borders shadow-3">
      <!-- Cabeçalho do Modal -->
      <q-card-section
        class="bg-primary text-white row items-center justify-between q-py-sm q-px-md"
      >
        <div class="text-subtitle1 text-weight-bold row items-center">
          <q-icon :name="isEditing ? 'edit_note' : 'post_add'" class="q-mr-sm" size="22px" />
          {{ isEditing ? 'Editar Informações do Curso' : 'Cadastrar Novo Curso' }}
        </div>
        <q-btn icon="close" flat round dense v-close-popup class="text-white" />
      </q-card-section>

      <!-- Corpo do Formulário com Grid Responsivo -->
      <q-card-section class="q-pa-md">
        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-md">
            <!-- Título do Curso -->
            <div class="col-12">
              <q-input
                v-model="form.titulo"
                label="Título do Curso *"
                hint="Ex: Capacitação em LGPD no Setor Público Municipal"
                outlined
                dense
                :rules="[(val) => !!val || 'O título do curso é obrigatório']"
                aria-required="true"
              >
                <template v-slot:prepend>
                  <q-icon name="subtitles" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- Descrição -->
            <div class="col-12">
              <q-input
                v-model="form.descricao"
                label="Descrição Detalhada *"
                hint="Descreva os objetivos de aprendizagem e público-alvo"
                type="textarea"
                rows="3"
                outlined
                dense
                :rules="[(val) => !!val || 'A descrição é obrigatória']"
                aria-required="true"
              />
            </div>

            <!-- Carga Horária -->
            <div class="col-12 col-sm-4">
              <q-input
                v-model.number="form.cargaHoraria"
                label="Carga Horária (horas) *"
                type="number"
                outlined
                dense
                min="1"
                :rules="[(val) => (val && val > 0) || 'Informe uma carga horária válida']"
              >
                <template v-slot:prepend>
                  <q-icon name="schedule" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- Categoria -->
            <div class="col-12 col-sm-4">
              <q-select
                v-model="form.categoria"
                :options="categorias"
                label="Categoria / Área *"
                outlined
                dense
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="category" color="primary" />
                </template>
              </q-select>
            </div>

            <!-- Público-Alvo / Secretaria -->
            <div class="col-12 col-sm-4">
              <q-select
                v-model="form.secretariaId"
                :options="secretariaOptions"
                label="Público-Alvo (Destino) *"
                outlined
                dense
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="account_balance" color="primary" />
                </template>
              </q-select>
            </div>

            <!-- Seção de Capa do Curso -->
            <div class="col-12">
              <div class="q-pa-sm bg-grey-2 rounded-borders">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
                  Imagem de Capa do Curso
                </div>
                <div class="row q-col-gutter-sm items-center">
                  <div class="col-12 col-sm-7">
                    <q-input
                      v-model="form.capaUrl"
                      label="URL da Imagem de Capa"
                      outlined
                      dense
                      placeholder="https://exemplo.com/imagem.jpg"
                      hint="Colar um link de imagem"
                    >
                      <template v-slot:prepend>
                        <q-icon name="image" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-5">
                    <q-file
                      v-model="capaFile"
                      label="Upload da Capa"
                      outlined
                      dense
                      accept="image/*"
                      :loading="uploadingCapa"
                      @update:model-value="handleCapaUpload"
                      hint="Fazer upload de imagem"
                    >
                      <template v-slot:prepend>
                        <q-icon name="cloud_upload" color="primary" />
                      </template>
                    </q-file>
                  </div>
                </div>

                <!-- Preview da Capa -->
                <div v-if="form.capaUrl" class="q-mt-sm row items-center q-gutter-sm">
                  <span class="text-caption text-grey-7">Pré-visualização:</span>
                  <q-img
                    :src="form.capaUrl"
                    style="max-width: 120px; height: 60px"
                    class="rounded-borders shadow-1"
                    fit="cover"
                  />
                </div>
              </div>
            </div>

            <!-- Toggle de Publicação -->
            <div class="col-12">
              <q-toggle
                v-model="form.isPublished"
                label="Tornar este curso visível publicamente no catálogo de servidores"
                color="positive"
                keep-color
              />
            </div>
          </div>

          <!-- Botões de Ação do Rodapé -->
          <q-separator class="q-mt-md q-mb-sm" />
          <div class="row justify-end q-gutter-sm">
            <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              :label="isEditing ? 'Salvar Alterações' : 'Salvar Curso'"
              color="primary"
              icon="check"
              unelevated
              :loading="saving"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCourseStore } from 'src/stores/courseStore'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  course: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const $q = useQuasar()
const courseStore = useCourseStore()

const saving = ref(false)
const uploadingCapa = ref(false)
const capaFile = ref(null)

const isEditing = computed(() => !!(props.course && props.course.id))

const categorias = [
  'Geral',
  'Tecnologia & Transformação Digital',
  'Saúde Pública',
  'Educação Municipal',
  'Gestão Pública & RH',
  'LGPD & Transparência',
]

const secretariaOptions = computed(() => {
  const options = [{ label: '🏛️ Toda a Prefeitura (Curso Geral)', value: null }]
  if (courseStore.secretarias && courseStore.secretarias.length > 0) {
    courseStore.secretarias.forEach((s) => {
      options.push({
        label: `${s.sigla} - ${s.nome}`,
        value: s.id,
      })
    })
  }
  return options
})

const form = ref({
  titulo: '',
  descricao: '',
  cargaHoraria: 10,
  categoria: 'Geral',
  capaUrl: '',
  secretariaId: null,
  isPublished: true,
})

// Atualizar o formulário quando a prop course mudar ou o modal abrir
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      courseStore.fetchSecretarias()
      capaFile.value = null
      if (props.course) {
        form.value = {
          titulo: props.course.titulo || '',
          descricao: props.course.descricao || '',
          cargaHoraria: props.course.cargaHoraria || 10,
          categoria: props.course.categoria || 'Geral',
          capaUrl: props.course.capaUrl || '',
          secretariaId: props.course.secretariaId || null,
          isPublished: props.course.isPublished !== undefined ? props.course.isPublished : true,
        }
      } else {
        form.value = {
          titulo: '',
          descricao: '',
          cargaHoraria: 10,
          categoria: 'Geral',
          capaUrl: '',
          secretariaId: null,
          isPublished: true,
        }
      }
    }
  },
  { immediate: true },
)

const handleCapaUpload = async (file) => {
  if (!file) return
  uploadingCapa.value = true
  try {
    const res = await courseStore.uploadFile(file)
    if (res && res.url) {
      form.value.capaUrl = res.url
      $q.notify({
        color: 'positive',
        icon: 'cloud_done',
        message: 'Upload da capa realizado com sucesso!',
      })
    }
  } catch (err) {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Erro ao fazer upload da imagem.',
    })
  } finally {
    uploadingCapa.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await courseStore.updateCourse(props.course.id, form.value)
    } else {
      await courseStore.createCourse(form.value)
    }
    emit('saved')
    emit('update:modelValue', false)
  } catch (err) {
    console.error('Erro ao salvar curso:', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
