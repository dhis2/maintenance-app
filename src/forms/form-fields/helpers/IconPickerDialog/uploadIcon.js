import { getInstance as getD2 } from 'd2/lib/d2';
/**
 * Uploads a customIcon.
 * This will first upload the File as a FileResource, then
 * use that fileResource to create an Icon with that FileResource.
 * @param {File} iconFile a File object
 * @param {{ key: string, description: string, keywords: string[] }} iconMetadata
 * @returns {Promise}
 */
export async function uploadIcon(iconFile, { key, description, keywords }) {
    const formData = new FormData();
    formData.append('file', iconFile);
    formData.append('domain', 'ICON');
    const d2 = await getD2();
    const d2Api = d2.Api.getApi();

    const fileResourceResponse = await d2Api.post('/fileResources', formData);

    if (!fileResourceResponse.response) {
        throw new Error('Failed to upload fileResource', fileResourceResponse);
    }
    const iconData = {
        fileResourceId: fileResourceResponse.response.fileResource.id,
        key,
        description,
        keywords,
    };
    return d2Api.post('/icons', iconData);
}
