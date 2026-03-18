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
