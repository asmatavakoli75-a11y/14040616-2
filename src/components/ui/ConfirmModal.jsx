import React from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  iconName = 'AlertTriangle',
  iconClassName = 'text-destructive',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md" role="dialog" aria-modal="true">
        <div className="p-6 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-destructive/10 ${iconClassName.replace('text-', 'bg-')}`}>
            <Icon name={iconName} size={24} className={iconClassName} />
          </div>
          <h3 className="text-lg font-semibold text-foreground font-heading" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              {body}
            </p>
          </div>
        </div>
        <div className="bg-muted/50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-lg">
          <Button onClick={onConfirm} variant="destructive">
            {confirmText}
          </Button>
          <Button onClick={onClose} variant="outline">
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
