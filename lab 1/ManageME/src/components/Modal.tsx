import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
    openModal: boolean;
    closeModal: () => void;
    children: ReactNode;
}

function Modal({ openModal, closeModal, children }: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    return (
        <dialog style={{ width: "80%", maxWidth: "500px", border: "1px solid rgba(0,0,0,.2)", borderRadius: "0.3rem" }}
            ref={ref}
            onCancel={closeModal}
        >
            {children}
            <button className="btn btn-secondary w-100 mt-2" onClick={closeModal}>
                Close
            </button>
        </dialog>
    );
}

export default Modal;