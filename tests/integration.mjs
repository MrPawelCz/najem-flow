import assert from "node:assert/strict";
const origin = process.env.TEST_ORIGIN || "http://127.0.0.1:5173";
assert.match(
  origin,
  /^http:\/\/(127\.0\.0\.1|localhost):\d+$/,
  "Integration tests only run against loopback.",
);
const login = await fetch(origin + "/signin-with-chatgpt?return_to=/app", {
  redirect: "manual",
});
const cookie = login.headers.get("set-cookie")?.split(";")[0];
assert.ok(cookie, "Local test login");
async function request(path, body, authenticated = true) {
  const r = await fetch(origin + path, {
    method: body ? "POST" : "GET",
    headers: {
      ...(authenticated ? { cookie } : {}),
      ...(body ? { "Content-Type": "application/json", Origin: origin } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, body: await r.json() };
}
assert.equal((await request("/api/workspace", undefined, false)).status, 401);
const spoof = await fetch(origin + "/api/workspace", {
  headers: {
    "oai-authenticated-user-id": "attacker",
    "oai-authenticated-user-email": "fake@example.com",
  },
});
assert.equal(spoof.status, 401, "Headers cannot bypass local auth");
let {
  body: { state },
} = await request("/api/workspace", { action: "initialize" });
assert.ok(state.properties.length);
async function action(a) {
  const r = await request("/api/workspace", { ...a, version: state.version });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  state = r.body.state;
  return r.body;
}
const ordinary = {
  ...state.contracts[2].terms,
  kind: "ordinary",
  start: "2026-10-01",
  end: "2027-09-30",
  handover: "2026-10-01",
  signedDate: "2026-09-28",
  conditionDeadline: "2026-10-01",
  rent: 3100,
  deposit: 3100,
  signature: "ses",
  occupants: "Żaneta Testowa",
};
const base = {
  action: "contract",
  propertyId: state.properties[0].id,
  ownerId: state.people.find((p) => p.role === "owner").id,
  tenantId: state.people.find((p) => p.role === "tenant").id,
};
for (const kind of ["ordinary", "occasional"]) {
  const terms =
    kind === "ordinary"
      ? ordinary
      : {
          ...ordinary,
          kind,
          signature: "qes",
          alternativeAddress: "ul. Fikcyjna 99, Miasto Demo",
          alternativeOwner: "Osoba Testowa",
        };
  const { contractId } = await action({ ...base, terms });
  assert.ok(contractId);
  await action({ action: "owner-sign", id: contractId });
  const locked = await request("/api/workspace", {
    ...base,
    id: contractId,
    terms,
    version: state.version,
  });
  assert.equal(locked.status, 400, "Frozen document cannot be edited");
  const { signingPath } = await action({ action: "invite", id: contractId });
  assert.ok(signingPath);
  const get = await request("/api" + signingPath, undefined, false);
  assert.equal(get.status, 200);
  assert.equal(get.body.contract.terms.kind, kind);
  const refused = await request(
    "/api" + signingPath,
    { acceptDemo: false },
    false,
  );
  assert.equal(refused.status, 400);
  const signed = await request(
    "/api" + signingPath,
    { acceptDemo: true },
    false,
  );
  assert.equal(signed.status, 200);
  assert.equal(signed.body.contract.status, "signed");
  const duplicate = await request(
    "/api" + signingPath,
    { acceptDemo: true },
    false,
  );
  assert.equal(duplicate.status, 200, "Repeat confirmation is idempotent");
  state = (await request("/api/workspace")).body.state;
  assert.equal(
    state.contracts.find((c) => c.id === contractId).status,
    "signed",
  );
}
const bad = await request("/api/workspace", {
  ...base,
  terms: { ...ordinary, end: "2026-01-01" },
  version: state.version,
});
assert.equal(bad.status, 400, "Invalid dates");
const qes = await request("/api/workspace", {
  ...base,
  terms: {
    ...ordinary,
    kind: "occasional",
    alternativeAddress: "Test",
    alternativeOwner: "Test",
  },
  version: state.version,
});
assert.equal(qes.status, 400, "Occasional contract requires QES");
const stale = await request("/api/workspace", {
  ...base,
  terms: ordinary,
  version: 0,
});
assert.equal(stale.status, 409, "Stale writes rejected");
const foreign = await request("/api/workspace", {
  ...base,
  propertyId: "other-account-property",
  terms: ordinary,
  version: state.version,
});
assert.equal(foreign.status, 400, "Foreign entity IDs rejected");
const invalidToken = await request(
  "/api/sign/" + "a".repeat(64),
  undefined,
  false,
);
assert.equal(invalidToken.status, 404);
const csrf = await fetch(origin + "/api/workspace", {
  method: "POST",
  headers: {
    cookie,
    "Content-Type": "application/json",
    Origin: "https://other.example",
  },
  body: JSON.stringify({ action: "initialize" }),
});
assert.ok([400, 403].includes(csrf.status), "Cross-origin mutation rejected");
const { contractId: cancelled } = await action({ ...base, terms: ordinary });
await action({ action: "owner-sign", id: cancelled });
const { signingPath: revoked } = await action({
  action: "invite",
  id: cancelled,
});
await action({ action: "cancel", id: cancelled });
assert.equal(
  (await request("/api" + revoked, undefined, false)).status,
  404,
  "Cancelled invitation denied",
);
console.log(
  "PASS: ordinary and occasional lifecycle, persistence, immutable snapshots, idempotency, invalid data, auth, ownership, CSRF, optimistic concurrency, token revocation.",
);
