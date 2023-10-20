import useApi from '../composables/UseApi';

export default function postsService(collection) {
  const { list, post, update, remove, getById, getListSubCategories } = useApi(collection);

  return {
    list,
    getById,
    post,
    update,
    remove,
    getListSubCategories
  }
}
