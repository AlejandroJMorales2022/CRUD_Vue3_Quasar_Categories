<template>
  <q-page padding>
    <q-form @submit="onSubmit" class="row q-col-gutter-sm justify-center">
      <q-input
        outlined
        v-model="form.name"
        label="Categoria *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'campo obligatorio']"
        class="col-sm-6 col-12"
      />
      <q-select
        outlined
        :options-dense="denseOpts"
        v-model="selectedSubcategory"
        :options="subCategories"
        label="Subcategoria"
        @update:modelValue="updateSubcategoryId"
        :rules="[(val) => (val && val.length > 0) || 'campo obligatorio']"
        class="col-sm-6 col-12"
      />
      <div class="col-12">
        <q-editor v-model="form.description" min-height="5rem" />
      </div>

      <div class="col-12 q-gutter-md">
        <q-btn
          color="white"
          text-color="black"
          glossy
          label="Guardar"
          icon="save"
          class="float-right"
          type="submit"
        />
        <q-btn
          color="deep-orange"
          text-color="black"
          glossy
          label="Cancelar"
          icon="cancel"
          class="float-right"
          :to="{ name: 'Home' }"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import postsService from "src/services/posts";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "formCategory",

  setup() {
    let collection = "categories";
    let selectContent = [];
    const { post, getById, update, getListSubCategories } =
      postsService(collection);
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const form = ref({
      name: "",
      description: "",
      subcategory: "",
      subcategoryname: "",
    });

    const subCategories = ref([]);
    const selectedSubcategory = ref(null);

    onMounted(async () => {
      loadSelectData();
      if (route.params.id) {
        //si tengo id como parametro => edit
        await getElement(route.params.id);
        //mostrar en el select la subcategoria de la categoria seleccionada (id)
        selectedSubcategory.value = form.value.subcategoryname;
        console.log(
          "SubCategoria a Cargar en el Select " + form.value.subcategoryname
        );
      } else {
        //si NO tengo id como parametro => addNew
      }
    });

    const getElement = async (id) => {
      collection = "categories";
      try {
        const response = await getById(id);
        console.log(response);
        form.value = response;
      } catch (error) {
        console.error(error);
      }
    };

    const loadSelectData = async () => {
      let newArray = [];
      try {
        const response = await getListSubCategories();
        response.forEach((e) => {
          newArray.push(e.name);
        });
        /* newArray.sort(); */
        console.log("NewArray: " + JSON.stringify(newArray, null, 2));
        subCategories.value = newArray;
      } catch (error) {
        console.error(error);
      }
    };

    const updateSubcategoryId = async (selectedName) => {
      // Busca el ID correspondiente en el array de subcategorías originales
      try {
        const subcategories = await getListSubCategories();
        const subcategory = subcategories.find(
          (sub) => sub.name === selectedName
        );
        if (subcategory) {
          form.value.subcategory = subcategory.id; // Establece el ID en el formulario
        }
      } catch (error) {
        console.error(error);
      }
    };

    const onSubmit = async () => {
      collection = "categories";
      try {
        if (form.value.id) {
          await update(form.value);
          $q.notify({
            message: `El Registro se ha Actualizado con éxito`,
            icon: "check",
            color: "positive",
          });
        } else {
          await post(form.value);
          $q.notify({
            message: `El Registro se ha Agregado con éxito`,
            icon: "check",
            color: "positive",
          });
        }

        router.push({ name: "Home" });
      } catch (error) {
        console.error(error);
      }
    };

    return {
      form,
      onSubmit,
      model: ref(null),
      subCategories,
      selectedSubcategory,
      updateSubcategoryId,
      dense: ref(false),
      denseOpts: ref(true),
    };
  },
});
</script>
