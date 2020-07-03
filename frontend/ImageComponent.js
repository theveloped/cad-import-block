import PropTypes from 'prop-types';
import React from 'react';

function ImageComponent({width, height}) {
    const grey_light = { fill: "#E2E5E7" };
    const grey_dark = { fill: "#B0B7BD" };
    const grey_mid = { fill: "#CAD1D8" };
    const blue = { fill: "#1283da" };
    const white = { fill: "#FFFFFF" };

  return (
    <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        preserveAspectRatio="xMidYMid meet"
        width={width}
        height={height}>

        <path style={grey_light} d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"/>
        <path style={grey_dark} d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"/>
        <polygon style={grey_mid} points="480,224 384,128 480,128 "/>
        <path style={blue} d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16V416z"/>
        <g>
            <path style={white} d="M85.648,339.088c0-24.688,15.488-45.92,44.912-45.92c11.12,0,19.952,3.328,29.296,11.392c3.456,3.184,3.824,8.832,0.368,12.4c-3.456,3.056-8.688,2.688-11.76-0.384c-5.248-5.504-10.624-7.024-17.904-7.024c-19.696,0-29.168,13.952-29.168,29.552c0,15.872,9.344,30.448,29.168,30.448c7.28,0,14.064-2.944,19.952-8.192c3.968-3.056,9.472-1.536,11.76,1.536c2.048,2.816,3.072,7.552-1.408,12.032c-8.96,8.32-19.696,9.984-30.32,9.984C99.6,384.912,85.648,363.792,85.648,339.088z"/>
            <path style={white} d="M181.056,384c-4.096-2.304-6.656-6.912-4.096-12.288l36.704-71.76c3.456-6.784,12.672-7.024,15.872,0l36.064,71.76c5.248,9.984-10.24,17.904-14.832,7.936l-5.648-11.264h-47.2l-5.504,11.264C190.384,384,185.664,384.912,181.056,384z M236.064,351.52l-14.448-31.616l-15.728,31.616H236.064z"/>
            <path style={white} d="M289.264,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.608,4.608-7.936,8.832-7.936h29.296c58.464,0,57.184,88.528,1.152,88.528H289.264z M297.328,311.072v57.312h21.232c34.544,0,36.08-57.312,0-57.312H297.328z"/>
        </g>
        <path style={grey_mid} d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"/>
    </svg>
  );
};

ImageComponent.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
};

export default ImageComponent;