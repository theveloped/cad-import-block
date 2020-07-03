import React, {Fragment, useState, useCallback, useEffect, createRef} from 'react';
import axios from 'axios';
import {JSONPath} from 'jsonpath-plus';
import {cursor} from '@airtable/blocks';
import {FieldType} from '@airtable/blocks/models';
import {
    initializeBlock,
    registerRecordActionDataCallback,
    useBase,
    useRecordById,
    useLoadable,
    useSettingsButton,
    useWatchable,
    Box,
    Button,
    Text,
    RecordCard,
    Loader,
} from '@airtable/blocks/ui';

import './styles';
import {useSettings} from './settings';
import SettingsComponent from './SettingsComponent';
import UploadComponent from './UploadComponent';


function SmartPart() {

    // Settings and state
    const {
          isValid,
          message,
          settings: {
            clientId, 
            clientSecret,

            imgurId, 
            imgurSecret,

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
        },
    } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);


    // Processing states
    const headers = {}; // TODO: add OAuth token flow as an axios interceptors on 401 responses
    const [loading, setLoading] = useState(null);


    // Parse attachements in a record for processing
    const postAttachements  = function() {
        for (var i = 0; i < activeAttachments.length; i++) {
            const attachment = activeAttachments[i];

            // Retrieve attachment as blob from airtable
            axios.get(attachment.url, {responseType: 'blob'})
            .then(res => {

                // Process file using smartpart API
                postFile(res.data, attachment.filename);
            })
        }
    }


    // Upload .stp/.step file to the API
    const postFile = function(data, filename) {
        setLoading(true)
        console.log("[+] uploading file: " + filename);

        // Parameters for retrieving an API OAuth2 token
        const auth_params = new URLSearchParams();
        auth_params.append('grant_type', 'client_credentials');
        auth_params.append('client_id', clientId);
        auth_params.append('client_secret', clientSecret);

        // Form data with file for uploading
        const file_params = new FormData() 
        file_params.append('file', data, filename)

        // Retrieve a new access token from the API
        axios.post("https://api.smartpart.com/auth/oauth2/token", auth_params)
        .then(res => {
          headers["Authorization"] = res.data.token_type + " " + res.data.access_token;
          return res
        })

        // Upload the file to te API
        .then(res => axios.post("https://api.smartpart.com/v1/files", file_params, {"headers": headers}))

        // Analyze the file on the API
        .then(res => axios.post("https://api.smartpart.com/v1/parts", {"source": res.data.id}, {"headers": headers}))
        .then(res => {
          parsePart(res.data);
          return res
        })

        // On error
        .catch(error => {
            setLoading(false)
            console.log(error)
        })

    }


    // Analyse all sub-parts in an assembly
    const postAssembly = function() {
        setLoading(true)
        console.log("[+] analyzing assembly: " + activeAssembly.id);
        console.log(activeAssembly);

        const id = activeRecord.getCellValue(idField)
        const type = activeRecord.getCellValue(typeField)
        const source = activeRecord.getCellValue(sourceField)

        var assemblyPart = null;

        if (id && type == "ASSEMBLY" && source) {

            // Parameters for retrieving an API OAuth2 token
            const auth_params = new URLSearchParams();
            auth_params.append('grant_type', 'client_credentials');
            auth_params.append('client_id', clientId);
            auth_params.append('client_secret', clientSecret);

            // Retrieve a new access token from the API
            axios.post("https://api.smartpart.com/auth/oauth2/token", auth_params)
            .then(res => {
              headers["Authorization"] = res.data.token_type + " " + res.data.access_token;
              return res
            })

            // Retrieve original part
            .then(res => axios.get("https://api.smartpart.com/v1/parts/" + id, {"headers": headers}))
            .then(res => {
              assemblyPart = res.data;
            })

            // Retrieve all sub-parts
            .then(res => axios.post("https://api.smartpart.com/v1/parts/" + id + "/parts", {"source": source}, {"headers": headers}))

            // Process sub-parts
            .then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    var subpart = res.data[i];
                    const results = JSONPath({path: '$.tree..[?(@.index == ' + subpart.parent.index + ')]].count', json: assemblyPart});
                    const quantity = (results.length > 0) ? results[0] : 1;
                    parsePart(subpart, quantity);
                }
            })

            // On error
            .catch(error => {
                setLoading(false)
                console.log(error)
            })
        }
    }


    // Parse the API results into a airtable record
    const parsePart = function(part, quantity) {
        console.log("[+] parsing part: " + part.id);

        const recordFields = {}
        if (idField) { recordFields[idField.name] = part.id ? part.id : null; }
        if (sourceField) { recordFields[sourceField.name] = part.source ? part.source : null; }
        if (filenameField) { recordFields[filenameField.name] = part.filename ? part.filename : null; }
        if (partnameField) { recordFields[partnameField.name] = part.name ? part.name : null; }
        if (typeField) { recordFields[typeField.name] = part.type ? part.type : null; }
        if (widthField) { recordFields[widthField.name] = part.width ? part.width : null; }
        if (heightField) { recordFields[heightField.name] = part.height ? part.height : null; }
        if (lengthField) { recordFields[lengthField.name] = part.length ? part.length : null; }
        if (areaField) { recordFields[areaField.name] = part.area ? part.area : null; }
        if (volumeField) { recordFields[volumeField.name] = part.volume ? part.volume : null; }
        if (quantityField) { recordFields[quantityField.name] = quantity ? quantity : 1; }

        // Stop of user doesn't have permissions
        if (!table.hasPermissionToCreateRecord(recordFields)) {
            return 
        }

        // Retrieve image if required
        if (imageField) {
            axios.get("https://api.smartpart.com/v1/parts/" + part.id + "/images?type=JPEG", {responseType: "arraybuffer", "headers": headers})

            // Store image on imgur temporarily
            .then(res => {
                const image_base64 = Buffer.from(res.data, 'binary').toString('base64');
                const imgur_headers = {"Authorization": "Client-ID " + imgurId};
                return axios.post("https://api.imgur.com/3/image", {"image": image_base64}, {"headers": imgur_headers})
            })

            // Store image as attachment
            .then(res => {
                const attachment = {"url": res.data.data.link, "filename": part.id + ".jpeg"};
                recordFields[imageField.name] = res.data.data.link ? [attachment] : [];
                table.createRecordAsync(recordFields);
                setLoading(false)
            })

          // On error
            .catch(error => {
                setLoading(false)
                console.log(error)
            })

        }

        // Store record without images
        else {
            table.createRecordAsync(recordFields);
            setLoading(false)
        }

    };


    // General table interactions
    useSettingsButton(() => setIsSettingsOpen(!isSettingsOpen));

    // Caches the currently selected record and field in state. If the user
    // selects a record and a preview appears, and then the user de-selects the
    // record (but does not select another), the preview will remain. This is
    // useful when, for example, the user resizes the blocks pane.
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // cursor.selectedRecordIds and selectedFieldIds aren't loaded by default,
    // so we need to load them explicitly with the useLoadable hook. The rest of
    // the code in the component will not run until they are loaded.
    useLoadable(cursor);

    // Update the selectedRecordId and selectedFieldId state when the selected
    // record or field change.
    useWatchable(cursor, ['selectedRecordIds'], () => {
        // If the update was triggered by a record being de-selected,
        // the current selectedRecordId will be retained.  This is
        // what enables the caching described above.
        if (cursor.selectedRecordIds.length > 0) {
            // There might be multiple selected records. We'll use the first
            // one.
            setSelectedRecordId(cursor.selectedRecordIds[0]);
        }
    });

    // Register a callback to be called whenever a record action occurs (via button field)
    // useCallback is used to memoize the callback, to avoid having to register/unregister
    // it unnecessarily.
    const onRecordAction = useCallback(
        data => {
            // Ignore the event if settings are already open.
            // This means we can assume settings are valid (since we force settings to be open if
            // they are invalid).
            if (!isSettingsOpen) {
                setSelectedRecordId(data.recordId);
            }
        },
        [isSettingsOpen, table],
    );
    useEffect(() => {
        // Return the unsubscribe function to ensure we clean up the handler.
        return registerRecordActionDataCallback(onRecordAction);
    }, [onRecordAction]);

    // This watch deletes the cached selectedRecordId and selectedFieldId when
    // the user moves to a new table or view. This prevents the following
    // scenario: User selects a record that contains a preview url. The preview appears.
    // User switches to a different table. The preview disappears. The user
    // switches back to the original table. Weirdly, the previously viewed preview
    // reappears, even though no record is selected.
    useWatchable(cursor, ['activeTableId', 'activeViewId'], () => {
        setSelectedRecordId(null);
        setSelectedRecord(null);
    });

    useEffect(() => {
        // Display the settings form if the settings aren't valid.
        if (!isValid && !isSettingsOpen) {
            setIsSettingsOpen(true);
        }
    }, [isValid, isSettingsOpen]);


    // Retrieve the active record
    const base = useBase();
    const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
    const activeRecord = useRecordById(activeTable, selectedRecordId ? selectedRecordId : '');


    // Check if the current record is an smartpart assmebly
    var activeAssembly = null;
    if (activeRecord && typeField) {
        if (activeTable == table) {
            var type = activeRecord.getCellValue(typeField);

            if (type) {
                if (type == "ASSEMBLY") {
                    activeAssembly = activeRecord;
                    console.log(activeRecord.getCellValue(typeField))
                }
            }
        }
    }


    // Retrieve all the .stp and .step attachments of the current record
    var activeAttachments = [];
    if (activeRecord) {
        for (var i = 0; i < activeTable.fields.length; i++) {
            var field = activeTable.fields[i];

            if (field.type == FieldType.MULTIPLE_ATTACHMENTS) {
                var attachments = activeRecord.getCellValue(field);

                if (attachments) {
                    for (var j = 0; j < attachments.length; j++) {
                        const extension = attachments[j].filename.split('.').pop();

                        if (["stp", "step", "STP", "STEP"].indexOf(extension) >= 0) {
                            activeAttachments.push(attachments[j])
                            console.log(attachments[j].filename)
                        }
                    }
                }
            }
        }
    }


    // activeTable is briefly null when switching to a newly created table.
    if (!activeTable) {
        return null;
    }

    return (
        <Box    position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                display="flex"
                flexDirection="column">

            <Box flex="auto">
                { (isSettingsOpen) && <SettingsComponent setIsSettingsOpen={setIsSettingsOpen} /> }
                { (!isSettingsOpen && loading) && <Loader className="loader" scale={0.5} /> } 
                { (!isSettingsOpen && !loading && !activeRecord) && <UploadComponent onDropCallback={postFile} />}
                { (!isSettingsOpen && !loading && activeRecord) && <RecordCard className="viewer" record={activeRecord} /> }
            </Box>

            { (!isSettingsOpen && !loading && activeRecord) && (
                <Box display="flex" flex="none" padding={3}>
                    <Button
                        size="large"
                        variant="secondary"
                        onClick={() => {setSelectedRecordId(null); setSelectedRecord(null);}}>
                        Deselect
                    </Button>

                    <Box
                        flex="auto"
                        display="flex"
                        justifyContent="flex-end">
                    </Box>

                    { (activeAttachments.length > 0) && (
                        <Button
                            size="large"
                            variant="primary"
                            marginLeft={2}
                            onClick={() => postAttachements()}>
                            Process attachment(s)
                        </Button>
                    )}

                    { (activeAssembly) && (
                        <Button
                            size="large"
                            variant="primary"
                            marginLeft={2}
                            onClick={() => postAssembly()}>
                            Process assembly
                        </Button>
                    )}
                </Box>
            )}

        </Box>
    );
}

initializeBlock(() => <SmartPart />);