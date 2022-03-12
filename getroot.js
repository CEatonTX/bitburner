/*
getroot.js by Blackburd
This script will attempt to get root access on one server as specified by a command line argument. 
Useage:
run getroot.js target -t (num of threads)
*/

/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0];
	ns.tprint("Attempting to get root on server " + target);
	if (ns.serverExists(target)) {
		if (ns.hasRootAccess(target)) {  // Do we already have root access? if so we are done. 
			ns.tprint("I already have root access on " + target);
		}
		else {  // root access does not exsist. 

			// Case statement for number of ports required
			switch (ns.getServerNumPortsRequired(target)) {
				case 0:
					ns.tprint("Server requires 0 ports.");
					await ns.nuke(target);
					break;
				case 1:
					ns.tprint("Server requires 1 ports.");
					if (ns.fileExists("BruteSSH.exe")) { await ns.brutessh(target) } else { ns.tprint("Missing BruteSSH.exe") }
					await ns.nuke(target);
					break;
				case 2:
					ns.tprint("Server requires 2 ports.");
					if (ns.fileExists("BruteSSH.exe")) { await ns.brutessh(target) } else { ns.tprint("Missing BruteSSH.exe") }
					if (ns.fileExists("FTPCrack.exe")) { await ns.ftpcrack(target) } else { ns.tprint("Missing FTPCrack.exe") }
					await ns.nuke(target);
					break;
				case 3:
					ns.tprint("Server requires 3 ports.");
					if (ns.fileExists("BruteSSH.exe")) { await ns.brutessh(target) } else { ns.tprint("Missing BruteSSH.exe") }
					if (ns.fileExists("FTPCrack.exe")) { await ns.ftpcrack(target) } else { ns.tprint("Missing FTPCrack.exe") }
					if (ns.fileExists("relaySMTP.exe")) { await ns.relaysmtp(target) } else { ns.tprint("Missing relaySMTP.exe") }
					await ns.nuke(target);
					break;
				case 4:
					ns.tprint("Server requires 4 ports.");
					if (ns.fileExists("BruteSSH.exe")) { await ns.brutessh(target) } else { ns.tprint("Missing BruteSSH.exe") }
					if (ns.fileExists("FTPCrack.exe")) { await ns.ftpcrack(target) } else { ns.tprint("Missing FTPCrack.exe") }
					if (ns.fileExists("relaySMTP.exe")) { await ns.relaysmtp(target) } else { ns.tprint("Missing relaySMTP.exe") }
					if (ns.fileExists("HTTPWorm.exe")) { await ns.httpworm(target) } else { ns.tprint("Missing HTTPWorm.exe") }
					await ns.nuke(target);
					break;
				case 5:
					ns.tprint("Server requires 5 ports.");
					if (ns.fileExists("BruteSSH.exe")) { await ns.brutessh(target) } else { ns.tprint("Missing BruteSSH.exe") }
					if (ns.fileExists("FTPCrack.exe")) { await ns.ftpcrack(target) } else { ns.tprint("Missing FTPCrack.exe") }
					if (ns.fileExists("relaySMTP.exe")) { await ns.relaysmtp(target) } else { ns.tprint("Missing relaySMTP.exe") }
					if (ns.fileExists("HTTPWorm.exe")) { await ns.httpworm(target) } else { ns.tprint("Missing HTTPWorm.exe") }
					if (ns.fileExists("SQLInject.exe")) { await ns.sqlinject(target) } else { ns.tprint("Missing SQLInject.exe") }
					await ns.nuke(target);
					break;
			}
			if (ns.hasRootAccess(target)) { ns.tprint("I now have root access on " + target) } else { ns.tprint("I still do not have root access on " + target) }
		}
	}
	else {  // Server targeted does not exist. 
		ns.tprint("Target server " + target + " does not exsist.");
	}
}
