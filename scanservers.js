/** @param {NS} ns **/
export async function main(ns) {

    // Setup a template for Servers information to be stored
    function Servers(
        name,
        connection,
        rootAccess,
        requiredHackingLevel,
        numPortsRequired,
        maxRam,
        rootjsinstalled) {
        this.name = name;
        this.connection = connection;
        this.rootAccess = rootAccess;
        this.requiredHackingLevel = requiredHackingLevel;
        this.numPortsRequired = numPortsRequired;
        this.maxRam = maxRam;
        this.rootjsinstalled = rootjsinstalled;
    }

    function addtoServers(servername) {
        let currentServerNamesList = serverarray.map(s => s.name);
        let isItANewServer = true;
        for (let i = 0; i < currentServerNamesList.length; i++) {
            //ns.tprint("DEBUG=> currentServerNamesList[" + i + "] = " +currentServerNamesList[i]  );
            if (currentServerNamesList[i] == servername) { isItANewServer = false }
        }
        //if the server does not exsist add it
        if (isItANewServer) {
            //ns.tprint("DEBUG=> I think that server " + servername + " does not exsist.");
            //unless if the server name starts with pserv, don't add those!
            if (servername.startsWith("pserv")) {
                //do nothing. 
            }
            else {
                //ns.tprint("Adding new server: " + servername);
                serverarray.push(new Servers(
                    servername,  // name of server. duh. 
                    'notusedyet',      // one step prior connection
                    ns.hasRootAccess(servername),        // rootAccess
                    ns.getServerRequiredHackingLevel(servername),           // requiredHackingLevel
                    ns.getServerNumPortsRequired(servername),           // numPortsRequired
                    ns.getServerMaxRam(servername),            // maxRam
                    ns.fileExists("hack.js", servername)
                ))

            }
        }
        else {
            //server not added because it already exsists or it is a pserv
        }
    }

    function scanAndAddNewServers(value) {
        let currentServers = {};
        //ns.tprint("DEBUG: scanning: " + value);
        // make sure that a server name has been passed to the function to scan
        if (value !== "home") {
            // ns.tprint("server specified as:" + value);
            currentServers = ns.scan(value);
        }
        // if no server was specified then scan home
        else {
            // ns.tprint("server name is home")
            currentServers = ns.scan();
        }

        currentServers.forEach(
            servername => addtoServers(servername)
        );
    }

    function updateServerList() {
        // this will scan the current list of servers 
        let newServerFound = true;
        let firstServerCount = 0;
        let secondServerCount = 0;
        while (newServerFound) {
            let currentServerNamesList = serverarray.map(s => s.name);
            firstServerCount = currentServerNamesList.length;
            //ns.tprint("DEBUG firstserverCount=" + firstServerCount);
            currentServerNamesList.forEach(name => scanAndAddNewServers(name));
            currentServerNamesList = serverarray.map(s => s.name);
            secondServerCount = currentServerNamesList.length;
            //ns.tprint("DEBUG firstserverCount=" + secondServerCount);
            if (secondServerCount == firstServerCount) {
                newServerFound = false
            }
        }
    }


    function getRoot(hostName) {
        if (serverarray.find(server => server.name === hostName).rootAccess == false) {
            ns.tprint("need root access on " + hostName + "  trying to get it.");
            // Open up ports if needed
            if (ns.getServerNumPortsRequired(hostName) > 0) {
                if (ns.fileExists("BruteSSH.exe")) {
                    //ns.tprint("brutesssh(" + hostName + ")");
                    ns.brutessh(hostName);
                }
                else { ns.tprint("BruteSSH.exe does not exist.") }
            }
            if (ns.getServerNumPortsRequired(hostName) > 1) {
                // ns.tprint("ftpcrack(" + hostName + ")");
                if (ns.fileExists("FTPCrack.exe")) {
                    //ns.ftpcrack(hostName);
                }
                else { tprint("FTPcrack.exe does not exist.") }
            }
            if (ns.getServerNumPortsRequired(hostName) > 2) {
                //ns.tprint("relaysmtp(" + hostName + ")");
                if (ns.fileExists("relaySMTP.exe")) {
                    //ns.relaysmtp(hostName);
                }
                else { ns.tprint("relaysmtp.exe does not exist.") }
            }
            if (ns.getServerNumPortsRequired(hostName) > 3) {
                //ns.tprint("httpworm(" + hostName + ")");
                if (ns.fileExists("HTTPWorm.exe")) {
                    //ns.httpworm(hostName);
                }
                else { ns.tprint("HTTPWorm.exe does not exist.") }
            }
        }
        else {
            // server already has root access
        }

    }

    async function installHackjs(hostName) {
        if (serverarray.find(server => server.name === hostName).rootjsinstalled == false) {
            ns.tprint("Installing hack.js on " + hostName);
            // Open up ports if needed
            await ns.scp("hack.js", hostName);
        }
    }

    let serverarray = []  // This will store all our data using the schema defined above. 
    // initial scan of root to get base level servers
    scanAndAddNewServers("home");
    // update the server list by scanning everything known until there are no new knowns:

    // main loop to run everything 
    let keepGoing = true;

    while (keepGoing) {

        updateServerList();         // scan everything and add any new servers. 

        let nameList = serverarray.map(s => s.name); // create a list of hostnames

       // nameList.forEach(hostName => getRoot(hostName));  //get root on anything that needs rooting
        for (const hostName of nameList) {
            await getRoot(hostName);
        }

        //nameList.forEach(hostName => await installHackjs(hostName)); 
        
        // install hack.js on any server that needs it.
        for (const hostName of nameList) {
            await installHackjs(hostName);
        }

        await ns.sleep(5000)       // Delay between loops

        keepGoing = false;          // uncomment to run only once. 

    }

    ns.tprint("Script ending.");

    // ##### DEBUG Uncomment below to print all known server names
    //ns.tprint(serverarray.map(s => s.name));

    // ##### DEBUG Uncomment below to print all data in the array
    updateServerList();         // scan everything and add any new servers. 

    serverarray.forEach(value => ns.tprint(value));

    //serverarray.forEach(value => ns.tprint(value.name + " root status is: " + value.rootAccess));
    // serverarray.forEach(value => ns.tprint(value));



    //ns.tprint("DEBUG:=> serverarray.length=" + serverarray.length);
    // for debug print all data uncomment below:
    // serverarray.forEach(value => ns.tprint(value.name));

    // example of how to pull data from the array: 
    //ns.tprint(
    //    "DEBUG: " +
    //    serverarray.find(server => server.name === "n00dles").maxRam
    //);

    //ns.tprint(ns.getServerMaxRam("n00dles"));

    // but this does not work :( Why? 
    //ns.tprint(serverarray.n00dles.rootAccess);

    //cannot read properties of undefined (reading 'rootAccess')

}
