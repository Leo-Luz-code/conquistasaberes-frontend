<template>
  <q-form @submit.prevent.stop="sendData" greedy class="space-y-4">
    <div>
      <h3 class="text-sm font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-2">
        Dados do Servidor
      </h3>
      <div class="row q-col-gutter-sm">
        
        <div class="col-xs-12 col-sm-6">
          <Label required>Nome Completo</Label>
          <q-input
            dense outlined v-model="form.nome"
            placeholder="Ex: João da Silva"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="nameRules"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>Email</Label>
          <q-input
            dense outlined v-model="form.email"
            placeholder="email@exemplo.com"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="emailRules"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>CPF</Label>
          <q-input
            dense outlined v-model="form.cpf"
            placeholder="000.000.000-00" mask="###.###.###-##"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="empty_field_rules"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>Matrícula PMVC</Label>
          <q-input
            dense outlined v-model="form.matricula"
            placeholder="Ex: 123456"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="empty_field_rules"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>Cargo / Função</Label>
          <q-input
            dense outlined v-model="form.cargo"
            placeholder="Ex: Técnico Administrativo"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="empty_field_rules"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>Secretaria</Label>
          <q-select
            dense outlined v-model="form.secretariaId"
            :options="secretarias"
            option-value="id" option-label="nome"
            map-options emit-value
            placeholder="Selecione a secretaria"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="empty_field_rules" behavior="menu"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>Nível de Acesso (Role)</Label>
          <q-select
            :disable="!administrator"
            dense outlined v-model="form.role"
            :options="role_options"
            map-options emit-value
            placeholder="Selecione o nível"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="empty_field_rules" behavior="menu"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label required>Situação</Label>
          <q-select
            :disable="!administrator"
            dense outlined v-model="form.statusAtivo"
            :options="situation_options"
            map-options emit-value
            placeholder="Status do servidor"
            class="bg-white" color="blue-grey-10"
            lazy-rules clearable clear-icon="close"
            :rules="empty_field_rules" behavior="menu"
          />
        </div>

      </div>
    </div>

    <div>
      <h3 class="text-sm font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-2 mt-4">
        Acesso
      </h3>
      <div class="row q-col-gutter-sm">
        
        <div class="col-xs-12 col-sm-6">
          <Label :required="!userId">
            Senha <span v-if="userId" class="text-[10px] lowercase normal-case">(Deixe em branco p/ manter)</span>
          </Label>
          <q-input
            type="password" dense outlined v-model="form.senha"
            placeholder="********"
            class="bg-white" color="blue-grey-10"
            lazy-rules clear-icon="close"
            :rules="password_rules" autocomplete="new-password"
          />
        </div>

        <div class="col-xs-12 col-sm-6">
          <Label :required="!userId">
            Confirmar Senha
          </Label>
          <q-input
            type="password" dense outlined v-model="password_confirmation"
            placeholder="********"
            class="bg-white" color="blue-grey-10"
            lazy-rules clear-icon="close"
            :rules="rules_confirm_password"
          />
        </div>

      </div>
    </div>

    <div class="row justify-end items-center q-gutter-md pt-2 border-t border-slate-100 mt-6">
      <q-btn
        v-if="showBackButton"
        flat label="Cancelar" color="blue-grey-6"
        to="/admin/usuarios"
        class="font-medium hover:bg-slate-100 px-4 rounded-lg"
        no-caps
      />
      
      <q-btn
        unelevated icon="save" :label="labelButtonSave"
        type="submit" style="background-color: #1660ab; color: white"
        class="px-6 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
        no-caps :loading="loading"
      />
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import Label from '../formsCommon/Label.vue';

const $q = useQuasar();

const emits = defineEmits(['submitData']);

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  matricula: '',
  cargo: '',
  secretariaId: '',
  role: '',
  statusAtivo: true,
  senha: '',
});

const props = defineProps({
  userId: {
    type: String,
    default: '',
  },
  administrator: {
    type: Boolean,
    default: false,
  },
  labelButtonSave: {
    type: String,
    default: 'Salvar',
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
});

const password_confirmation = ref('');
const secretarias = ref([]);
const loading = ref(false);

const role_options = ref([
  { label: 'Servidor (Comum)', value: 'SERVIDOR' },
  { label: 'Gestor de Secretaria', value: 'GESTOR_SECRETARIA' },
  { label: 'Administrador RH / CETI', value: 'ADMIN_RH_CETI' }
]);

const situation_options = ref([
  { label: 'Ativo', value: true },
  { label: 'Inativo', value: false }
]);

const empty_field_rules = [(val) => val !== null && val !== '' || '*Campo obrigatório'];

function validateName(val) {
  const regex = /[!@#$%*()_+=-?°``''~©,.;<>:]|[0-9]/g;
  return !regex.test(val);
}

function validateEmail(val) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(val);
}

function validatePassword() {
  if (!!props.userId) return true;
  return !!form.value.senha.length;
}

function validatePasswordConfirmation() {
  if (!!props.userId && form.value.senha.length === 0) return true;
  const equal_values = form.value.senha === password_confirmation.value;
  if (equal_values) return true;
}

const nameRules = [
  (val) => !!val || '*Campo obrigatório',
  (val) =>
    validateName(val) ||
    "*Proibido o uso de caracteres especiais ou números",
];

const emailRules = [
  (val) => !!val || '*Campo obrigatório',
  (val) => validateEmail(val) || '*Formato de email inválido',
];

const password_rules = [() => validatePassword() || '*Campo obrigatório'];

const rules_confirm_password = [
  () => validatePasswordConfirmation() || '*As senhas fornecidas não são iguais.',
];

async function loadSecretarias() {
  try {
    const { data } = await api.get('courses/secretarias');
    secretarias.value = data;
  } catch (error) {
    console.error('Erro ao carregar secretarias:', error);
  }
}

async function findUser(id) {
  const { data } = await api.get(`usuarios/${id}`);
  return data;
}

function fillInFields(data) {
  form.value.nome = data.nome;
  form.value.email = data.email;
  form.value.cpf = data.cpf;
  form.value.matricula = data.matricula;
  form.value.cargo = data.cargo;
  form.value.secretariaId = data.secretariaId;
  form.value.role = data.role;
  form.value.statusAtivo = data.statusAtivo;
}

function sendData() {
  const dataToSend = { ...form.value };
  if (!dataToSend.senha) {
    delete dataToSend.senha;
  }
  emits('submitData', dataToSend);
}

onMounted(async () => {
  await loadSecretarias();
  if (props.userId) {
    const data = await findUser(props.userId);
    fillInFields(data);
  }
});
</script>

<style scoped>
</style>