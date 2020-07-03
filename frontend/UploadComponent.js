import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import ImageComponent from './ImageComponent';


function UploadComponent({onDropCallback}) {

  // Triggered once a file is droped in the dropzone
  const onDrop = useCallback(acceptedFiles => {
    console.log("[+] file dropped: " + acceptedFiles[0].name);
    onDropCallback(acceptedFiles[0], acceptedFiles[0].name)
    return
  }, []);


  // Setting dropzon
  const { isDragActive, getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    accept: ['.step', '.stp'],
    minSize: 0,
    maxSize: 10485760,
    multiple: false,
  });


  return (
    <div className={"dropzone" + (isDragActive ? ' active' : '')} {...getRootProps()}>
      <input {...getInputProps()} />
      
      <ImageComponent height="64" width="64" />

      <div className="" style={{paddingTop: 32}}>
        <strong className="">
        {!isDragActive && 'Drop a .stp/.step file to process'}
        {isDragActive && "Drop to start processing"}
        </strong>
      </div>

      <div className="paragraph">
        Or select a record containing an assembly or a record with .stp/.step files as attachments for further processing.
      </div>
    </div>
  );
};


UploadComponent.propTypes = {
    onDropCallback: PropTypes.func.isRequired,
};

export default UploadComponent;