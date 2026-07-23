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
        @click="openCreateModal"
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
              {{ (post.autor || post.user?.nome || 'U').charAt(0).toUpperCase() }}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm leading-none">
                {{ post.autor || post.user?.nome || 'Servidor Municipal' }}
              </h4>
              <span class="text-[10px] text-slate-400">
                {{ post.secretariaSigla || post.user?.secretaria?.sigla || 'PMVC' }}
                <template v-if="post.cargo || post.user?.cargo">
                  • {{ post.cargo || post.user?.cargo }}
                </template>
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-400 font-semibold mr-2">{{ formatDate(post.createdAt) }}</span>
            <q-btn flat round dense icon="edit" color="primary" size="sm" @click="openEditModal(post)" />
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="handleDelete(post.id)" />
          </div>
        </div>

        <div class="space-y-1">
          <h3 class="font-bold text-slate-900 text-base">{{ post.titulo }}</h3>
          <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{{ post.conteudo }}</p>
        </div>

        <!-- 💬 Seção de Respostas -->
        <div class="pt-3 border-t border-slate-100 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1">
              <q-icon name="chat_bubble_outline" size="16px" />
              Respostas ({{ post.comments?.length || 0 }})
            </span>
          </div>

          <!-- Lista de Respostas Existentes -->
          <div v-if="post.comments && post.comments.length > 0" class="space-y-2 pl-4 border-l-2 border-pmvc-blue/20">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="bg-slate-50 rounded-xl p-3 text-xs space-y-1"
            >
              <div class="flex items-center justify-between font-bold text-slate-800">
                <span>{{ comment.autor }} ({{ comment.secretariaSigla }})</span>
                <span class="text-[9px] text-slate-400 font-normal">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="text-slate-600 whitespace-pre-line">{{ comment.conteudo }}</p>
            </div>
          </div>

          <!-- Campo para Responder -->
          <div class="flex gap-2 pt-1">
            <q-input
              dense
              outlined
              v-model="replyText[post.id]"
              placeholder="Escreva uma resposta para este tópico..."
              class="flex-1 text-xs"
              bg-color="slate-50"
              @keyup.enter="handleSendReply(post.id)"
            />
            <q-btn
              icon="send"
              color="primary"
              unelevated
              dense
              class="px-3"
              :loading="replySubmitting[post.id]"
              @click="handleSendReply(post.id)"
            >
              <q-tooltip>Enviar Resposta</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
      <q-icon name="forum" size="56px" class="text-slate-300" />
      <h3 class="font-bold text-slate-700 text-lg">Nenhuma publicação ainda</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">Seja o primeiro a publicar uma dúvida ou compartilhar um aprendizado com os demais servidores!</p>
    </div>

    <!-- Modal Nova/Editar Publicacao -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 350px; max-width: 550px" class="rounded-2xl p-4">
        <q-card-section class="flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-lg">
            {{ isEditing ? 'Editar Dúvida' : 'Publicar Nova Dúvida' }}
          </h3>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="space-y-4">
          <q-input
            outlined
            dense
            v-model="postForm.titulo"
            label="Título da Dúvida ou Tópico"
            placeholder="Ex: Como aplicar a LGPD em cadastros presenciais?"
            hide-bottom-space
          />
          <q-input
            outlined
            type="textarea"
            v-model="postForm.conteudo"
            label="Detalhamento"
            placeholder="Descreva sua dúvida com mais detalhes..."
            rows="4"
            hide-bottom-space
          />
        </q-card-section>

        <q-card-actions align="right" class="p-4">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            :label="isEditing ? 'SALVAR' : 'PUBLICAR'"
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
import { useQuasar } from 'quasar';

const $q = useQuasar();
const forumStore = useForumStore();
const showModal = ref(false);
const submitting = ref(false);
const isEditing = ref(false);
const editingPostId = ref(null);

const postForm = ref({
  titulo: '',
  conteudo: '',
});

const replyText = ref({});
const replySubmitting = ref({});

onMounted(() => {
  forumStore.fetchPosts();
});

function openCreateModal() {
  isEditing.value = false;
  editingPostId.value = null;
  postForm.value = { titulo: '', conteudo: '' };
  showModal.value = true;
}

function openEditModal(post) {
  isEditing.value = true;
  editingPostId.value = post.id;
  postForm.value = {
    titulo: post.titulo,
    conteudo: post.conteudo,
  };
  showModal.value = true;
}

async function handleSubmit() {
  if (!postForm.value.titulo || !postForm.value.conteudo) return;
  submitting.value = true;
  try {
    if (isEditing.value) {
      await forumStore.updatePost(editingPostId.value, postForm.value);
    } else {
      await forumStore.createPost(postForm.value);
    }
    postForm.value = { titulo: '', conteudo: '' };
    showModal.value = false;
  } finally {
    submitting.value = false;
  }
}

async function handleSendReply(postId) {
  const content = replyText.value[postId];
  if (!content || !content.trim()) return;

  replySubmitting.value[postId] = true;
  try {
    await forumStore.addComment(postId, content);
    replyText.value[postId] = '';
  } finally {
    replySubmitting.value[postId] = false;
  }
}

function handleDelete(postId) {
  $q.dialog({
    title: 'Excluir Publicação',
    message: 'Tem certeza que deseja excluir esta publicação do fórum?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative', unelevated: true },
    persistent: true,
  }).onOk(async () => {
    await forumStore.deletePost(postId);
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
</script>