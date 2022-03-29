/** @param {NS} ns **/
export async function main(ns) {

    // Setup a template for Servers information to be stored
    function Servers(
        name,
        connection,
        rootAccess,
        requiredHackingLevel,
        numPortsRequired,
        maxRam) {
        this.name = name;
        this.connection = connection;
        this.rootAccess = rootAccess;
        this.requiredHackingLevel = requiredHackingLevel;
        this.numPortsRequired = numPortsRequired;
        this.maxRam = maxRam;
    }

    function addtoServers(servername) {
        //if the server does not exsist add it
        if (serverarray.find(server => server.name === servername) !== null) {
            //unless if the server name starts with pserv, don't add those!
            if (servername.substring(0, 5) !== "pserv") {
                serverarray.push(new Servers(
                    servername,  // name of server. duh. 
                    'notusedyet',      // one step prior connection
                    ns.hasRootAccess(servername),        // rootAccess
                    ns.getServerRequiredHackingLevel(servername),           // requiredHackingLevel
                    ns.getServerNumPortsRequired(servername),           // numPortsRequired
                    ns.getServerMaxRam(servername)            // maxRam
                ))
            }
        }
        else {
            //server not added because it already exsists or it is a pserv
        }
    }

    let serverarray = []
    // initial scan of root to get base level servers
    try {
        let currentServers = ns.scan("home");
        currentServers.forEach(
            servername => addtoServers(servername)
        );
    }
    catch (error) {
        ns.tprint("ERROR! " + error);
    }






    // for debug print all data uncomment below:
    // serverarray.forEach(value => ns.tprint(value));

    // example of how to pull data from the array: 
    ns.tprint(
        "DEBUG: " +
        serverarray.find(server => server.name === "n00dles").maxRam
    );

    ns.tprint(ns.getServerMaxRam("n00dles"));

    // but this does not work :( Why? 
    //ns.tprint(serverarray.n00dles.rootAccess);

    //cannot read properties of undefined (reading 'rootAccess')

}
