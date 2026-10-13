import { describe, expect, it } from "vitest";
import { estimateBraSize } from "@/lib/sizing";

describe("estimation de la taille de soutien-gorge", () => {
  it("calcule le tour de dos français et le bonnet", () => {
    expect(estimateBraSize(75, 88)).toEqual({ status: "ok", bandEu: 75, bandFr: 90, cup: "A" });
    expect(estimateBraSize(75, 94)).toEqual({ status: "ok", bandEu: 75, bandFr: 90, cup: "D" });
    expect(estimateBraSize(68, 95)).toEqual({ status: "ok", bandEu: 70, bandFr: 85, cup: "H" });
  });

  it("arrondit le tour de dos au palier de 5 cm le plus proche", () => {
    const small = estimateBraSize(67, 85);
    const large = estimateBraSize(68, 86);
    expect(small.status === "ok" && small.bandEu).toBe(65);
    expect(large.status === "ok" && large.bandEu).toBe(70);
  });

  it("signale les tailles hors tableau sans inventer de bonnet", () => {
    expect(estimateBraSize(70, 110)).toMatchObject({ status: "hors-tableau", reason: "grand-bonnet" });
    expect(estimateBraSize(80, 89)).toMatchObject({ status: "hors-tableau", reason: "petit-bonnet" });
  });

  it("refuse les mesures incohérentes", () => {
    expect(estimateBraSize(90, 85).status).toBe("erreur");
    expect(estimateBraSize(20, 85).status).toBe("erreur");
    expect(estimateBraSize(Number.NaN, 85).status).toBe("erreur");
  });
});
