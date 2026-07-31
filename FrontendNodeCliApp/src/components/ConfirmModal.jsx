import { createPortal } from "react-dom";

const ConfirmModal = ({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onClose,
}) => {
    if (!open) return null;



    return createPortal(
        <div onClick={onClose} className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
            <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">

                <h2 className="text-2xl font-bold text-gray-800">
                    {title}
                </h2>

                <p className="mt-3 text-gray-600">
                    {message}
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>

                </div>
            </div>
        </div>,document.body
    );
};

export default ConfirmModal;