/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');
const { JUnitXmlReporter } = require('jasmine-reporters');

// Setup the reporter
jasmine.getEnv().addReporter(new JUnitXmlReporter({
    savePath: './test-results', // Directory to save the reports
    consolidateAll: true // Consolidate each suite's report into one file
}));

const url = path => `http://localhost:3000${path}`;
let cookie;

describe('Validate Profile functionality', () => {
    let cookie;
    let username = 'testUser'+Date.now();

    beforeAll((done) => {
        // Register a new user
        let regUser = { username: username, password: '123', email: 'rice@rice.edu', dob: '123456', phone: '1231231234', zipcode: '12345' };
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            let loginUser = { username: username, password: '123' };
            fetch(url('/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginUser)
            }).then(res => {
                cookie = res.headers.get('set-cookie');
                return res.json();
            }).then(res => {
                done();
            });
        });
    });

    it('GET /headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.headline).toBeDefined();
            done();
        });
    });

    it('PUT /headline and verify the change', (done) => {
        let updatedHeadline = { headline: 'Updated Headline' };
        fetch(url('/headline'), {
            method: 'PUT',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedHeadline)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(username);
            expect(res.headline).toEqual('Updated Headline');
            done();
        });
    });

    afterAll((done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            done();
        });
    });
});
