import PropTypes from 'prop-types';
import React from 'react';
import {
    useGlobalConfig,
    Box,
    Button,
    FieldPickerSynced,
    FormField,
    Input,
    Heading,
    TablePickerSynced,
    Text,
} from '@airtable/blocks/ui';

import {FieldType} from '@airtable/blocks/models';
import {useSettings, ConfigKeys} from './settings';

function SettingsForm({setIsSettingsOpen}) {
    const globalConfig = useGlobalConfig();

    const {
        isValid,
        message,
        settings: {
            clientId, 
            clientSecret,
            imgurId, 
            table
        },
    } = useSettings();

    return (
        <Box
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            display="flex"
            flexDirection="column"
        >
            <Box flex="auto" padding={4} paddingBottom={2}>
                <Heading marginBottom={1}>SmartPart settings</Heading>
                <Text paddingY={1} marginBottom={3} textColor="light">
                    API credentials used to access the SmartPart API that allows the processing of 3D 
                    CAD models. To get your credentials please contact tobias@smartpart.com. 
                </Text>

                <FormField label="Client ID*">
                    <Input value={clientId} onChange={e => globalConfig.setAsync(ConfigKeys.API_CLIENT_ID, e.target.value)} />
                    <Text paddingY={1} textColor="light">
                        e.g. 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    </Text>
                </FormField>

                <FormField label="Client secret*">
                    <Input value={clientSecret} onChange={e => globalConfig.setAsync(ConfigKeys.API_CLIENT_SECRET, e.target.value)} />
                    <Text paddingY={1} textColor="light">
                        e.g. 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    </Text>
                </FormField>


                <Heading marginTop={4} marginBottom={1}>Imgur settings</Heading>
                <Text paddingY={1} marginBottom={3} textColor="light">
                    Imgur API credentials used to temporarily store images for Airtable to download. 
                </Text>

                <FormField label="Client ID*">
                    <Input value={imgurId} onChange={e => globalConfig.setAsync(ConfigKeys.IMGUR_CLIENT_ID, e.target.value)} />
                    <Text paddingY={1} textColor="light">
                        e.g. 'xxxxxxxxxxxxxxx'
                    </Text>
                </FormField>

                <Heading marginTop={4} marginBottom={1}>Table settings</Heading>
                <Text paddingY={1} marginBottom={3} textColor="light">
                    Airtable settings specifying the outplut location and the various import options. Please select the
                    table you would like to store the data and select the various field names you would like to display.
                </Text>

                <FormField label="Table*">
                    <TablePickerSynced globalConfigKey={ConfigKeys.TABLE_ID} />
                </FormField>

                <FormField label="ID field*">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.ID_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={false}
                    />
                </FormField>

                <FormField label="Source field*">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.SOURCE_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={false}
                    />
                </FormField>

                <FormField label="Image field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.IMAGE_FIELD_ID}
                        allowedTypes={[FieldType.MULTIPLE_ATTACHMENTS]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Filename field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.FILENAME_FIELD_ID}
                        allowedTypes={[FieldType.SINGLE_LINE_TEXT]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Partname field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.PARTNAME_FIELD_ID}
                        allowedTypes={[FieldType.SINGLE_LINE_TEXT]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Type field*">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.TYPE_FIELD_ID}
                        allowedTypes={[FieldType.SINGLE_LINE_TEXT, FieldType.SINGLE_SELECT]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Width field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.WIDTH_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Height field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.HEIGHT_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Length field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.LENGTH_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Area field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.AREA_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Volume field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.VOLUME_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>

                <FormField label="Quantity field">
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey={ConfigKeys.QUANTITY_FIELD_ID}
                        allowedTypes={[FieldType.NUMBER]}
                        shouldAllowPickingNone={true}
                    />
                </FormField>
            </Box>

            <Box display="flex" flex="none" padding={3} borderTop="thick">
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    paddingRight={2}
                >
                    <Text textColor="light">{message}</Text>
                </Box>
                <Button
                    disabled={!isValid}
                    size="large"
                    variant="primary"
                    onClick={() => setIsSettingsOpen(false)}
                >
                    Done
                </Button>
            </Box>
        </Box>
    );
}

SettingsForm.propTypes = {
    setIsSettingsOpen: PropTypes.func.isRequired,
};

export default SettingsForm;
