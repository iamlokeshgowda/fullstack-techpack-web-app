import { useDispatch, useSelector } from "react-redux";
import { hideConfirmDialog } from "../store/slices/ui/confirmDialogSlice";
import {
  deleteCategory,
  deleteProduct,
} from "../store/slices/admin/adminThunks";

const ConfirmDialog = () => {
  const dispatch = useDispatch();
  const { open, title, message, confirmText, actionType, actionPayload } =
    useSelector((state) => state.confirmDialog);

  if (!open) return null;

  const handleConfirm = async () => {
    // ✅ Execute action based on type
    try {
      if (actionType === "DELETE_CATEGORY") {
        await dispatch(deleteCategory(actionPayload));
      }

      if (actionType === "DELETE_PRODUCT") {
        await dispatch(deleteProduct(actionPayload));
        // notify listeners (e.g., Products page) to refresh
        try {
          window.dispatchEvent(
            new CustomEvent("admin:productDeleted", { detail: actionPayload })
          );
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore errors here (thunks show toasts)
    } finally {
      dispatch(hideConfirmDialog());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => dispatch(hideConfirmDialog())}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
