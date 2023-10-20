import { api } from 'boot/axios';

export default function useApi(url) {
  //get para traer records de la base de datos
  const list = async () => {
    try {
      const { data } = await api.get(url);
      const subcategories = await getListSubCategories();
      console.log('SUBCATEGORIAS ' + JSON.stringify(subcategories, null, 2))
      //populo una propiedad subcategoriname con en name de las subcategories
      data.forEach(category => {
        const subcateg = subcategories.find(subcategory => subcategory.id === category.subcategory)
        if (subcateg) {
          category.subcategoryname = subcateg.name
        }
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  //trae la SubCategorias para Llenar el Select de Form
  const getListSubCategories = async () => {
    try {
      const { data } = await api.get('http://localhost:3000/subcategories');
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  //get para traer records de la base de datos
  const getById = async (id) => {
    try {
      const { data } = await api.get(`${url}/${id}`);
      const subcategories = await getListSubCategories();
      //populo una propiedad subcategoriname con en name de las subcategories
      const subcateg = subcategories.find((sub) => sub.id === data.subcategory)
      if (subcateg) {
        data.subcategoryname = subcateg.name
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }



  //post para crear un registro nuevo en la base de datos
  const post = async (form) => {
    try {
      const { data } = await api.post(url, form);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  //aupdate para modificar un registro existente
  const update = async (form) => {
    try {
      const { data } = await api.put(`${url}/${form.id}`, form)
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  //delete borra un registro
  const remove = async (id) => {
    try {
      const { data } = await api.delete(`${url}/${id}`)
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    list,
    getById,
    post,
    update,
    remove,
    getListSubCategories
  }
}
