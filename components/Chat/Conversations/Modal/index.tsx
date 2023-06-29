import React from 'react';

export default function Modal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (state: boolean) => void }) {
  return (
    <>
      <input type="checkbox" className="display-none modal-state" checked={isOpen} />
      <div className="modal">
        <label className="modal-overlay" htmlFor="modal-1" />
        <div className="modal-content flex flex-col gap-5">
          <button className="btn-sm btn-circle btn-ghost btn absolute right-2 top-2" onClick={() => setIsOpen(false)}>
            ✕
          </button>
          <h2 className="text-xl">Modal title 1</h2>
          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolorum voluptate ratione dicta. Maxime cupiditate, est commodi consectetur earum
            iure, optio, obcaecati in nulla saepe maiores nobis iste quasi alias!
          </span>
          <div className="flex gap-3">
            <button className="btn-error btn-block btn">Delete</button>

            <button className="btn-block btn">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
