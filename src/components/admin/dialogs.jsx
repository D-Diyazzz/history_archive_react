import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-dialog">
            <div className="confirm-dialog-content">
                <p>{message}</p>
                <div className="confirm-dialog-actions">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;

