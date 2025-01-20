import React from "react";
import Modal from "react-modal";

const ConfirmDeactivateModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  accountNumber,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation de désactivation"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
        <p className="mb-4">
          Êtes-vous sûr de vouloir désactiver le compte{" "}
          <strong>{accountNumber}</strong> ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Désactiver
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeactivateModal;
