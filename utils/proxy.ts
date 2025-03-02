const vlessTemplate =
  "vless://fc60147e-76b8-4bc5-b691-90b2da79e3d2@172.67.73.39:443?encryption=none&type=ws&host=nautica.foolvpn.me&security=tls&sni=nautica.foolvpn.me&path=%2F172.232.239.151-587#1%20%F0%9F%87%AE%F0%9F%87%A9%20Akamai%20Connected%20Cloud%20WS%20TLS%20[nautica]";
const trojanTemplate =
  "trojan://86768774-70b2-4c15-80c3-02066fb1e3b6@172.67.73.39:443?encryption=none&type=ws&host=nautica.foolvpn.me&security=tls&sni=nautica.foolvpn.me&path=%2F35.219.50.99-443#1%20%F0%9F%87%AE%F0%9F%87%A9%20Google%20Cloud%20WS%20TLS%20[nautica]";
const ssTemplate =
  "ss://bm9uZTpkMDIzMmM1NS1kZjE0LTRjMzMtYTMxOS1jNGM1NTVmMmIwZjQ%3D@172.67.73.39:443?encryption=none&type=ws&host=nautica.foolvpn.me&plugin=v2ray-plugin%3Btls%3Bmux%3D0%3Bmode%3Dwebsocket%3Bpath%3D%2F43.218.77.16-1443%3Bhost%3Dnautica.foolvpn.me&security=tls&sni=nautica.foolvpn.me&path=%2F43.218.77.16-1443#1%20%F0%9F%87%AE%F0%9F%87%A9%20Amazon.com%20WS%20TLS%20[nautica]";

type protocols = "trojan" | "vless" | "ss";
export type ProxySettings = {
  protocol: protocols;
  format: "mihomo" | "clash" | "sing-box" | "bfr" | "sfa" | "raw";

  // Etc
};

export function parseProxies(proxies: string[], settings: ProxySettings) {
  const proxyParser = new ParseProxies(proxies, settings.protocol);

  switch (settings.format) {
    case "raw":
      return proxyParser.toRaw();
    case "clash":
    case "mihomo":
      return proxyParser.toClash();
    case "sing-box":
      return proxyParser.toSingBox();
    case "sfa":
      return proxyParser.toSFA();
    case "bfr":
      return proxyParser.toBFR();
  }
}

class ParseProxies {
  proxies: string[] = [];
  format: protocols;

  constructor(proxies: string[], format: protocols) {
    this.proxies = proxies;
    this.format = format;
  }

  toRaw() {
    const results: string[] = [];
    if (this.format == "trojan") {
      let configTemplate = URL.parse(trojanTemplate);

      if (configTemplate) {
        for (const proxy of this.proxies) {
          let config = configTemplate;
          let configSearchParams = config?.searchParams;

          configSearchParams?.set("path", proxy.replace(":", "-"));
          config.hash = "Tes-" + proxy;

          config.search = configSearchParams.toString();
          results.push(config.toString());
        }
      }

      return results.join("\n");
    } else if (this.format == "vless") {
      const configTemplate = URL.parse(vlessTemplate);
    } else {
      const configTemplate = URL.parse(ssTemplate);
    }
  }

  // clash or mihomo
  toClash() {
    // todo
  }

  toSingBox() {
    // todo
  }

  toSFA() {
    // todo
  }

  toBFR() {
    // todo
  }
}
