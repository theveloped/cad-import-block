import {loadCSSFromString, colorUtils, colors} from '@airtable/blocks/ui';

const css = `
.dropzone {
    height: calc(100% - 2em);
    padding: 2em;
    margin: 1em;
    border-radius: 0.5em;
    border: dashed 2px ${colorUtils.getHexForColor(colors.BLUE)};
    text-align: center;
}

.dropzone.active {
    border: solid 2px ${colorUtils.getHexForColor(colors.BLUE)};
    color: ${colorUtils.getHexForColor(colors.GRAY)};
}

.paragraph {
    max-width: 30em;
    margin: auto;
}

.hidden {
    visibility: hidden;
}

.viewer {
    border: none;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
}

.loader {
  height: 100%;
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
}

`;

loadCSSFromString(css);
