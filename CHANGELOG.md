## v2.1.0 <sup>19.03.2026</sup>

Dead code removal and module cleanup.

### Removed

* Deleted `lib/broadcasts/` directory — `Streamy.broadcast()` and `BroadCasts.allow()` were never called.
* Deleted `lib/direct_messages/` directory — `Streamy.sessions()`/`sessionsForUsers()` were never called; apps use `Streamy.sockets()` + `emit()` directly.
* Removed `Streamy.userId()` and `Streamy.user()` from `utils_client.js` and `utils_server.js` — never called externally; `Streamy.id()` is the supported accessor.
* Removed `reactive-var` dependency from `package.js` — only used by the dead userId tracking code.
* Removed `Streamy._usersId`, `Accounts.onLogin` hook, logout sniffing hack, and `socketsForUsers()` from `core_server.js`.
* Removed `Streamy.close()` from `core_client.js` — handler lifecycle is managed via `Connection.prototype.close()`.
* Removed `Streamy.BroadCasts` and `Streamy.DirectMessages` namespace stubs from `namespaces.js`.
* Deleted `examples/chat/` directory.

### Changed

* Cleaned up `hasOwnProperty` guard pattern in `connection.js` — replaced with `Object.keys()` iteration.
* Bumped version to `2.1.0` in `package.js` and `package.json`.

---

## v2.0.0 <sup>19.03.2026</sup>

Fork of `ferjep:streamy@1.5.0` under the `a4xrbj1` namespace with modernization and dependency cleanup.

### Breaking Changes

* Renamed package from `ferjep:streamy` to `a4xrbj1:streamy`.
* Requires Meteor 3.0+ (`api.versionsFrom('3.0')`).

### Dependency Removal

* Removed `underscore` dependency — replaced all `_.each`, `_.filter`, `_.isArray`, `_.isObject` with native JS equivalents (`forEach`, `filter`, `Array.isArray`, `typeof`).
* Removed unused `mongo` dependency.

### Code Modernization

* Converted all `var` declarations to `const`/`let`.

### Publishing

* Published to Atmosphere as `a4xrbj1:streamy`.
* Published to GitHub Packages as `@a4xrbj1/streamy`.
