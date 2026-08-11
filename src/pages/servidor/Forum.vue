<template>
  <q-page class="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 font-sans">
    <!-- Cabecalho -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Fórum</h1>
        <p class="text-xs sm:text-sm text-slate-500">Espaço de troca entre servidores: dúvidas, boas práticas e experiências.</p>
      </div>

      <q-btn
        label="NOVO TÓPICO"
        icon="add"
        color="primary"
        class="!py-2.5 !px-5 bg-pmvc-blue text-white font-bold rounded-xl"
        unelevated
        no-caps
        @click="openCreateModal"
      />
    </div>

    <!-- Feed de Postagens -->
    <div v-if="forumStore.loading" class="flex justify-center py-16">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else-if="forumStore.posts.length > 0" class="space-y-3">
      <div
        v-for="post in forumStore.posts"
        :key="post.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
      >
        <!-- Linha compacta (clicável) -->
        <div
          class="flex items-center gap-4 p-4 sm:p-5 cursor-pointer"
          @click="toggleExpand(post.id)"
        >
          <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
            {{ (post.autor || post.user?.nome || 'U').charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate flex items-center gap-1.5">
              <q-icon v-if="post.fixado" name="push_pin" size="14px" class="text-amber-500 shrink-0" />
              {{ post.titulo }}
            </h3>
            <p class="text-xs text-slate-500 truncate">
              Por <span class="font-semibold text-slate-700">{{ post.autor || post.user?.nome || 'Servidor Municipal' }}</span>
              · {{ post.secretariaSigla || post.user?.secretaria?.sigla || 'PMVC' }}
              · {{ timeAgo(post.createdAt) }}
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <span class="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <q-icon name="chat_bubble_outline" size="14px" />
              {{ post.comments?.length || 0 }} respostas
            </span>
            <q-icon
              name="expand_more"
              size="20px"
              class="text-slate-400 transition-transform"
              :class="{ 'rotate-180': expandedPostId === post.id }"
            />
          </div>
        </div>

        <!-- Conteúdo expandido -->
        <div v-if="expandedPostId === post.id" class="border-t border-slate-100 p-5 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line flex-1">{{ post.conteudo }}</p>
            <div class="flex items-center gap-1 shrink-0">
              <q-btn flat round dense icon="edit" color="primary" size="sm" @click.stop="openEditModal(post)" />
              <q-btn flat round dense icon="delete" color="negative" size="sm" @click.stop="handleDelete(post.id)" />
            </div>
          </div>

          <!-- Respostas -->
          <div class="space-y-3 pt-2 border-t border-slate-100">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1">
              <q-icon name="chat_bubble_outline" size="16px" />
              Respostas ({{ post.comments?.length || 0 }})
            </span>

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

            <div class="flex gap-2 pt-1" @click.stop>
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
const expandedPostId = ref(null);

const postForm = ref({
  titulo: '',
  conteudo: '',
});

const replyText = ref({});
const replySubmitting = ref({});

onMounted(() => {
  forumStore.fetchPosts();
});

function toggleExpand(postId) {
  expandedPostId.value = expandedPostId.value === postId ? null : postId;
}

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

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `há ${minutes || 1} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ontem';
  return `há ${days} dias`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}
</script>