const global = window;

beforeEach(function beforeEachSetup() {
    this.sandbox = global.sinon.sandbox.create();
    global.stub = this.sandbox.stub.bind(this.sandbox);
    global.spy = this.sandbox.spy.bind(this.sandbox);
});

afterEach(function afterEachSetup() {
    delete global.stub;
    delete global.spy;
    this.sandbox.restore();
});
