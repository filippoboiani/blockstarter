function Config() {
    this.client = "testrpc"; // geth
    this.clientUrl = "http://localhost:8545";
    this.projectsFile = "../resources/projects.json";
    this.defaultTokenName = "Shares";
    this.script = `../resources/${this.client}.sh`; // geth.sh   
    this.account = "";
    this.pwd = "";
    this.localAppPort = 8080;
    this.publicAppPort = process.env.PUBLIC_APP_PORT || this.localAppPort;
    this.mongoHost = process.env.MONGO_HOST || "localhost";
    this.mongoPort = process.env.MONGO_PORT || 27017;
    this.dbName = "dev";
    this.mongoUrl = `mongodb://${this.mongoHost}:${this.mongoPort}/${this.dbName}`;
}

module.exports = new Config();