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

describe('Validate Article functionality', () => {
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

    it('GET /articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(res => {
            expect(res.articles).toBeDefined();
            expect(Array.isArray(res.articles)).toBe(true);

            res.articles.forEach(article => {
                expect(article).toHaveProperty('author', username);
            });

            done();
        });
    });

    it('GET /articles/id', (done) => {
        const articleId = 5;
        fetch(url(`/articles/${articleId}`), {
            method: 'GET',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(res => {
            expect(res.articles).toBeDefined();
            expect(Array.isArray(res.articles)).toBe(true);

            const Article = res.articles[0];
            expect(Article.pid).toEqual(articleId);

            done();
        });
    });

    it('POST /article and verify that the article was added', (done) => {
        let newArticle = { text: "Test Article" };
        fetch(url('/article'), {
            method: 'POST',
            headers: {
                'Cookie': cookie,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArticle)
        }).then(res => res.json()).then(res => {
            expect(res.articles).toBeDefined();
            expect(Array.isArray(res.articles)).toBe(true);

            // The new article is added at the end of the array
            const addedArticle = res.articles[res.articles.length - 1];

            // Verify properties of the added article
            expect(addedArticle.author).toEqual(username);
            expect(addedArticle.text).toEqual('Test Article');
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
