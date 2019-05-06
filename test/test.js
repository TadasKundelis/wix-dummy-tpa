const {expect} = require('chai').use(require('chai-as-promised'));
const shelljs = require('shelljs');
const {sleepOnServer, aDriverFor} = require('./connection-helpers');
const {join} = require('path');
const mysqlTestKit = require('@wix/wix-mysql-testkit');


describe('testing the database', function() {
    const schema = 'test/*.sql';
    const mysqlkit = mysqlTestKit({schema}).beforeAndAfter();

    describe('without schema', () => {
        it('fails to start', () => {
            expect(() => mysqlTestKit({}).start()).to.throw('Schema must be provided')
        })
    });

    describe('emitting configs', () => {
        beforeEach(() => {
            shelljs.rm('-rf', './target/configs');
        });

        it('should create mysql config at default target location', async () => {
            await mysqlkit.emitConfig();
            const config = loadConfigJson();
            expect(config.readwrite.host).to.be.equal(mysqlkit.host);
            expect(parseInt(config.readwrite.port)).to.be.equal(mysqlkit.port);
            expect(config.readwrite.username).to.be.equal(mysqlkit.opts.user);
            expect(config.readwrite['secret:password']).to.be.equal(mysqlkit.opts.password);
        });

        it('should create mysql config for read only user', async () => {
            await mysqlkit.emitConfig();

            const config = loadConfigJson();

            expect(config.readonly.host).to.be.equal(mysqlkit.host);
            expect(parseInt(config.readonly.port)).to.be.equal(mysqlkit.port);
            expect(config.readonly.username).to.be.equal(`${mysqlkit.opts.user}_readonly`);
            expect(config.readonly['secret:password']).to.be.equal(`${mysqlkit.opts.password}_readonly`);
        });

        it('should support overriding of port and host', async () => {
            const overrides = {
                host: 'bla',
                port: '666'
            };
            await mysqlkit.emitConfig({overrides});

            const config = loadConfigJson();

            expect(config.readwrite.host).to.be.equal('bla');
            expect(parseInt(config.readwrite.port)).to.be.equal(666);
        });

        it('should create mysql config at provided target location', async () => {
            const targetFolder = './target/configs/bla';
            await mysqlkit.emitConfig({targetFolder});

            const config = loadConfigJson(targetFolder);

            expect(config.readwrite.host).to.be.equal(mysqlkit.host);
            expect(parseInt(config.readwrite.port)).to.be.equal(mysqlkit.port);
            expect(config.readwrite.username).to.be.equal(mysqlkit.opts.user);
            expect(config.readwrite['secret:password']).to.be.equal(mysqlkit.opts.password);
        });

        it('should not remove any existing config files under target folder', async () => {
            const targetFolder = './target/configs/bla';
            shelljs.mkdir('-p', targetFolder);
            shelljs.echo('another config').to(`${targetFolder}/another-config.json`);

            await mysqlkit.emitConfig({targetFolder});

            expect(shelljs.cat(`${targetFolder}/another-config.json`).toString()).to.be.string('another config\n');
        });
    });

    describe('testkit accessor validation', () => {

        it('fails when trying to retrieve properties that are defined only after startup', () => {
            const mysqlkit = mysqlTestKit({schema});

            expect(() => mysqlkit.connectionSettings).to.throw();
            expect(() => mysqlkit.connectionString).to.throw();
            expect(() => mysqlkit.host).to.throw();
            expect(() => mysqlkit.port).to.throw();
        });
    });

    describe('testkit', () => {
        it('returns a healthy connection', async () => {
            const [{solution}] = await aDriverFor(mysqlkit).readWrite().query('SELECT 1 + 1 AS solution');
            expect(solution).to.be.equal(2);
        });
        it('returns a port when connection is initialized', () => {
            expect(mysqlkit.port).to.be.a('number');
        });

        it('returns a host when connection is initialized', () => {
            expect(mysqlkit.host).to.be.a('string');
        });

        it('returns connection settings when connection is initialized', () => {
            expect(mysqlkit.connectionSettings).to.deep.equal({
                host: mysqlkit.host,
                port: mysqlkit.port,
                database: 'db',
                user: 'aUser',
                password: 'sa'
            });
        });

        it('resets a database \'on-the-fly\'', async () => {
            const driver = aDriverFor(mysqlkit);
            await driver.readWrite().query('DELETE FROM components');
            expect(await driver.readOnly().query('SELECT * FROM components')).to.have.lengthOf(0);

            await mysqlkit.reloadSchema();

            const components = await driver.readOnly().query('SELECT * FROM components');
            expect(components).to.have.lengthOf(13);
        });
    });
});

describe('schema loading', () => {

    describe('from single glob expression', () => {

        const mysqlkit = mysqlTestKit({schema: 'test/*.sql'}).beforeAndAfter();

        it('loaded as expected', async () => {
            // comes from schema1.sql
            const [{Tables_in_db: tables}] = await aDriverFor(mysqlkit)
                .readWrite()
                .query('SHOW TABLES');

            // comes from schema2.sql
            const data = await aDriverFor(mysqlkit)
                .readWrite()
                .query('SELECT * FROM components');

            expect(data).not.to.be.empty;
            expect(tables).to.include('components');
        });
    });
});

function loadConfigJson(fromDir = './target/configs') {
    return JSON.parse(shelljs.cat(join(fromDir, 'wix-bootstrap-mysql.json')));
}
