/*
hack.js by Blackburd
This script will weaken, grow and hack one server as specified by a command line argument. 
Useage:
run hack.js target -t (num of threads)
*/

/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];
	ns.tprint("Hacking server " + target);
	var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
	var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
	var loop = true;

	while (loop == true) {
		if (ns.hasRootAccess(target)) {
			if (ns.getServerSecurityLevel(target) > securityThresh) {
				await ns.weaken(target);
			} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
				await ns.grow(target);
			} else {
				await ns.hack(target);
			}
		}
		else {
			ns.tprint("Cannot hack server, attempting to get root access on " + target);
			ns.run("getroot.js", 1, target);
			await ns.sleep(60000); // Wait on minute and try again. 
		}
	}
}
