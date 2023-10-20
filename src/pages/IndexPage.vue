<template>
  <q-page padding>
    <q-table
      title="Treats"
      :rows="posts"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      hide-pagination
      :filter="filter"
    >
      <template v-slot:top>
        <span>Categorías</span>
        <q-space />
        <q-input dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn
          color="primary"
          label="Agregar Categoria"
          :to="{ name: 'formCategory' }"
        />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn
            icon="edit"
            dense
            size="sm"
            color="info"
            @click="handleEditPost(props.row.id)"
          >
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
          <q-btn
            icon="delete"
            dense
            size="sm"
            @click="handleDeletePost(props.row)"
          >
            <q-tooltip> Eliminar </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
/* import { api } from "boot/axios"; */
import postsService from "src/services/posts";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const collection = "categories";
    const filter = ref("");
    const { list, remove } = postsService(collection);
    const posts = ref([]);
    const router = useRouter();
    const columns = [
      {
        name: "id",
        label: "ID",
        field: "id",
        sortable: true,
      },
      {
        name: "name",
        label: "Categoría",
        field: "name",
        sortable: true,
        align: "left",
      },
      {
        name: "subcategoryname",
        label: "SubCategoria",
        field: "subcategoryname",
        sortable: true,
        align: "left",
      },
      {
        name: "description",
        label: "Descripcion",
        field: "description",
        sortable: true,
        align: "left",
      },
      {
        name: "actions",
        label: "Acciones",
        field: "actions",
        sortable: true,
        align: "right",
      },
    ];
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 3,
      // rowsNumber: xx if getting data from a server
    });
    const $q = useQuasar();

    onMounted(() => {
      getPosts();
    });

    const getPosts = async () => {
      try {
        /* const data = await list(); */
        posts.value = await list();
        console.log(
          "Lista de Categorias " + JSON.stringify(posts.value, null, 2)
        );
        console.log("Esto son los POSTS " + posts.value.length);
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeletePost = async ({ id, name }) => {
      try {
        $q.dialog({
          title: "Eiminar Registro",
          message: "Confirma la Eliminación del Registro Seleccionado?",
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(id);
          $q.notify({
            message: `El registro con Id: ${id} (${name}) ha sido eliminado con éxito`,
            icon: "check",
            color: "positive",
          });
          await getPosts();
        });
      } catch (error) {
        $q.notify(error);
      }
    };

    const handleEditPost = async (id) => {
      router.push({ name: "formCategory", params: { id } });
    };

    return {
      posts,
      pagination,
      filter,
      columns,
      handleDeletePost,
      handleEditPost,
      pagesNumber: computed(() =>
        Math.ceil(posts.value.length / pagination.value.rowsPerPage)
      ),
    };
  },
});
</script>
