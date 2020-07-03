import {useBase, useGlobalConfig} from '@airtable/blocks/ui';
import {FieldType} from '@airtable/blocks/models';


export const ConfigKeys = {
    TABLE_ID: 'tableId',
    ID_FIELD_ID: 'idFieldId',
    SOURCE_FIELD_ID: 'sourceField',
    IMAGE_FIELD_ID: 'imageFieldId',
    FILENAME_FIELD_ID: 'filenameFieldId',
    PARTNAME_FIELD_ID: 'partnameFieldId',
    TYPE_FIELD_ID: 'typeFieldId',
    WIDTH_FIELD_ID: 'widthFieldId',
    HEIGHT_FIELD_ID: 'heightFieldId',
    LENGTH_FIELD_ID: 'lengthFieldId',
    AREA_FIELD_ID: 'areaFieldId',
    VOLUME_FIELD_ID: 'volumeFieldId',
    QUANTITY_FIELD_ID: 'quantityFieldId',

    API_CLIENT_ID: 'clientId',
    API_CLIENT_SECRET: 'clientSecret',

    IMGUR_CLIENT_ID: 'imgurId',
};


function getSettings(globalConfig, base) {
    const clientId = globalConfig.get(ConfigKeys.API_CLIENT_ID);
    const clientSecret = globalConfig.get(ConfigKeys.API_CLIENT_SECRET);
    const imgurId = globalConfig.get(ConfigKeys.IMGUR_CLIENT_ID);

    const table =           base.getTableByIdIfExists(globalConfig.get(ConfigKeys.TABLE_ID));
    const idField =         table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.ID_FIELD_ID)) : null;
    const sourceField =     table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.SOURCE_FIELD_ID)) : null;
    const imageField =      table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.IMAGE_FIELD_ID)) : null;
    const filenameField =   table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.FILENAME_FIELD_ID)) : null;
    const partnameField =   table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.PARTNAME_FIELD_ID)) : null;
    const typeField =       table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.TYPE_FIELD_ID)) : null;
    const widthField =      table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.WIDTH_FIELD_ID)) : null;
    const heightField =     table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.HEIGHT_FIELD_ID)) : null;
    const lengthField =     table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.LENGTH_FIELD_ID)) : null;
    const areaField =       table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.AREA_FIELD_ID)) : null;
    const volumeField =     table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.VOLUME_FIELD_ID)) : null;
    const quantityField =   table ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.QUANTITY_FIELD_ID)) : null;

    return {
        clientId,
        clientSecret,
        imgurId,

        table, 
        idField,
        sourceField,
        imageField,
        filenameField,
        partnameField,
        typeField,
        widthField,
        heightField,
        lengthField,
        areaField,
        volumeField,
        quantityField
    };
}


const findDuplicatesFields = (arr) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
        if (sorted_arr[i] != null) {
            if (results.indexOf(sorted_arr[i].name) == -1) {
                results.push(sorted_arr[i].name);
            }
        }
    }
  }

  return results;
}


function getSettingsValidationResult(settings) {
    let isValid = true;
    let message = null;

    if (!settings.clientId) {
        isValid = false;
        message = 'Please enter your SmartPart API client ID';
    } 
    else if (!settings.clientSecret) {
        isValid = false;
        message = 'Please enter your SmartPart API client secret';
    }
    else if (!settings.table) {
        isValid = false;
        message = 'Please select the table you would like to use';
    }
    else if (!settings.idField) {
        isValid = false;
        message = "Please select a field for storing the part ID's";
    }
    else if (!settings.sourceField) {
        isValid = false;
        message = "Please select a field for storing the file ID's";
    }
    else if (!settings.typeField) {
        isValid = false;
        message = "Please select a field for storing the part type";
    }
    else if (settings.imageField) {
        if (!settings.imgurId) {
            isValid = false;
            message = "Please fill in your Imgur API client ID (needed for uploading images to airtable)";
        }
    }

    var fields = [
        settings.idField,
        settings.sourceField,
        settings.imageField,
        settings.filenameField,
        settings.partnameField,
        settings.typeField,
        settings.widthField,
        settings.heightField,
        settings.lengthField,
        settings.areaField,
        settings.volumeField,
        settings.quantityField
    ]

    const duplicates = findDuplicatesFields(fields);
    if (duplicates.length > 0) {
        console.log(duplicates)

        isValid = false;
        message = 'The field "' + duplicates[0] + '" is used multiple times';
    }

    return {
        isValid,
        message,
        settings,
    };
}


export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const settings = getSettings(globalConfig, base);
    return getSettingsValidationResult(settings);
}
