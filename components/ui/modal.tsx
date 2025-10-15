import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: "default" | "secondary" | "ghost" | "link"
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    confirmVariant = "default"
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    
    // Handle escape key press
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }
      
      if (isOpen) {
        setIsVisible(true);
        document.addEventListener("keydown", handleEscape)
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden"
      }
      
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "auto"
      }
    }, [isOpen, onClose])
    
    // Handle transition end
    const handleTransitionEnd = () => {
      if (!isOpen) {
        setIsVisible(false);
      }
    }
    
    if (!isVisible && !isOpen) return null;

    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Backdrop with blur effect */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md"></div>
        
        <Card 
          ref={ref}
          className={`relative w-full max-w-md p-6 space-y-4 z-10 shadow-xl transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button 
              variant={confirmVariant} 
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={confirmVariant === "default" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {confirmText}
            </Button>
          </div>
        </Card>
      </div>
    )
  }
)

Modal.displayName = "Modal"

export { Modal }