<template>
  <q-page class="p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-5 sm:space-y-6 font-sans">

    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Fórum
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Espaço de troca entre servidores: dúvidas, boas práticas e experiências.
        </p>
      </div>

      <q-btn
        label="NOVO TÓPICO"
        icon="add"
        color="primary"
        class="w-full sm:w-auto !py-2.5 !px-5 bg-pmvc-blue text-white font-bold rounded-xl"
        unelevated
        no-caps
        @click="openCreateModal"
      />
    </div>

    <!-- Loading -->
    <div
      v-if="forumStore.loading"
      class="flex justify-center py-12 sm:py-16"
    >
      <q-spinner-dots
        color="primary"
        size="50px"
      />
    </div>

    <!-- Feed -->
    <div
      v-else-if="forumStore.posts.length > 0"
      class="space-y-3"
    >
      <div
        v-for="post in forumStore.posts"
        :key="post.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
      >
        <!-- Cabeçalho do post -->
        <div
          class="flex items-center gap-3 p-3 sm:p-5 cursor-pointer"
          @click="toggleExpand(post.id)"
        >
          <!-- Avatar -->
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0"
          >
            {{ (post.autor || post.user?.nome || 'U').charAt(0).toUpperCase() }}
          </div>

          <!-- Informações -->
          <div class="flex-1 min-w-0">
            <h3
              class="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate flex items-center gap-1.5"
            >
              <q-icon
                v-if="post.fixado"
                name="push_pin"
                size="14px"
                class="text-amber-500 shrink-0"
              />
              <span class="truncate">
                {{ post.titulo }}
              </span>
            </h3>

            <p class="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
              Por
              <span class="font-semibold text-slate-700">
                {{ post.autor || post.user?.nome || 'Servidor Municipal' }}
              </span>
              · {{ post.secretariaSigla || post.user?.secretaria?.sigla || 'PMVC' }}
              · {{ timeAgo(post.createdAt) }}
            </p>
          </div>

          <!-- Informações do lado direito -->
          <div class="flex items-center gap-2 shrink-0">
            <span
              class="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap"
            >
              <q-icon
                name="chat_bubble_outline"
                size="14px"
              />
              <span class="hidden sm:inline">
                {{ post.comments?.length || 0 }} respostas
              </span>
              <span class="sm:hidden">
                {{ post.comments?.length || 0 }}
              </span>
            </span>

            <q-icon
              name="expand_more"
              size="20px"
              class="text-slate-400 transition-transform"
              :class="{
                'rotate-180': expandedPostId === post.id
              }"
            />
          </div>
        </div>

        <!-- Conteúdo expandido -->
        <div
          v-if="expandedPostId === post.id"
          class="border-t border-slate-100 p-3 sm:p-5 space-y-4"
        >
          <!-- Conteúdo + ações -->
          <div
            class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4"
          >
            <p
              class="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line flex-1 min-w-0"
            >
              {{ post.conteudo }}
            </p>

            <!-- Ações -->
            <div class="flex items-center gap-1 self-end sm:self-start shrink-0">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                size="sm"
                @click.stop="openEditModal(post)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click.stop="handleDelete(post.id)"
              >
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Respostas -->
          <div
            class="space-y-3 pt-3 border-t border-slate-100"
          >
            <span
              class="text-xs font-bold text-slate-700 flex items-center gap-1"
            >
              <q-icon
                name="chat_bubble_outline"
                size="16px"
              />
              Respostas ({{ post.comments?.length || 0 }})
            </span>

            <!-- Lista de respostas -->
            <div
              v-if="post.comments && post.comments.length > 0"
              class="space-y-2 pl-3 sm:pl-4 border-l-2 border-pmvc-blue/20"
            >
              <div
                v-for="comment in post.comments"
                :key="comment.id"
                class="bg-slate-50 rounded-xl p-3 text-xs space-y-1 min-w-0"
              >
                <div
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 font-bold text-slate-800"
                >
                  <span class="truncate">
                    {{ comment.autor }}
                    ({{ comment.secretariaSigla }})
                  </span>

                  <span
                    class="text-[9px] text-slate-400 font-normal shrink-0"
                  >
                    {{ formatDate(comment.createdAt) }}
                  </span>
                </div>

                <p
                  class="text-slate-600 whitespace-pre-line break-words leading-relaxed"
                >
                  {{ comment.conteudo }}
                </p>
              </div>
            </div>

            <!-- CAMPO DE RESPOSTA (Híbrido: Desktop vs Mobile) -->
            <div class="pt-1" @click.stop>
              
              <!-- DESKTOP: Input Inline -->
              <div class="hidden sm:flex items-center gap-2">
                <q-input
                  dense
                  outlined
                  v-model="replyText[post.id]"
                  placeholder="Escreva uma resposta..."
                  class="flex-1 min-w-0 text-xs"
                  bg-color="slate-50"
                  hide-bottom-space
                  @keyup.enter="handleSendReply(post.id)"
                />

                <q-btn
                  icon="send"
                  color="primary"
                  unelevated
                  dense
                  class="px-3 shrink-0"
                  :loading="replySubmitting[post.id]"
                  @click="handleSendReply(post.id)"
                >
                  <q-tooltip>Enviar Resposta</q-tooltip>
                </q-btn>
              </div>

              <!-- MOBILE: Botão que abre modal focado para digitação -->
              <div class="sm:hidden">
                <q-btn
                  label="Responder a este tópico"
                  icon="chat"
                  color="primary"
                  outline
                  no-caps
                  dense
                  class="w-full py-2 rounded-xl text-xs font-bold"
                  @click="openMobileReplyModal(post)"
                />
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-3"
    >
      <q-icon
        name="forum"
        size="56px"
        class="text-slate-300"
      />

      <h3 class="font-bold text-slate-700 text-lg">
        Nenhuma publicação ainda
      </h3>

      <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Seja o primeiro a publicar uma dúvida ou compartilhar um aprendizado
        com os demais servidores!
      </p>

      <q-btn
        label="Criar primeiro tópico"
        icon="add"
        color="primary"
        unelevated
        no-caps
        class="rounded-xl mt-2"
        @click="openCreateModal"
      />
    </div>

    <!-- Modal Nova/Editar Publicação -->
    <q-dialog
      v-model="showModal"
      persistent
    >
      <q-card
        class="rounded-2xl w-[calc(100vw-24px)] sm:w-auto sm:min-w-[450px]"
        style="max-width: 550px"
      >
        <q-card-section
          class="flex items-center justify-between gap-3 p-4 sm:p-5"
        >
          <h3
            class="font-bold text-slate-900 text-base sm:text-lg leading-tight"
          >
            {{ isEditing ? 'Editar Dúvida' : 'Publicar Nova Dúvida' }}
          </h3>

          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section
          class="space-y-4 px-4 sm:px-5"
        >
          <q-input
            outlined
            dense
            v-model="postForm.titulo"
            label="Título da Dúvida ou Tópico"
            placeholder="Ex: Como aplicar a LGPD?"
            hide-bottom-space
          />

          <q-input
            outlined
            type="textarea"
            v-model="postForm.conteudo"
            label="Detalhamento"
            placeholder="Descreva sua dúvida com mais detalhes..."
            rows="5"
            autogrow
            hide-bottom-space
          />
        </q-card-section>

        <q-card-actions
          class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 sm:p-5"
        >
          <q-btn
            flat
            label="Cancelar"
            color="grey"
            v-close-popup
            class="w-full sm:w-auto"
          />

          <q-btn
            :label="isEditing ? 'SALVAR' : 'PUBLICAR'"
            color="primary"
            class="bg-pmvc-blue font-bold w-full sm:w-auto px-6"
            unelevated
            no-caps
            :loading="submitting"
            @click="handleSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Resposta Específico para Celular -->
    <q-dialog v-model="showMobileReplyModal" position="bottom">
      <q-card class="rounded-t-2xl p-4 space-y-3 w-full">
        <div class="flex items-center justify-between">
          <span class="font-bold text-sm text-slate-800">
            Responder a: {{ activePostForReply?.titulo }}
          </span>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <q-input
          outlined
          type="textarea"
          v-model="mobileReplyText"
          placeholder="Escreva sua resposta..."
          rows="4"
          autogrow
          autofocus
        />

        <q-card-actions align="right" class="p-0">
          <q-btn
            label="Enviar Resposta"
            icon="send"
            color="primary"
            unelevated
            no-caps
            class="w-full rounded-xl py-2.5 font-bold"
            :loading="replySubmitting[activePostForReply?.id]"
            @click="handleSendMobileReply"
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

