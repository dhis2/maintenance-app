export default function addContext(Component, contextTypes) {
    Component.contextTypes = Component.contextTypes || {};
    Object.assign(Component.contextTypes, contextTypes);

    return Component;
}
