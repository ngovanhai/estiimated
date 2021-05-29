export default (...modules) => Promise.all(
    // flatten arguments to enable both
    // imports([m1, m2]) or imports(m1, m2)
    modules.concat.apply([], modules)
    // asynchronously await each module
    // and return its default
    .map(async m => (await m).default)
);