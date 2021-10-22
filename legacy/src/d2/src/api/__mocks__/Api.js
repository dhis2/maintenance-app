let apiMock;

function mockInit() {
    apiMock = {
        get: jest.fn(),
        post: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        request: jest.fn(),
        setDefaultHeaders: jest.fn(),
    };
}

function values(object) {
    return Object
        .keys(object)
        .map(key => object[key]);
}

function mockClear() {
    values(apiMock)
        .filter(property => typeof property === 'function')
        .forEach(spyFn => spyFn.mockClear());
}

export default function Api() {
    return apiMock;
}
Api.getApi = jest.fn(() => new Api());
Api.mockReset = mockInit;
Api.mockClear = mockClear;

mockInit();
