/*
 * Test suite for auth
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');
const { JUnitXmlReporter } = require('jasmine-reporters');

// Setup the reporter
jasmine.getEnv().addReporter(new JUnitXmlReporter({
    savePath: './test-results', // Directory to save the reports
    consolidateAll: true // Consolidate each suite's report into one file
}));

//const url = path => `http://localhost:3000${path}`;
const url = path => `https://ricebookserver-nicole-hw6-a97baa0528bf.herokuapp.com${path}`;

describe('Validate Registration and Login functionality', () => {
    let cookie;
    let username = 'testUser'+Date.now();
    it('/register new user', (done) => {
        let regUser = {username: username, password: "123",email:"rice@rice.edu",dob:"123456",phone:"1231231234",zipcode:"12345"};
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('/login user', (done) => {
        let loginUser = {username: username, password: "123"};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json()
        }).then(res => {
            expect(res.username).toEqual(username);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('/logout user', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            expect(res.status).toEqual(200);
            done();
        });
    });
});
