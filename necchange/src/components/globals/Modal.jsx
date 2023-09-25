const Modal = () => {
  return showModal ? (
    <div className="flex justify-center items-center fixed inset-0 z-50 w-full">
      <div
        className={
          (overflowY ? "" : "overflow-y-auto max-h-90") +
          " flex flex-col rounded-lg shadow-lg bg-white p-6 my-6 mx-6 z-50"
        }
      >
        {/*header*/}
        <div className="flex items-start justify-between">
          <header>
            <h2 className="text-3xl text-blue-500 mb-8 font-bold">{title}</h2>
          </header>
          <button
            className="p-1 text-slate-900 text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
        </div>
        {/*body*/}
        <div className="flex flex-col space-y-2">{children}</div>
      </div>
      <div
        className="opacity-25 fixed inset-0 z-40 bg-black"
        onClick={() => setShowModal(false)}
      ></div>
    </div>
  ) : (
    <></>
  );
};

export default Modal;
