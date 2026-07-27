<template>
  <q-page class="p-4 sm:p-8 max-w-7xl mx-auto space-y-10 font-sans">
    <!-- Cabecalho Principal -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Portal de Cursos & Capacitação</h1>
        <p class="text-xs sm:text-sm text-slate-500">Capacitações oficiais da Prefeitura Municipal de Vitória da Conquista</p>
      </div>

      <!-- Busca e Filtros -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Buscar por título ou tema..."
          class="w-full sm:w-64 bg-white"
          hide-bottom-space
          @update:model-value="onSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-pmvc-blue" />
          </template>
        </q-input>

        <q-select
          outlined
          dense
          v-model="selectedCategory"
          :options="categories"
          label="Categoria"
          class="w-full sm:w-44 bg-white"
          hide-bottom-space
            @update:model-value="onSearch"
        />
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- SEÇÃO 1: MEUS CURSOS (Cursos Matriculados + Progresso + Avaliacao) -->
    <!-- =================================================================== -->
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <q-icon name="school" color="primary" size="24px" />
          Meus Cursos em Andamento ({{ courseStore.myCourses.length }})
        </h2>
      </div>

      <div v-if="courseStore.myCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="myCourse in courseStore.myCourses"
          :key="myCourse.id"
          class="bg-white rounded-2xl border-2 border-pmvc-blue/20 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div class="p-5 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 bg-green-50 text-green-700 font-bold text-[10px] uppercase rounded-md">
                Matriculado
              </span>
              <!-- Botão de Avaliar Curso -->
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                color="amber-9"
                icon="star_rate"
                :label="myCourse.myRating ? `${myCourse.myRating}/5 ★` : 'Avaliar'"
                @click="openRatingModal(myCourse)"
              >
                <q-tooltip>Avaliar este curso</q-tooltip>
              </q-btn>
            </div>

            <h3 class="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {{ myCourse.titulo }}
            </h3>

            <div class="flex items-center gap-2 pt-1">
              <q-rating
                :model-value="myCourse.mediaAvaliacoes"
                readonly
                size="16px"
                color="amber-8"
                icon="star_border"
                icon-selected="star"
                :max="5"
              />

              <span
                v-if="myCourse.totalAvaliacoes > 0"
                class="text-xs font-semibold text-slate-600"
              >
                {{ Number(myCourse.mediaAvaliacoes).toFixed(1) }}
                ({{ myCourse.totalAvaliacoes }}
                {{ myCourse.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações' }})
              </span>

              <span
                v-else
                class="text-xs text-slate-400"
              >
                Ainda sem avaliações
              </span>
            </div>

            <div
              v-if="myCourse.myRating"
              class="flex items-center gap-2 text-[11px] text-amber-700 font-semibold"
            >
              <q-icon
                name="verified"
                size="14px"
              />

              <span>
                Sua avaliação:
              </span>

              <q-rating
                :model-value="myCourse.myRating"
                readonly
                size="14px"
                color="amber-8"
                icon="star_border"
                icon-selected="star"
                :max="5"
              />
            </div>

            <!-- Barra de Progresso do Aluno -->
            <div class="space-y-1 pt-1">
              <div class="flex justify-between text-[11px] font-bold text-slate-600">
                <span>Progresso</span>
                <span>{{ myCourse.progresso || 0 }}%</span>
              </div>
              <q-linear-progress
                :value="(myCourse.progresso || 0) / 100"
                color="primary"
                track-color="slate-200"
                size="8px"
                class="rounded-full"
              />
            </div>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500">
              <q-icon name="schedule" /> {{ myCourse.cargaHoraria }}h
            </span>

            <router-link
              :to="`/servidor/cursos/${myCourse.id}`"
              class="py-2 px-4 bg-pmvc-blue hover:bg-blue-700 text-white font-bold rounded-lg text-xs uppercase transition-colors"
            >
              CONTINUAR CURSO
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State Meus Cursos -->
      <div v-else class="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
        <q-icon name="menu_book" size="40px" class="text-slate-400" />
        <h4 class="font-bold text-slate-700 text-sm">Você ainda não se inscreveu em nenhum curso</h4>
        <p class="text-xs text-slate-500">Explore o catálogo abaixo e faça sua matrícula para começar a pontuar XP!</p>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- SEÇÃO 2: CATÁLOGO GERAL DE CURSOS -->
    <!-- =================================================================== -->
    <div class="space-y-4 pt-4">
      <div class="border-b border-slate-200 pb-3">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <q-icon name="grid_view" color="primary" size="24px" />
          Catálogo Geral de Cursos
        </h2>
      </div>

      <div v-if="courseStore.loading" class="flex justify-center py-12">
        <q-spinner-dots color="primary" size="50px" />
      </div>

      <div v-else-if="courseStore.courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in courseStore.courses"
          :key="course.id"
          class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div class="p-6 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 bg-blue-50 text-pmvc-blue font-bold text-[10px] uppercase rounded-md tracking-wider">
                {{ course.categoria || 'Geral' }}
              </span>

              <span class="text-xs font-bold text-slate-400 flex items-center gap-1">
                <q-icon name="schedule" />
                {{ course.cargaHoraria }}h
              </span>
            </div>

            <h3 class="font-bold text-slate-900 text-lg leading-snug line-clamp-2">
              {{ course.titulo }}
            </h3>

            <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {{ course.descricao }}
            </p>

            <!-- Avaliação -->
            <div class="flex items-center gap-2 pt-1">
              <q-rating
                :model-value="course.mediaAvaliacoes"
                readonly
                size="18px"
                color="amber-8"
                icon="star_border"
                icon-selected="star"
                :max="5"
              />

              <span
                v-if="course.totalAvaliacoes"
                class="text-xs font-semibold text-slate-600"
              >
                {{ course.mediaAvaliacoes.toFixed(1) }}
                ({{ course.totalAvaliacoes }}
                {{ course.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações' }})
              </span>

              <span
                v-else
                class="text-xs text-slate-400"
              >
                Ainda sem avaliações
              </span>
            </div>

            <div
              v-if="course.secretaria"
              class="flex items-center gap-1.5 text-xs text-slate-600 font-semibold pt-2"
            >
              <q-icon name="account_balance" class="text-pmvc-blue" />
              <span>Exclusivo: {{ course.secretaria.nome }}</span>
            </div>
          </div> 

          <div class="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
            <div>
              <span class="block text-[10px] uppercase font-bold text-slate-400">Recompensa</span>
              <span class="text-xs font-extrabold text-amber-600 flex items-center gap-1">
                <q-icon name="emoji_events" /> +{{ (course.cargaHoraria || 10) * 10 }} XP
              </span>
            </div>

            <router-link
              :to="`/servidor/cursos/${course.id}`"
              class="py-2.5 px-5 bg-pmvc-blue hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow"
            >
              ACESSAR CURSO
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
        <q-icon name="search_off" size="56px" class="text-slate-300" />
        <h3 class="font-bold text-slate-700 text-lg">Nenhum curso encontrado</h3>
        <p class="text-xs text-slate-500">Tente ajustar os filtros de busca ou categoria acima.</p>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- MODAL DE AVALIAÇÃO DO CURSO (ESTRELAS + FEEDBACK) -->
    <!-- =================================================================== -->
    <q-dialog v-model="showRatingModal">
      <q-card style="min-width: 320px; max-width: 480px" class="rounded-2xl p-4">
        <q-card-section class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-base">Avaliar Curso</h3>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="space-y-4 text-center">
          <p class="text-xs text-slate-600">
            Como foi sua experiência com o curso <strong>{{ selectedCourseForRating?.titulo }}</strong>?
          </p>

          <!-- Componente de Estrelas -->
          <div class="flex justify-center py-2">
            <q-rating
              v-model="ratingForm.rating"
              size="2.5em"
              color="amber-8"
              icon="star_border"
              icon-selected="star"
              :max="5"
            />
          </div>

          <q-input
            outlined
            type="textarea"
            v-model="ratingForm.comment"
            label="Seu feedback / comentário (opcional)"
            placeholder="Conte o que achou das aulas, didática ou sugestões de melhoria..."
            rows="3"
            hide-bottom-space
          />
        </q-card-section>

        <q-card-actions align="right" class="p-3">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            label="ENVIAR AVALIAÇÃO"
            color="primary"
            class="bg-pmvc-blue font-bold px-5"
            unelevated
            no-caps
            :loading="ratingSubmitting"
            @click="handleSendRating"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCourseStore } from 'src/stores/courseStore';

const courseStore = useCourseStore();
const searchQuery = ref('');
const selectedCategory = ref('Todas');

const categories = ['Todas', 'Geral', 'Tecnologia', 'Saúde', 'Educação', 'Gestão Pública', 'LGPD'];

const showRatingModal = ref(false);
const ratingSubmitting = ref(false);
const selectedCourseForRating = ref(null);

const ratingForm = ref({
  rating: 5,
  comment: '',
});

function onSearch() {
  courseStore.fetchCourses({
    search: searchQuery.value,
    categoria: selectedCategory.value,
  });
}

function openRatingModal(course) {
  selectedCourseForRating.value = course;
  ratingForm.value = {
    rating: course.myRating || 5,
    comment: course.myComment || '',
  };
  showRatingModal.value = true;
}

async function handleSendRating() {
  if (!selectedCourseForRating.value) return;
  ratingSubmitting.value = true;
  try {
    await courseStore.rateCourse(selectedCourseForRating.value.id, ratingForm.value);
    showRatingModal.value = false;
  } finally {
    ratingSubmitting.value = false;
  }
}

onMounted(() => {
  courseStore.fetchCourses();
  courseStore.fetchMyCourses();
});
</script>