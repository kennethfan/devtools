"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Common OUI prefixes (first 3 bytes of MAC address)
const ouiDatabase: Record<string, { vendor: string; short: string }> = {
  "000000": { vendor: "Xerox Corporation", short: "Xerox" },
  "000001": { vendor: "Xerox Corporation", short: "Xerox" },
  "00000C": { vendor: "Cisco Systems", short: "Cisco" },
  "00000E": { vendor: "Fujitsu Limited", short: "Fujitsu" },
  "000010": { vendor: "Sytek Inc.", short: "Sytek" },
  "00001A": { vendor: "AMD", short: "AMD" },
  "00001B": { vendor: "Novell Inc.", short: "Novell" },
  "00001C": { vendor: "JDR Microdevices", short: "JDR" },
  "00001D": { vendor: "Cabletron Systems", short: "Cabletron" },
  "000020": { vendor: "DIAB", short: "DIAB" },
  "000022": { vendor: "Visual Technology", short: "Visual" },
  "00002A": { vendor: "TRW", short: "TRW" },
  "000032": { vendor: "Marconi plc", short: "Marconi" },
  "000037": { vendor: "Oxford Metrics Ltd", short: "Oxford" },
  "00003B": { vendor: "i Controls Inc.", short: "iControls" },
  "00003C": { vendor: "Auspex Systems Inc.", short: "Auspex" },
  "00003D": { vendor: "AT&T", short: "AT&T" },
  "00004B": { vendor: "APT Communications Inc.", short: "APT" },
  "00004F": { vendor: "Logicraft Inc.", short: "Logicraft" },
  "000050": { vendor: "Radisys Corporation", short: "Radisys" },
  "000051": { vendor: "HOB Electronic GmbH", short: "HOB" },
  "000052": { vendor: "Intrusion.com", short: "Intrusion" },
  "000056": { vendor: "DATAPOINT CORPORATION", short: "Datapoint" },
  "00005A": { vendor: "S & Koch", short: "S&Koch" },
  "00005B": { vendor: "Albert & Ziegler", short: "Albert" },
  "00005C": { vendor: "Telematics International", short: "Telematics" },
  "00005D": { vendor: "CS Telecom", short: "CS Telecom" },
  "00005E": { vendor: "IANA", short: "IANA" },
  "00005F": { vendor: "Sumitomo Electric", short: "Sumitomo" },
  "000060": { vendor: "Kontron Electronics GmbH", short: "Kontron" },
  "000062": { vendor: "Bull HN Information Systems", short: "Bull" },
  "000063": { vendor: "Barco Control Rooms GmbH", short: "Barco" },
  "000064": { vendor: "Yokogawa Electric Corporation", short: "Yokogawa" },
  "000065": { vendor: "Network General Corporation", short: "Net General" },
  "000066": { vendor: "Talaris Systems Inc.", short: "Talaris" },
  "000067": { vendor: "Soft * Rite, Inc.", short: "Soft*Rite" },
  "000068": { vendor: "Rosemount Controls", short: "Rosemount" },
  "000069": { vendor: "Concord Communications", short: "Concord" },
  "00006A": { vendor: "Computer Consoles Inc.", short: "Comp Consoles" },
  "00006B": { vendor: "Silicon Graphics", short: "SGI" },
  "00006C": { vendor: "Private", short: "Private" },
  "00006D": { vendor: "Cray Communications, Ltd.", short: "Cray" },
  "00006E": { vendor: "Artisoft, Inc.", short: "Artisoft" },
  "00006F": { vendor: "Madge Ltd.", short: "Madge" },
  "000070": { vendor: "HCL Limited", short: "HCL" },
  "000071": { vendor: "Adra Systems Inc.", short: "Adra" },
  "000072": { vendor: "Miniware Technology", short: "Miniware" },
  "000073": { vendor: "Siecor Corporation", short: "Siecor" },
  "000074": { vendor: "Ricoh Company, Ltd.", short: "Ricoh" },
  "000075": { vendor: "Northwestern University", short: "Northwestern" },
  "000076": { vendor: "Bay Networks", short: "Bay Networks" },
  "000077": { vendor: "Interphase Corporation", short: "Interphase" },
  "000078": { vendor: "Labtam Australia Pty. Ltd.", short: "Labtam" },
  "000079": { vendor: "Net Ware, Inc.", short: "NetWare" },
  "00007A": { vendor: "Dana Computer Inc.", short: "Dana" },
  "00007B": { vendor: "Research Machines", short: "Research" },
  "00007C": { vendor: "Ampere Incorporated", short: "Ampere" },
  "00007D": { vendor: "Oracle Corporation", short: "Oracle" },
  "00007E": { vendor: "Clustrix Corp", short: "Clustrix" },
  "00007F": { vendor: "Linotype-Hell AG", short: "Linotype" },
  "000080": { vendor: "Cray Communications A/S", short: "Cray" },
  "000081": { vendor: "Bay Networks", short: "Bay Networks" },
  "000082": { vendor: "Lexmark International, Inc.", short: "Lexmark" },
  "000083": { vendor: "Tektronix, Inc.", short: "Tektronix" },
  "000084": { vendor: "Aquila Technologies", short: "Aquila" },
  "000085": { vendor: "Canon Inc.", short: "Canon" },
  "000086": { vendor: "Megahertz Corporation", short: "Megahertz" },
  "000087": { vendor: "Hitachi, Ltd.", short: "Hitachi" },
  "000088": { vendor: "Brocade Communications Systems LLC", short: "Brocade" },
  "000089": { vendor: "Cayman Systems Inc.", short: "Cayman" },
  "00008A": { vendor: "Datahouse Information Systems", short: "Datahouse" },
  "00008B": { vendor: "Infotron", short: "Infotron" },
  "00008C": { vendor: "Alloy Computer Products", short: "Alloy" },
  "00008D": { vendor: "Cryptek Inc.", short: "Cryptek" },
  "00008E": { vendor: "Solbourne Computer Inc.", short: "Solbourne" },
  "00008F": { vendor: "Raytheon", short: "Raytheon" },
  "000090": { vendor: "Microcom", short: "Microcom" },
  "000091": { vendor: "Anritsu Corporation", short: "Anritsu" },
  "000092": { vendor: "Cogent Data Technologies", short: "Cogent" },
  "000093": { vendor: "Proteon Inc.", short: "Proteon" },
  "000094": { vendor: "Asante Technologies", short: "Asante" },
  "000095": { vendor: "Sony Corporation", short: "Sony" },
  "000096": { vendor: "Marconi Electronics Ltd.", short: "Marconi" },
  "000097": { vendor: "EMC Corporation", short: "EMC" },
  "000098": { vendor: "Crosscomm Corporation", short: "Crosscomm" },
  "000099": { vendor: "MTX, Inc.", short: "MTX" },
  "00009A": { vendor: "RC Computer A/S", short: "RC Computer" },
  "00009B": { vendor: "Information International", short: "Info Intl" },
  "00009C": { vendor: "Rolm Mil-Spec Computers", short: "Rolm" },
  "00009D": { vendor: "Locus Computing Corp.", short: "Locus" },
  "00009E": { vendor: "Marli S.A.", short: "Marli" },
  "00009F": { vendor: "Ameristar Technologies", short: "Ameristar" },
  "0000A0": { vendor: "Sanyo Electric Co., Ltd.", short: "Sanyo" },
  "0000A1": { vendor: "Marconi plc", short: "Marconi" },
  "0000A2": { vendor: "Bay Networks", short: "Bay Networks" },
  "0000A3": { vendor: "Nortel Networks", short: "Nortel" },
  "0000A4": { vendor: "ABOX Co., Ltd.", short: "ABOX" },
  "0000A5": { vendor: "Intel Corporation", short: "Intel" },
  "0000A6": { vendor: "Network Solutions", short: "Net Solutions" },
  "0000A7": { vendor: "Toyota Motor Corporation", short: "Toyota" },
  "0000A8": { vendor: "Us Army", short: "US Army" },
  "0000A9": { vendor: "Network General Corporation", short: "Net General" },
  "0000AA": { vendor: "Xerox Corporation", short: "Xerox" },
  "0000AB": { vendor: "Logic Modeling", short: "Logic" },
  "0000AC": { vendor: "Conware Computer Consulting", short: "Conware" },
  "0000AD": { vendor: "Bruker Instruments Inc.", short: "Bruker" },
  "0000AE": { vendor: "Dassault Electronique", short: "Dassault" },
  "0000AF": { vendor: "Nuclear Data Instrumentation", short: "Nuclear" },
  "0000B0": { vendor: "RND-RAD Network Devices", short: "RND" },
  "0000B1": { vendor: "Alpha Microsystems Inc.", short: "Alpha" },
  "0000B2": { vendor: "Televideo Systems, Inc.", short: "Televideo" },
  "0000B3": { vendor: "CIMLinx Inc.", short: "CIMLinx" },
  "0000B4": { vendor: "Edimax Technology Co., Ltd.", short: "Edimax" },
  "0000B5": { vendor: "Datability Software Sys. Inc.", short: "Datability" },
  "0000B6": { vendor: "Micro-matic Research", short: "Micro-matic" },
  "0000B7": { vendor: "Dove Computer Corporation", short: "Dove" },
  "0000B8": { vendor: "Seiko Epson Corporation", short: "Epson" },
  "0000B9": { vendor: "Apricot Ltd.", short: "Apricot" },
  "0000BA": { vendor: "IBM", short: "IBM" },
  "0000BB": { vendor: "TADpole Technology Inc.", short: "TADpole" },
  "0000BC": { vendor: "Normal Microwave", short: "Normal" },
  "0000BD": { vendor: "SeaInfo", short: "SeaInfo" },
  "0000BE": { vendor: "Boeing Defense & Space", short: "Boeing" },
  "0000BF": { vendor: "Ballyul", short: "Ballyul" },
  "0000C0": { vendor: "Westinghouse Electric Corp.", short: "Westinghouse" },
  "0000C1": { vendor: "CERN", short: "CERN" },
  "0000C2": { vendor: "Dr. B. Struck", short: "Struck" },
  "0000C3": { vendor: "Mikroind", short: "Mikroind" },
  "0000C4": { vendor: "SysKonnect", short: "SysKonnect" },
  "0000C5": { vendor: "ExperData", short: "ExperData" },
  "0000C6": { vendor: "Swiss Federal Institute of Technology", short: "ETH Zurich" },
  "0000C7": { vendor: "Cray Communications", short: "Cray" },
  "080027": { vendor: "PCS Systemtechnik GmbH (VirtualBox)", short: "VirtualBox" },
  "080069": { vendor: "Cisco-Linksys", short: "Linksys" },
  "001122": { vendor: "Test MAC", short: "Test" },
  "001C42": { vendor: "Parallels", short: "Parallels" },
  "001E52": { vendor: "Cisco-Linksys", short: "Linksys" },
  "002275": { vendor: "Western Digital", short: "WD" },
  "0023CD": { vendor: "Cisco-Linksys", short: "Linksys" },
  "0023DF": { vendor: "Netgear", short: "Netgear" },
  "0025D3": { vendor: "Hewlett Packard", short: "HP" },
  "0026B9": { vendor: "D-Link", short: "D-Link" },
  "00270E": { vendor: "Netgear", short: "Netgear" },
  "002710": { vendor: "Belkin", short: "Belkin" },
  "003065": { vendor: "Cisco-Linksys", short: "Linksys" },
  "0050F2": { vendor: "Microsoft", short: "Microsoft" },
  "0050C2": { vendor: "IEEE 802.11", short: "WiFi" },
  "00E04C": { vendor: "Realtek", short: "Realtek" },
  "3C5AB4": { vendor: "Google", short: "Google" },
  "448502": { vendor: "Samsung", short: "Samsung" },
  "4C5263": { vendor: "Huawei", short: "Huawei" },
  "5C7D5E": { vendor: "TP-Link", short: "TP-Link" },
  "6C3E6D": { vendor: "Apple", short: "Apple" },
  "74DA38": { vendor: "ASUS", short: "ASUS" },
  "94E976": { vendor: "Cameo (Tenda)", short: "Tenda" },
  "A49691": { vendor: "Apple", short: "Apple" },
  "AC37DC": { vendor: "Netgear", short: "Netgear" },
  "B0BE76": { vendor: "TP-Link", short: "TP-Link" },
  "B4A7C9": { vendor: "Huawei", short: "Huawei" },
  "BCF5A4": { vendor: "ASUSTek", short: "ASUS" },
  "C0C5C2": { vendor: "Samsung", short: "Samsung" },
  "CC46D6": { vendor: "Cisco-Linksys", short: "Linksys" },
  "D46E0F": { vendor: "iRobot", short: "iRobot" },
  "D89E3F": { vendor: "IEEE 802.15.4", short: "ZigBee" },
  "E006E6": { vendor: "Apple", short: "Apple" },
  "E8FC60": { vendor: "IEEE 802.15.4", short: "ZigBee" },
  "F0EF86": { vendor: "Google", short: "Google" },
  "F41BA2": { vendor: "Samsung", short: "Samsung" },
};

