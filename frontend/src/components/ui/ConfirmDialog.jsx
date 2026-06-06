// src/components/ui/ConfirmDialog.jsx
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  isLoading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="max-w-sm">
      <p className="text-text-secondary text-sm mb-8 leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Processing...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
