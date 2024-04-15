/* Helpers to transform sharing properties of a model
` Before 2.41, sharing properties were on the root of the model
 
 "dataElement": {
    publicAccess: 'rwrw----',
    externalAccess: false,
    userGroupAccesses: [],
    userAccesses: [],
    ...otherProperties
}

After 2.41 these are grouped in a sharing object:

"sharing": {
    "owner": "GOLswS44mh8",
    "external": false,
    "users": {},
    "userGroups": {
        "Rg8wusV7QYi": {
        "displayName": "HIV Program Coordinators",
        "access": "r-------",
        "id": "Rg8wusV7QYi"
        },
        "qMjBflJMOfB": {
        "displayName": "Family Planning Program",
        "access": "rw------",
        "id": "qMjBflJMOfB"
        }
    },
    "public": "rw------"
},
 */

/* Converts sharing object to legacy structure 
    Some places in the app still need the legacy structure,
    eg. the sharing-dialog expects props as arrays instead of objects */
export const transformSharingObjectToLegacy = sharing => {
    if (!sharing) {
        return {
            publicAccess: '--------',
            externalAccess: false,
            userGroupAccesses: [],
            userAccesses: [],
        };
    }

    const { public: publicAccess, users, userGroups, external } = sharing;

    return {
        publicAccess,
        externalAccess: Boolean(external),
        userGroupAccesses: userGroups
            ? Object.values(userGroups).map(userGroupSharing => ({
                  id: userGroupSharing.id,
                  access: userGroupSharing.access,
                  displayName: userGroupSharing.displayName,
                  userGroupUid: userGroupSharing.id,
              }))
            : [],
        userAccesses: users
            ? Object.values(users).map(userSharing => ({
                id: userSharing.id,
                access: userSharing.access,
                displayName: userSharing.displayName,
                userUid: userSharing.id,
              }))
            : [],
    };
};

/* Converts legacy sharing structure to sharing object
note that this will not include owner property */
export const transformLegacySharingToSharingObject = modelWithSharing => {
    if(!modelWithSharing) {
        return {
            public: '--------',
            external: false,
            userGroups: {},
            users: {},
        };
    }
    const {
        publicAccess,
        externalAccess,
        userGroupAccesses,
        userAccesses,
    } = modelWithSharing;

    return {
        public: publicAccess,
        external: Boolean(externalAccess),
        userGroups: transformLegacySharingArrayToObject(userGroupAccesses),
        users: transformLegacySharingArrayToObject(userAccesses),
    };
};

const transformLegacySharingArrayToObject = sharingArray => {
    return sharingArray.reduce((acc, sharing) => {
        acc[sharing.id] = {
            displayName: sharing.displayName,
            access: sharing.access,
            id: sharing.id,
        };
        return acc;
    }, {});
};
