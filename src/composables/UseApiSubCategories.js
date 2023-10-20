import { api } from 'boot/axios';

export default function useApiSubCategories(url) {
  //get para traer records de la base de datos
  const list = async () => {
    try {
      const { data } = await api.get(url);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  //trae la SubCategorias para Llenar el Select de Form
  const getListSubCategories = async () => {
    try {
      const { data } = await api.get(`${url}/subcategories`);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  //get para traer records de la base de datos
  const getById = async (id) => {
    try {
      const { data } = await api.get(`${url}/${id}`);
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
