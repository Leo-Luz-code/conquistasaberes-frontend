<template>
  <q-page class="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 font-sans">
    <!-- Cabecalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Fórum Colaborativo de Servidores</h1>
        <p class="text-xs sm:text-sm text-slate-500">Espaço institucional para troca de conhecimentos, dúvidas e mentoria intersecretarial</p>
      </div>

      <q-btn
        label="NOVA DÚVIDA / TÓPICO"
        color="primary"
        icon="add_comment"
        class="!py-2.5 !px-5 bg-pmvc-blue text-white font-bold"
        unelevated
        no-caps
        @click="showModal = true"
      />
    </div>

    <!-- Feed de Postagens -->
    <div v-if="forumStore.loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="forumStore.posts.length > 0" class="space-y-4">
      <div
        v-for="post in forumStore.posts"
        :key="post.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-pmvc-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
              {{ post.user?.nome?.charAt(0) || 'U' }}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm leading-none">{{ post.user?.nome }}</h4>
              <span class="text-[10px] text-slate-400">
                {{ post.user?.secretaria?.sigla || 'PMVC' }} • {{ post.user?.cargo }}
              </span>
            </div>
          </div>
          <span class="text-[10px] text-slate-400 font-semibold">{{ formatDate(post.createdAt) }}</span>
        </div>

        <div class="space-y-1">
          <h3 class="font-bold text-slate-900 text-base">{{ post.titulo }}</h3>
          <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{{ post.conteudo }}</p>
        </div>

        <div v-if="post.course" class="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-pmvc-blue font-bold">
          <q-icon name="school" /> Curso: {{ post.course.titulo }}
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
      <q-icon name="forum" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhuma publicação ainda</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">Seja o primeiro a publicar uma dúvida ou compartilhar um aprendizado com os demais servidores!</p>
    </div>

    <!-- Modal Nova Publicacao -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 350px; max-width: 550px" class="rounded-2xl p-4">
        <q-card-section class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-lg">Publicar Nova Dúvida</h3>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="space-y-4">
          <q-input
            outlined
            dense
            v-model="newPost.titulo"
            label="Título da Dúvida ou Tópico"
            placeholder="Ex: Como aplicar a LGPD em cadastros presenciais?"
            hide-bottom-space
          />
          <q-input
            outlined
            type="textarea"
            v-model="newPost.conteudo"
            label="Detalhamento"
            placeholder="Descreva sua dúvida com mais detalhes para que outros servidores possam ajudar..."
            rows="4"
            hide-bottom-space
          />
        </q-card-section>

        <q-card-actions align="right" class="p-4">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            label="PUBLICAR"
            color="primary"
            class="bg-pmvc-blue font-bold px-6"
            unelevated
            no-caps
            :loading="submitting"
            @click="handleSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useForumStore } from 'src/stores/forumStore';

const forumStore = useForumStore();
const showModal = ref(false);
const submitting = ref(false);

const newPost = ref({
  titulo: '',
  conteudo: '',
});

onMounted(() => {
  forumStore.fetchPosts();
});

async function handleSubmit() {
  if (!newPost.value.titulo || !newPost.value.conteudo) return;
  submitting.value = true;
  try {
    await forumStore.createPost(newPost.value);
    newPost.value = { titulo: '', conteudo: '' };
    showModal.value = false;
  } finally {
    submitting.value = false;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
</script>
