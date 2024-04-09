import React, { useState } from 'react'
import Saleinfo from './Saleinfo';
import data from '../../../Backend/api/explore_images/explorePictures.json';
function Explore() {
    
    const [selectedItem, setSelectedItem] = useState(null);
    const openPreviewHandler = (item) => {
        setSelectedItem(item);
    }
    const closePreviewHandler = () => {
        setSelectedItem(null);
    }
    
    //const images = data.map((x) => <img key={x.id} src={x.url}  alt=""/>);
    
    return (
      <div className="grid grid-cols-3 mx-2 my-2 gap-0.5 mb-52 mt-28">
        <>
        {data && data.map((image, index) => {
          return (
            <React.Fragment key={index}>
              <div>
              <img onClick={openPreviewHandler.bind(this, image)} src={image.url} alt="" className="rounded-lg" />
              <div className="flex items-end justify-center">
              <p className="px-5">{image.title}</p>
              <p className=" text-green-600">{image.price}</p>
              
              </div>
              </div>
            </React.Fragment>
          );
      })}
      { selectedItem !== null ? <Saleinfo show={true} onClose={closePreviewHandler} title={selectedItem.title || ''} description={selectedItem.description || ''} price={selectedItem.price} preview={selectedItem.url} author={selectedItem.author} date={selectedItem.dateTaken}/> : null }
  </></div>
    );
}


export default Explore;