// Estados extras para o Modal de Resposta Mobile
const showMobileReplyModal = ref(false);
const activePostForReply = ref(null);
const mobileReplyText = ref('');

onMounted(() => {
  forumStore.fetchPosts();
});

function toggleExpand(postId) {
  expandedPostId.value =
    expandedPostId.value === postId ? null : postId;
}

function openCreateModal() {
  isEditing.value = false;
  editingPostId.value = null;

  postForm.value = {
    titulo: '',
    conteudo: '',
  };

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
  if (
    !postForm.value.titulo?.trim() ||
    !postForm.value.conteudo?.trim()
  ) {
    return;
  }

  submitting.value = true;

  try {
    if (isEditing.value) {
      await forumStore.updatePost(
        editingPostId.value,
        postForm.value
      );
    } else {
      await forumStore.createPost(postForm.value);
    }

    postForm.value = {
      titulo: '',
      conteudo: '',
    };

    showModal.value = false;
  } finally {
    submitting.value = false;
  }
}

async function handleSendReply(postId) {
  const content = replyText.value[postId];

  if (!content || !content.trim()) {
    return;
  }

  replySubmitting.value[postId] = true;

  try {
    await forumStore.addComment(
      postId,
      content.trim()
    );

    replyText.value[postId] = '';
  } finally {
    replySubmitting.value[postId] = false;
  }
}

// Funções para gerenciar o envio via modal no celular
function openMobileReplyModal(post) {
  activePostForReply.value = post;
  mobileReplyText.value = '';
  showMobileReplyModal.value = true;
}

async function handleSendMobileReply() {
  const postId = activePostForReply.value?.id;
  const content = mobileReplyText.value;

  if (!postId || !content || !content.trim()) {
    return;
  }

  replySubmitting.value[postId] = true;

  try {
    await forumStore.addComment(
      postId,
      content.trim()
    );

    mobileReplyText.value = '';
    showMobileReplyModal.value = false;
  } finally {
    replySubmitting.value[postId] = false;
  }
}

function handleDelete(postId) {
  $q.dialog({
    title: 'Excluir Publicação',
    message:
      'Tem certeza que deseja excluir esta publicação do fórum?',
    cancel: {
      label: 'Cancelar',
      flat: true,
    },
    ok: {
      label: 'Excluir',
      color: 'negative',
      unelevated: true,
    },
    persistent: true,
  }).onOk(async () => {
    await forumStore.deletePost(postId);
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return '';

  const diffMs =
    Date.now() - new Date(dateStr).getTime();

  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 60) {
    return `há ${minutes || 1} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return 'ontem';
  }

  return `há ${days} dias`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';

  return new Date(dateStr).toLocaleDateString(
    'pt-BR'
  );
}
</script>