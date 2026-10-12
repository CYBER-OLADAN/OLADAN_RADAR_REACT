import React, { useState } from "react";
import Modal from "./Modal";

const ConfirmDialog = ({
  show,
  onConfirm,
  onCancel,
  title = "Confirm",
  text = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
        <div className="confirm-dialog-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmDialog.defaultProps = {
  show: false,
  onConfirm: () => {},
  onCancel: () => {},
};

export default ConfirmDialog;
export function ConfirmDialog({ show, onConfirm, onCancel, title = "Confirm", text = "Are you sure you want to proceed?", confirmText = "Delete", cancelText = "Cancel" }) {
  return (
    <Modal show={show} onHide={onCancel}>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
        <div className="confirm-dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}