const generateMac = (): string => {
  const hexDigits = "0123456789ABCDEF";
  let mac = "";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 2; j++) {
      mac += hexDigits[Math.floor(Math.random() * 16)];
    }
    if (i < 5) mac += ":";
  }
  return mac;
};

const isMulticast = (mac: string): boolean => {
  return (parseInt(mac.replace(/:/g, ""), 16) & 0x010000000000) !== 0;
};

const isBroadcast = (mac: string): boolean => {
  return mac.replace(/:/g, "") === "FFFFFFFFFFFF";
};

const isUnicast = (mac: string): boolean => {
  return !isMulticast(mac) && !isBroadcast(mac);
};

export function MacAddressTool() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ mac: string; oui: string; vendor: string; type: string } | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  const lookupVendor = (mac: string): { oui: string; vendor: string } => {
    const clean = mac.replace(/[:-]/g, "").toUpperCase();
    const oui = clean.slice(0, 6);
    
    // Try exact match first
    if (ouiDatabase[oui]) {
      return { oui, vendor: ouiDatabase[oui].vendor };
    }
    
    // Try lowercase
    const lowerOui = oui.toLowerCase();
    for (const [key, value] of Object.entries(ouiDatabase)) {
      if (key.toLowerCase() === lowerOui) {
        return { oui, vendor: value.vendor };
      }
    }
    
    return { oui, vendor: "Unknown" };
  };

  const handleLookup = () => {
    const mac = input.trim().toUpperCase();
    if (!mac) return;
    
    const { oui, vendor } = lookupVendor(mac);
    const type = isBroadcast(mac) ? "Broadcast" : isMulticast(mac) ? "Multicast" : "Unicast";
    
    setResult({ mac, oui, vendor, type });
  };

  const handleGenerate = () => {
    const count = 5;
    const newMacs = Array.from({ length: count }, () => generateMac());
    setGenerated(newMacs);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">MAC Address Lookup</h1>
        <p className="text-muted-foreground mb-6">
          Lookup MAC address vendor and generate random MAC addresses
        </p>

        {/* Lookup */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">MAC Address Lookup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">MAC Address</label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="AA:BB:CC:DD:EE:FF or AABBCCDDEEFF"
                className="font-mono"
              />
            </div>
            <Button onClick={handleLookup} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Lookup
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">MAC Address</div>
                  <code className="font-mono text-lg">{result.mac}</code>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">OUI (First 3 bytes)</div>
                  <code className="font-mono text-lg">{result.oui}</code>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Vendor</div>
                  <code className="font-mono text-lg">{result.vendor}</code>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Address Type</div>
                  <code className="font-mono text-lg">{result.type}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generator */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Random MAC Generator</CardTitle>
            <Button variant="outline" size="sm" onClick={handleGenerate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardHeader>
          <CardContent>
            {generated.length > 0 ? (
              <div className="space-y-2">
                {generated.map((mac, i) => {
                  const { vendor } = lookupVendor(mac);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                      onClick={() => handleCopy(mac, `mac-${i}`)}
                    >
                      <div>
                        <code className="font-mono">{mac}</code>
                        <span className="text-sm text-muted-foreground ml-4">{vendor}</span>
                      </div>
                      {copied === `mac-${i}` && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Click "Generate" to create random MAC addresses
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}