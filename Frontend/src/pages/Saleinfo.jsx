import React from 'react';
import { Check, X } from 'lucide-react';

function SaleInfo({ show, onClose, title, description, price, preview, author, date}) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <button type='button' onClick={onClose} className="absolute top-0 left-0 ml-4 mt-4 backdrop-blur-[5rem] bg-gray-600 bg-opacity-40 px-2.5 py-1 rounded-3xl"><div className={"flex flex-row justify-center items-center content-center gap-1"}><X
                                    width={15} height={15}/> Cancel </div></button>
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  {title}
                </h3>
                <div className="mt-2">
                <img src={preview} alt="" />
                  <p className="text-sm text-gray-500">{author}</p>
                  <p className="text-sm text-gray-500">{date}</p>
                  <p className="text-sm text-gray-500">
                    {description}
                  </p>
                </div>
                <button className="backdrop-blur-[5rem]bg-opacity-40 px-5 py-1 rounded-3xl bg-green-400">{price} PURCHASE</button>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
}

export default SaleInfo;