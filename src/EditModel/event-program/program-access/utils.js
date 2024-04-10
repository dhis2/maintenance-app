import { isEqual } from 'lodash/fp';

export const areSharingPropertiesSimilar = (modelA, modelB) => {
    const sharingA = modelA.sharing;
    const sharingB = modelB.sharing;
    if (sharingA.public !== sharingB.public) return false;
    if (!!sharingA.externalAccess !== !!sharingB.externalAccess) return false;

    const compareFunction = (a, b) => a.id < b.id;
    if (
        !isEqual(
            Array.sort(sharingA.users || [], compareFunction),
            Array.sort(sharingB.users || [], compareFunction),
        )
    ) {
        return false;
    }

    return isEqual(
        Array.sort(sharingA.userGroups || [], compareFunction),
        Array.sort(sharingB.userGroups || [], compareFunction),
    )
};

export const extractDisplayName = model => model.dataValues.displayName;

const getPublicAccessDescription = publicAccessString => {
    if (publicAccessString.substr(0, 4) === '----') return 'No public access';
    if (publicAccessString.substr(0, 4) === 'rwrw') return 'Complete public access';

    let description = '';
    switch (publicAccessString.substr(0, 2)) {
        case 'rw':
            description += 'Public metadata read- and write access';
            break;
        case 'r-':
            description += 'Public metadata read access';
            break;
        default:
            description += 'No public metadata access';
            break;
    }

    description = description += ', ';

    switch (publicAccessString.substr(2, 2)) {
        case 'rw':
            return description + 'public data read- and write access';
        case 'r-':
            return description + 'public data read access';
        default:
            return description + 'no public data access';
    }
};

export const generateSharingDescription = ({ sharing }) => {
    const { public: publicAccess, users, userGroups } = sharing;
    const publicAccessDescription = getPublicAccessDescription(publicAccess);
    const userGroupCount = userGroups ? Object.keys(userGroups).length : 0;
    const userCount = users ? Object.keys(users).length : 0;

    let description = publicAccessDescription;
    if (userCount || userGroupCount) {
        description += ', accessible to ';
        if (userCount) {
            const plural = userCount > 1 ? 's' : '';
            description += `${userCount} user${plural}`;
        }

        if (userGroupCount) {
            if (userCount) description += ' and ';

            const plural = userGroupCount > 1 ? 's' : '';
            description += `${userGroupCount} user group${plural}`;
        }
    }

    return description;
};
