import { useDispatch, useSelector } from "react-redux";
import css from "./DeleteModal.module.css";
import { closeModal } from "../../redux/modal/slice";
import toast from "react-hot-toast";
import { deleteWater } from "../../redux/waters/operations";
import { selectLoading } from "../../redux/waters/selectors";

const DeleteModal = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
  
    const handleDelete = () => {
      dispatch(deleteWater())
        .unwrap()
        .then(() => {
          dispatch(closeModal());
        })
        .catch((error) => {
          toast.error("Delete failed: " + error.message);
        });
    };

    return (
      <div className={css.deleteModal}>
        <h2 className={css.title}>Delete entry</h2>
        <p className={css.text}>Are you sure you want to delete the entry?</p>
        <button
          type="button"
          className={`${css.btn} ${css.deleteBtn}`}
          onClick={handleDelete}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
        <button
          type="button"
          className={`${css.btn} ${css.cancelBtn}`}
          onClick={() => dispatch(closeModal())}
        >
          Cancel
        </button>
      </div>
    );
};
  
export default DeleteModal;